#!/usr/bin/env node
/**
 * cert-audit.mjs — deterministic linter for the Cert book (architect-reference/).
 *
 * Part A of the independent review (see docs/plans / docs/audits). Runs the checks a
 * machine can settle exactly, so the agent layer spends tokens only on judgment.
 *
 * The build already guarantees that every <Citation src="KEY"/> resolves to a manifest
 * id (getEntry throws otherwise). It does NOT guarantee that the manifest id traces to a
 * real cached primary source, nor that any editorial rule actually holds. This script
 * closes that loop deterministically and emits a markdown report (stdout) that becomes
 * Appendix A of the audit doc.
 *
 * Usage:  node architect-reference/scripts/cert-audit.mjs [--json <path>]
 * Exit:   0 unless a hard FAIL-level check trips (missing required frontmatter, unresolved
 *         citation key, duplicate manifest id, disallowed margin label, instructor-PDF
 *         leak, missing structural section). WARN-level findings never fail the run — they
 *         are the audit's substance.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..', '..');
const CHAPTERS_DIR = path.join(REPO_ROOT, 'architect-reference', 'src', 'content', 'chapters');
const MANIFEST_PATH = path.join(REPO_ROOT, 'architect-reference', 'sources', 'manifest.yaml');
const RESEARCH_DIRS = ['docs/research', 'docs/research-program'].map((d) => path.join(REPO_ROOT, d));

const REQUIRED_FRONTMATTER = [
  'title', 'part', 'chapter', 'volatility', 'tools_compared', 'cert_domains',
  'introduced_in_version', 'last_updated', 'last_verified', 'sources', 'description',
];
const VOLATILITY_ENUM = ['stable-principle', 'architectural-pattern', 'feature-surface'];
const APPROVED_LABELS = ['Official', 'Tip', 'Warning', 'Cost', 'Enterprise', 'Template', 'Note'];
const MARGIN_WORD_CAP = 25;
// Verbatim markers of the confidential instructor PDF; none may appear in published prose.
const PDF_SIGNATURES = [/instructor[_-]/i, /Claude\+Certified\+Architect/i, /Need to Know/i, /confidential/i];

/** Read a UTF-8 file. */
function read(file) {
  return fs.readFileSync(file, 'utf8');
}

/** Recursively list files under dir matching extension `ext` (returns [] if dir absent). */
function walk(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, ext));
    else if (entry.name.endsWith(ext)) out.push(full);
  }
  return out;
}

/** 1-based line number of a character offset within `text`. */
function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

/**
 * Split a frontmatter file into { data, body, bodyStartLine }.
 * Parses the YAML between the leading `---` fences with js-yaml.
 */
function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: null, body: raw, bodyStartLine: 1 };
  const data = yaml.load(m[1]);
  const bodyStartLine = m[0].split('\n').length;
  return { data, body: raw.slice(m[0].length), bodyStartLine };
}

/** Normalize a URL for comparison: lowercase host, drop protocol, trailing slash, fragment, query. */
function normalizeUrl(u) {
  if (!u || typeof u !== 'string') return '';
  return u
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/[#?].*$/, '')
    .replace(/\/+$/, '')
    .toLowerCase();
}

/** Load the manifest as { entries:[{id,url,...}], duplicateIds:[...] }. */
function loadManifest() {
  const entries = yaml.load(read(MANIFEST_PATH));
  const seen = new Map();
  const duplicateIds = [];
  for (const e of entries) {
    if (seen.has(e.id)) duplicateIds.push(e.id);
    else seen.set(e.id, e);
  }
  return { entries, byId: seen, duplicateIds };
}

/** Load all 30 chapters as [{name, raw, data, body, bodyStartLine}], sorted by filename. */
function loadChapters() {
  return walk(CHAPTERS_DIR, '.mdx')
    .sort()
    .map((file) => {
      const raw = read(file);
      const { data, body, bodyStartLine } = parseFrontmatter(raw);
      return { name: path.basename(file), file, raw, data, body, bodyStartLine };
    });
}

/**
 * Index the research caches by normalized source URL.
 * Returns { urls: Set<normUrl>, byUrl: Map<normUrl, string[]> } where the array holds
 * repo-relative cache file paths (for feeding reviewer agents the backing sources).
 */
function loadCache() {
  const urls = new Set();           // lenient: source_url ∪ canonical_url ∪ url (for the backing check)
  const bySourceUrl = new Map();    // precise: source_url only (the file's own identity, for the read-set)
  const add = (map, n, rel) => {
    if (!map.has(n)) map.set(n, []);
    if (!map.get(n).includes(rel)) map.get(n).push(rel);
  };
  for (const dir of RESEARCH_DIRS) {
    for (const file of walk(dir, '.md')) {
      const { data } = parseFrontmatter(read(file));
      if (!data) continue;
      const rel = path.relative(REPO_ROOT, file);
      for (const key of ['source_url', 'canonical_url', 'url']) {
        if (data[key]) urls.add(normalizeUrl(data[key]));
      }
      if (data.source_url) add(bySourceUrl, normalizeUrl(data.source_url), rel);
    }
  }
  return { urls, bySourceUrl };
}

/**
 * Resolve each chapter's frontmatter `sources` keys to their backing cache file paths.
 * Returns { chapterName: [{ key, url, cacheFiles:[rel] }] } — the agent layer's read list.
 */
function buildChapterSourceMap(chapters, manifest, cache) {
  const map = {};
  for (const ch of chapters) {
    map[ch.name] = (ch.data?.sources ?? []).map((key) => {
      const entry = manifest.byId.get(key);
      const url = entry?.url ?? null;
      const cacheFiles = url ? (cache.bySourceUrl.get(normalizeUrl(url)) ?? []) : [];
      return { key, url, cacheFiles };
    });
  }
  return map;
}

/** A finding: { level: 'FAIL'|'WARN'|'INFO', loc: 'file:line', msg }. */
function finding(level, loc, msg) {
  return { level, loc, msg };
}

// ── Check 1: frontmatter completeness ────────────────────────────────────────
function checkFrontmatter(chapters) {
  const out = [];
  for (const ch of chapters) {
    if (!ch.data) { out.push(finding('FAIL', ch.name, 'no parseable frontmatter')); continue; }
    for (const key of REQUIRED_FRONTMATTER) {
      if (ch.data[key] === undefined) out.push(finding('FAIL', ch.name, `missing frontmatter key: ${key}`));
    }
    if (ch.data.volatility && !VOLATILITY_ENUM.includes(ch.data.volatility))
      out.push(finding('FAIL', ch.name, `volatility "${ch.data.volatility}" not in enum`));
    if (Array.isArray(ch.data.sources) && ch.data.sources.length === 0)
      out.push(finding('FAIL', ch.name, 'sources: is empty'));
    for (const key of ['last_updated', 'last_verified']) {
      const v = ch.data[key];
      // js-yaml coerces an unquoted yyyy-mm-dd to a Date — valid, and the template's own convention.
      if (v === undefined || v instanceof Date) continue;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(v)))
        out.push(finding('WARN', ch.name, `${key} not ISO yyyy-mm-dd: ${v}`));
    }
  }
  return { id: 1, title: 'Frontmatter completeness', findings: out };
}

// ── Check 2: every cited / declared key resolves in the manifest ─────────────
function checkCitationResolution(chapters, byId) {
  const out = [];
  for (const ch of chapters) {
    for (const m of ch.body.matchAll(/<Citation\s+src=["']([^"']+)["']/g)) {
      if (!byId.has(m[1]))
        out.push(finding('FAIL', `${ch.name}:${ch.bodyStartLine + lineOf(ch.body, m.index) - 1}`,
          `<Citation src="${m[1]}"> not in manifest`));
    }
    for (const key of ch.data?.sources ?? []) {
      if (!byId.has(key)) out.push(finding('FAIL', ch.name, `frontmatter source "${key}" not in manifest`));
    }
  }
  return { id: 2, title: 'Citation key resolution', findings: out };
}

// ── Check 3: each manifest id used by a chapter traces to a cached source_url ─
function checkCitationBacking(chapters, manifest, cacheUrls) {
  const out = [];
  const used = new Set();
  for (const ch of chapters) for (const key of ch.data?.sources ?? []) used.add(key);
  for (const key of [...used].sort()) {
    const entry = manifest.byId.get(key);
    if (!entry) continue; // resolution handled by check 2
    if (!cacheUrls.has(normalizeUrl(entry.url)))
      out.push(finding('WARN', `manifest:${key}`,
        `url not backed by any cached source_url: ${entry.url}`));
  }
  return { id: 3, title: 'Citation→cache backing', findings: out };
}

// ── Check 4: no duplicate manifest ids ───────────────────────────────────────
function checkManifestDuplicates(manifest) {
  const out = manifest.duplicateIds.map((id) => finding('FAIL', 'manifest.yaml', `duplicate id: ${id}`));
  return { id: 4, title: 'Manifest duplicate ids', findings: out };
}

// ── Check 5: MarginNote 25-word body cap ─────────────────────────────────────
function checkMarginWordCap(chapters) {
  const out = [];
  for (const ch of chapters) {
    for (const m of ch.body.matchAll(/<MarginNote\b[^>]*>([\s\S]*?)<\/MarginNote>/g)) {
      const words = m[1]
        .replace(/<[^>]+>/g, ' ')                 // strip nested tags
        .replace(/[*_`[\]()]/g, ' ')              // strip md emphasis / link punctuation
        .replace(/https?:\/\/\S+/g, ' ')          // a bare URL is not a "word"
        .trim().split(/\s+/).filter(Boolean);
      if (words.length > MARGIN_WORD_CAP)
        out.push(finding('WARN', `${ch.name}:${ch.bodyStartLine + lineOf(ch.body, m.index) - 1}`,
          `MarginNote body is ${words.length} words (cap ${MARGIN_WORD_CAP})`));
    }
  }
  return { id: 5, title: 'MarginNote 25-word cap', findings: out };
}

// ── Check 6: MarginNote label whitelist ──────────────────────────────────────
function checkApprovedLabels(chapters) {
  const out = [];
  for (const ch of chapters) {
    for (const m of ch.body.matchAll(/<MarginNote\b[^>]*\blabel=["']([^"']+)["']/g)) {
      if (!APPROVED_LABELS.includes(m[1]))
        out.push(finding('FAIL', `${ch.name}:${ch.bodyStartLine + lineOf(ch.body, m.index) - 1}`,
          `MarginNote label "${m[1]}" not in approved set`));
    }
  }
  return { id: 6, title: 'Approved MarginNote labels', findings: out };
}

// ── Check 7: every <Tag> claim co-locates a <Citation> on the same line ──────
function checkTagCitationPairing(chapters) {
  const out = [];
  for (const ch of chapters) {
    const lines = ch.body.split('\n');
    lines.forEach((line, i) => {
      const tags = (line.match(/<Tag\s+kind=/g) || []).length;
      const cites = (line.match(/<Citation\s+src=/g) || []).length;
      if (tags > cites)
        out.push(finding('WARN', `${ch.name}:${ch.bodyStartLine + i}`,
          `${tags} <Tag> but ${cites} <Citation> on the line (unsourced assertion?)`));
    });
  }
  return { id: 7, title: 'Tag/Citation pairing', findings: out };
}

// ── Check 8: no verbatim instructor-PDF leakage ──────────────────────────────
function checkPdfLeakage(chapters) {
  const out = [];
  for (const ch of chapters) {
    ch.body.split('\n').forEach((line, i) => {
      for (const sig of PDF_SIGNATURES) {
        if (sig.test(line))
          out.push(finding('FAIL', `${ch.name}:${ch.bodyStartLine + i}`,
            `possible instructor-PDF / confidential marker: ${sig}`));
      }
    });
  }
  return { id: 8, title: 'Instructor-PDF leakage', findings: out };
}

// ── Check 9: structural sections present; Exam essentials last ───────────────
function checkStructure(chapters) {
  const out = [];
  for (const ch of chapters) {
    for (const tok of ['<YouWillLearn', '## Practice', '## Exam essentials']) {
      if (!ch.body.includes(tok)) out.push(finding('FAIL', ch.name, `missing ${tok}`));
    }
    const headings = [...ch.body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
    if (headings.length && headings[headings.length - 1] !== 'Exam essentials')
      out.push(finding('WARN', ch.name, `last ## heading is "${headings[headings.length - 1]}", not Exam essentials`));
    const content = headings.filter((h) => h !== 'Practice' && h !== 'Exam essentials').length;
    if (content < 3 || content > 6)
      out.push(finding('WARN', ch.name, `${content} content sections (expected 4–5)`));
  }
  return { id: 9, title: 'Structural presence', findings: out };
}

// ── Check 10: strict-live phantom guards (no fabricated material crept back) ──
function checkPhantomGuards(chapters) {
  const out = [];
  const by = (n) => chapters.find((c) => c.name.startsWith(n));
  // errorCategory belongs to D2.2 only — must not appear in D4/D5 prose.
  for (const ch of chapters.filter((c) => /^d[45]-/.test(c.name))) {
    ch.body.split('\n').forEach((line, i) => {
      if (line.includes('errorCategory'))
        out.push(finding('WARN', `${ch.name}:${ch.bodyStartLine + i}`, 'errorCategory leaked into D4/D5'));
    });
  }
  // D5.3 must omit the unverified "85% → 20%" multi-agent folklore.
  const d53 = by('d5-03');
  if (d53) d53.body.split('\n').forEach((line, i) => {
    if (/\b85\s?%/.test(line) || /\b20\s?%/.test(line))
      out.push(finding('WARN', `${d53.name}:${d53.bodyStartLine + i}`, 'possible 85%/20% folklore in D5.3'));
  });
  // D5.1 names lost-in-the-middle but must attribute it outward — flag only when a Citation
  // attaches to the phrase (within 60 chars after it), not when it merely co-occurs on a long line.
  const d51 = by('d5-01');
  if (d51) d51.body.split('\n').forEach((line, i) => {
    if (/lost-in-the-middle[^\n]{0,60}<Citation/i.test(line))
      out.push(finding('WARN', `${d51.name}:${d51.bodyStartLine + i}`, 'lost-in-the-middle carries a cache Citation'));
  });
  // D4.4 must mark the SDK's internal retry count as undocumented rather than invent a number.
  const d44 = by('d4-04');
  if (d44 && !/retry count is (undocumented|undisclosed|not (documented|disclosed))/i.test(d44.body))
    out.push(finding('WARN', d44.name, 'D4.4 does not explicitly mark the SDK retry count as undocumented'));
  return { id: 10, title: 'Phantom-guard regressions', findings: out };
}

// ── Check 11: GitHub-blob outward links resolve to a real file on disk ────────
function checkOutwardLinks(chapters) {
  const out = [];
  const prefix = 'https://github.com/brandon-behring/claude-books/blob/main/';
  for (const ch of chapters) {
    for (const m of ch.body.matchAll(/https:\/\/github\.com\/brandon-behring\/claude-books\/blob\/main\/([^)\s#]+)/g)) {
      const target = path.join(REPO_ROOT, m[1]);
      if (!fs.existsSync(target))
        out.push(finding('WARN', `${ch.name}:${ch.bodyStartLine + lineOf(ch.body, m.index) - 1}`,
          `blob link target missing on disk: ${m[1]}`));
    }
  }
  return { id: 11, title: 'Outward-link integrity', findings: out };
}

/** Render the full markdown report from all check results. */
function renderReport(results, meta) {
  const L = [];
  const counts = (lvl) => results.reduce((n, r) => n + r.findings.filter((f) => f.level === lvl).length, 0);
  L.push('## Appendix A — Deterministic linter report');
  L.push('');
  L.push(`Generated by \`architect-reference/scripts/cert-audit.mjs\` over ${meta.chapters} chapters, ` +
    `${meta.manifestKeys} manifest keys, ${meta.cacheUrls} cached source URLs.`);
  L.push('');
  L.push(`**Totals:** ${counts('FAIL')} FAIL · ${counts('WARN')} WARN · ${counts('INFO')} INFO.`);
  L.push('');
  L.push('| # | Check | FAIL | WARN | Status |');
  L.push('|---|---|---:|---:|---|');
  for (const r of results) {
    const f = r.findings.filter((x) => x.level === 'FAIL').length;
    const w = r.findings.filter((x) => x.level === 'WARN').length;
    const status = f ? '🔴 FAIL' : w ? '🟡 WARN' : '🟢 PASS';
    L.push(`| ${r.id} | ${r.title} | ${f} | ${w} | ${status} |`);
  }
  L.push('');
  for (const r of results) {
    if (!r.findings.length) continue;
    L.push(`### Check ${r.id} — ${r.title}`);
    L.push('');
    for (const f of r.findings) L.push(`- **${f.level}** \`${f.loc}\` — ${f.msg}`);
    L.push('');
  }
  return L.join('\n');
}

function main() {
  const manifest = loadManifest();
  const chapters = loadChapters();
  const cache = loadCache();

  const results = [
    checkFrontmatter(chapters),
    checkCitationResolution(chapters, manifest.byId),
    checkCitationBacking(chapters, manifest, cache.urls),
    checkManifestDuplicates(manifest),
    checkMarginWordCap(chapters),
    checkApprovedLabels(chapters),
    checkTagCitationPairing(chapters),
    checkPdfLeakage(chapters),
    checkStructure(chapters),
    checkPhantomGuards(chapters),
    checkOutwardLinks(chapters),
  ];

  const meta = { chapters: chapters.length, manifestKeys: manifest.entries.length, cacheUrls: cache.urls.size };
  const report = renderReport(results, meta);
  process.stdout.write(report + '\n');

  const sourceMap = buildChapterSourceMap(chapters, manifest, cache);
  const jsonFlag = process.argv.indexOf('--json');
  if (jsonFlag !== -1 && process.argv[jsonFlag + 1]) {
    fs.writeFileSync(process.argv[jsonFlag + 1], JSON.stringify({ meta, results, sourceMap }, null, 2));
  }

  const fails = results.reduce((n, r) => n + r.findings.filter((f) => f.level === 'FAIL').length, 0);
  process.exit(fails ? 1 : 0);
}

main();

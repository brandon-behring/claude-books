#!/usr/bin/env node
/**
 * design-audit.mjs — deterministic linter for the Agentic Systems Design book.
 *
 * The Design sibling of architect-reference/scripts/cert-audit.mjs: it settles what a
 * machine can settle (frontmatter, citation resolution, the standalone no-XRef genre rule,
 * component-label vocab, freshness), so the adversarial reviewer layer spends tokens only on
 * judgment. Lean by design for an 11-chapter v0.1; cert-only checks (question bank, glossary,
 * DIKTA structure, instructor-PDF, examDomains, correctness-currency) are intentionally absent.
 *
 * Usage:  node agentic-systems-design/scripts/design-audit.mjs [--json <path>]
 * Exit:   0 unless a FAIL-level check trips. WARN/INFO never fail the run.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const BOOK_ROOT = path.resolve(SCRIPT_DIR, '..');                 // agentic-systems-design/
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..', '..');          // claude-books/
const CHAPTERS_DIR = path.join(BOOK_ROOT, 'src', 'content', 'chapters');
const MANIFEST_PATH = path.join(BOOK_ROOT, 'sources', 'manifest.yaml');
// Backing dossiers live outside the repo (vendored on extraction, per SPLIT.md). Presence-gated;
// override with DESIGN_DOSSIER_ROOT once the book is extracted and the dossiers re-home.
const DOSSIER_ROOT = process.env.DESIGN_DOSSIER_ROOT
  || path.resolve(REPO_ROOT, '..', 'research-dossiers');

// Required frontmatter for the tools profile (cert-only keys like last_reviewed are dropped).
const REQUIRED_FRONTMATTER = [
  'title', 'part', 'chapter', 'volatility', 'tools_compared', 'cert_domains',
  'introduced_in_version', 'last_updated', 'last_verified', 'sources', 'description',
];
const VOLATILITY_ENUM = ['stable-principle', 'architectural-pattern', 'feature-surface'];
const TAG_KINDS = ['official', 'practitioner', 'convergence'];
// Approved MarginNote labels: the workspace-standard set + `Caveat` (a deliberate Design label,
// 17 uses) so genuine usage is not flagged. See ../../CLAUDE.md editorial standards.
const APPROVED_LABELS = ['Official', 'Tip', 'Warning', 'Cost', 'Enterprise', 'Template', 'Note', 'Caveat'];
const MARGIN_VARIANTS = ['note', 'warning', 'tip'];
const MANIFEST_TIERS = ['T1-official', 'T2-release-notes', 'T3-practitioner', 'T4-conjecture'];
const STALE_AFTER_DAYS = { 'feature-surface': 45, 'architectural-pattern': 120, 'stable-principle': 180 };

// ── helpers (mirrors cert-audit.mjs) ─────────────────────────────────────────
const read = (f) => fs.readFileSync(f, 'utf8');

function walk(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full, ext));
    else if (e.name.endsWith(ext)) out.push(full);
  }
  return out;
}

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: null, body: raw, bodyStartLine: 1 };
  return { data: yaml.load(m[1]), body: raw.slice(m[0].length), bodyStartLine: m[0].split('\n').length };
}

// Component-usage checks (3/5/6/7) scan the body for `<Citation>`/`<XRef>`/`<Tag>`/`<MarginNote>`.
// A tools/MCP chapter legitimately *shows* that syntax inside a code example, which would
// false-FAIL (genre guard) or false-validate (citation/label/co-location). maskCode blanks
// every non-newline char inside fenced blocks and inline-code spans, leaving length and newline
// positions identical — so the match-index→line math downstream is unchanged.
const blankNonNewline = (s) => s.replace(/[^\n]/g, ' ');
function maskCode(body) {
  // Masks backtick + tilde fenced blocks and single-line inline code. Deliberately NOT masked
  // (and used by no chapter): 4+-backtick fences and 4-space-indented blocks — extend if one is
  // ever added. A full MDX parser would be over-engineering for content this linter controls.
  return body
    .replace(/```[\s\S]*?```/g, blankNonNewline)   // fenced blocks (backtick)
    .replace(/~~~[\s\S]*?~~~/g, blankNonNewline)    // fenced blocks (tilde)
    .replace(/`[^`\n]*`/g, blankNonNewline);        // inline code spans (single-line)
}

function normalizeUrl(u) {
  if (!u || typeof u !== 'string') return '';
  return u.trim().replace(/^https?:\/\//i, '').replace(/[#?].*$/, '').replace(/\/+$/, '').toLowerCase();
}

const finding = (level, loc, msg) => ({ level, loc, msg });

function loadManifest() {
  const entries = yaml.load(read(MANIFEST_PATH)) ?? [];
  const byId = new Map();
  const duplicateIds = [];
  for (const e of entries) {
    if (byId.has(e.id)) duplicateIds.push(e.id);
    else byId.set(e.id, e);
  }
  return { entries, byId, duplicateIds };
}

function loadChapters() {
  return walk(CHAPTERS_DIR, '.mdx').sort().map((file) => {
    const raw = read(file);
    const { data, body, bodyStartLine } = parseFrontmatter(raw);
    // `scan` = body with code fences/inline-code masked; component checks (3/5/6/7) use it so
    // component syntax shown in examples isn't mistaken for live usage. Same length as `body`.
    return { name: path.basename(file), file, raw, data, body, scan: maskCode(body), bodyStartLine };
  });
}

/** Best-effort backing index: every http(s) URL found in the dossiers' ledger files. */
function loadDossierUrls() {
  if (!fs.existsSync(DOSSIER_ROOT)) return null; // signal "unavailable" → INFO-skip
  const urls = new Set();
  let ledgers = 0;
  for (const e of fs.readdirSync(DOSSIER_ROOT, { withFileTypes: true })) {
    if (!e.isDirectory() || !e.name.startsWith('research_agent_')) continue;
    for (const f of ['bib_ledger.yml', 'cache_manifest.yml', 'evidence_ledger.yml']) {
      const p = path.join(DOSSIER_ROOT, e.name, f);
      if (!fs.existsSync(p)) continue;
      ledgers++;
      for (const m of read(p).matchAll(/https?:\/\/[^\s"'`)\]}]+/g)) urls.add(normalizeUrl(m[0]));
    }
  }
  return ledgers ? urls : null;
}

// ── Check 1: frontmatter completeness + types ────────────────────────────────
function checkFrontmatter(chapters) {
  const out = [];
  for (const ch of chapters) {
    if (!ch.data) { out.push(finding('FAIL', ch.name, 'no parseable frontmatter')); continue; }
    for (const key of REQUIRED_FRONTMATTER)
      if (ch.data[key] === undefined) out.push(finding('FAIL', ch.name, `missing frontmatter key: ${key}`));
    if (ch.data.sources === null || (Array.isArray(ch.data.sources) && ch.data.sources.length === 0))
      out.push(finding('FAIL', ch.name, 'sources: is empty or null'));
    for (const key of ['last_updated', 'last_verified']) {
      const v = ch.data[key];
      if (v === undefined || v instanceof Date) continue;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(v)))
        out.push(finding('WARN', ch.name, `${key} not ISO yyyy-mm-dd: ${v}`));
    }
  }
  return { id: 1, title: 'Frontmatter completeness', findings: out };
}

// ── Check 2: volatility enum ──────────────────────────────────────────────────
function checkVolatility(chapters) {
  const out = [];
  for (const ch of chapters)
    if (ch.data?.volatility && !VOLATILITY_ENUM.includes(ch.data.volatility))
      out.push(finding('FAIL', ch.name, `volatility "${ch.data.volatility}" not in enum`));
  return { id: 2, title: 'Volatility enum', findings: out };
}

// ── Check 3: citation resolution (<Citation src> + frontmatter sources:) ──────
function checkCitationResolution(chapters, byId) {
  const out = [];
  for (const ch of chapters) {
    for (const key of ch.data?.sources ?? [])
      if (!byId.has(key)) out.push(finding('FAIL', ch.name, `frontmatter sources key not in manifest: ${key}`));
    for (const m of ch.scan.matchAll(/<Citation\s+src=["']([^"']+)["']/g))
      if (!byId.has(m[1]))
        out.push(finding('FAIL', `${ch.name}:${ch.bodyStartLine + lineOf(ch.scan, m.index) - 1}`,
          `<Citation src="${m[1]}"> not in manifest`));
  }
  return { id: 3, title: 'Citation resolution', findings: out };
}

// ── Check 4: manifest integrity (dup ids + tier enum) ─────────────────────────
function checkManifest(manifest) {
  const out = manifest.duplicateIds.map((id) => finding('FAIL', 'sources/manifest.yaml', `duplicate id: ${id}`));
  for (const e of manifest.entries)
    if (e.tier && !MANIFEST_TIERS.includes(e.tier))
      out.push(finding('FAIL', 'sources/manifest.yaml', `id "${e.id}" tier "${e.tier}" not in enum`));
  return { id: 4, title: 'Manifest integrity (dup ids + tier enum)', findings: out };
}

// ── Check 5: genre guard — standalone, no <XRef> ──────────────────────────────
function checkGenreGuard(chapters) {
  const out = [];
  for (const ch of chapters)
    for (const m of ch.scan.matchAll(/<XRef\b/g))
      out.push(finding('FAIL', `${ch.name}:${ch.bodyStartLine + lineOf(ch.scan, m.index) - 1}`,
        '<XRef> found — the Design book is standalone (no cross-book XRef in/out); use a prose breadcrumb'));
  return { id: 5, title: 'Genre guard (no <XRef>)', findings: out };
}

// ── Check 6: component label vocab (<MarginNote label/variant>, <Tag kind>) ───
function checkLabels(chapters) {
  const out = [];
  for (const ch of chapters) {
    for (const m of ch.scan.matchAll(/<MarginNote[^>]*\blabel=["']([^"']+)["']/g))
      if (!APPROVED_LABELS.includes(m[1]))
        out.push(finding('FAIL', ch.name, `MarginNote label "${m[1]}" not approved`));
    for (const m of ch.scan.matchAll(/<MarginNote[^>]*\bvariant=["']([^"']+)["']/g))
      if (!MARGIN_VARIANTS.includes(m[1]))
        out.push(finding('FAIL', ch.name, `MarginNote variant "${m[1]}" not in {${MARGIN_VARIANTS.join(',')}}`));
    for (const m of ch.scan.matchAll(/<Tag[^>]*\bkind=["']([^"']+)["']/g))
      if (!TAG_KINDS.includes(m[1]))
        out.push(finding('FAIL', ch.name, `Tag kind "${m[1]}" not in {${TAG_KINDS.join(',')}}`));
  }
  return { id: 6, title: 'Component label vocab', findings: out };
}

// ── Check 7: <Tag>/<Citation> co-location (advisory) ──────────────────────────
function checkTagCitationPairing(chapters) {
  const out = [];
  for (const ch of chapters)
    ch.scan.split('\n').forEach((line, i) => {
      // Count only per-claim assertion tags. `convergence` is a multi-source SUMMARY tag
      // (no 1:1 citation by design); counting it false-positives on every convergence line
      // and on backticked `<Tag kind="convergence">` mentions in prose.
      const tags = (line.match(/<Tag\s+kind=["'](?:official|practitioner)["']/g) || []).length;
      const cites = (line.match(/<Citation\s+src=/g) || []).length;
      if (tags > cites)
        out.push(finding('WARN', `${ch.name}:${ch.bodyStartLine + i}`,
          'official/practitioner assertion with no co-located <Citation> (evidence-honesty check)'));
    });
  return { id: 7, title: 'Tag/Citation co-location', findings: out };
}

// ── Check 8: freshness (last_verified vs volatility budget) ───────────────────
function checkFreshness(chapters) {
  const out = [];
  // Pin both sides to UTC midnight (js-yaml parses an unquoted yyyy-mm-dd to UTC midnight;
  // a local-time `now` would jitter ageDays by up to a day). Mirrors cert-audit.mjs.
  const now = process.env.DESIGN_AUDIT_TODAY
    ? new Date(`${process.env.DESIGN_AUDIT_TODAY}T00:00:00Z`)
    : new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`);
  for (const ch of chapters) {
    const v = ch.data?.last_verified;
    const budget = STALE_AFTER_DAYS[ch.data?.volatility];
    if (!v || !budget) continue;
    const d = v instanceof Date ? v : new Date(`${String(v)}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) continue;
    const ageDays = Math.floor((now - d) / 86400000);
    if (ageDays > budget)
      out.push(finding('WARN', ch.name, `last_verified ${ageDays}d old (> ${budget}d for ${ch.data.volatility})`));
  }
  return { id: 8, title: 'Chapter freshness', findings: out };
}

// ── Check 9: citation→dossier backing (best-effort, presence-gated) ───────────
function checkSourceBacking(chapters, manifest, dossierUrls) {
  if (!dossierUrls)
    return { id: 9, title: 'Citation→dossier backing', findings: [
      finding('INFO', DOSSIER_ROOT, 'backing index unavailable (no dossier ledgers found) — skipped'),
    ] };
  const used = new Set();
  for (const ch of chapters) for (const k of ch.data?.sources ?? []) used.add(k);
  const out = [];
  for (const key of used) {
    const url = manifest.byId.get(key)?.url;
    if (url && !dossierUrls.has(normalizeUrl(url)))
      out.push(finding('WARN', 'sources/manifest.yaml', `id "${key}" url not found in any dossier ledger`));
  }
  return { id: 9, title: 'Citation→dossier backing', findings: out };
}

function renderReport(results, meta) {
  const L = ['## Design-book deterministic linter report', ''];
  const count = (lvl) => results.reduce((n, r) => n + r.findings.filter((f) => f.level === lvl).length, 0);
  L.push(`Ran over ${meta.chapters} chapters, ${meta.manifestKeys} manifest ids, dossier-backing: ${meta.backing}.`, '');
  L.push(`**Totals:** ${count('FAIL')} FAIL · ${count('WARN')} WARN · ${count('INFO')} INFO.`, '');
  L.push('| # | Check | FAIL | WARN | Status |', '|---|---|---:|---:|---|');
  for (const r of results) {
    const f = r.findings.filter((x) => x.level === 'FAIL').length;
    const w = r.findings.filter((x) => x.level === 'WARN').length;
    L.push(`| ${r.id} | ${r.title} | ${f} | ${w} | ${f ? '🔴 FAIL' : w ? '🟡 WARN' : '🟢 PASS'} |`);
  }
  L.push('');
  for (const r of results) {
    if (!r.findings.length) continue;
    L.push(`### Check ${r.id} — ${r.title}`, '');
    for (const f of r.findings) L.push(`- **${f.level}** \`${f.loc}\` — ${f.msg}`);
    L.push('');
  }
  return L.join('\n');
}

function main() {
  const manifest = loadManifest();
  const chapters = loadChapters();
  const dossierUrls = loadDossierUrls();

  const results = [
    checkFrontmatter(chapters),
    checkVolatility(chapters),
    checkCitationResolution(chapters, manifest.byId),
    checkManifest(manifest),
    checkGenreGuard(chapters),
    checkLabels(chapters),
    checkTagCitationPairing(chapters),
    checkFreshness(chapters),
    checkSourceBacking(chapters, manifest, dossierUrls),
  ];

  const meta = {
    chapters: chapters.length,
    manifestKeys: manifest.entries.length,
    backing: dossierUrls ? `${dossierUrls.size} urls` : 'unavailable',
  };
  process.stdout.write(renderReport(results, meta) + '\n');

  const jsonFlag = process.argv.indexOf('--json');
  if (jsonFlag !== -1 && process.argv[jsonFlag + 1]) {
    const sourceMap = Object.fromEntries(chapters.map((ch) => [ch.name,
      (ch.data?.sources ?? []).map((key) => ({ key, url: manifest.byId.get(key)?.url ?? null }))]));
    fs.writeFileSync(process.argv[jsonFlag + 1], JSON.stringify({ meta, results, sourceMap }, null, 2));
  }

  const fails = results.reduce((n, r) => n + r.findings.filter((f) => f.level === 'FAIL').length, 0);
  process.exit(fails ? 1 : 0);
}

main();

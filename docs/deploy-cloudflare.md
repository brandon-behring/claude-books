# Deploy runbook — `claude-books.brandon-behring.dev`

**Mechanism: GitHub Actions → `brandon-behring/deploy-workflows`** (the *book* pattern — same as
ssm-foundations, double_ml_time_series, dlai-study-notes). **Not** Cloudflare Workers Builds (that's
the *guides* pattern). `.github/workflows/deploy.yml` runs `npm ci` + `npm run build` +
`wrangler deploy` on push to `main`.

**Model:** apex + subroutes via **combined-dist, one Worker** (`brandon-behring-claude-books`).
`scripts/assemble-hub.mjs` (run by the root `build`) builds each book into `dist/<subroute>/`
(`/architect/`, `/design/`, `/agentic-coding/`, `/handbook/`) + a hub landing; `wrangler.jsonc`
(`assets.directory = ./dist`) serves it.

> **Build command:** `npm run build` → `./dist`. It runs **in GitHub Actions**, not Cloudflare.

> ⚠️ **You connected a Cloudflare Workers Builds project for this repo — disconnect/delete it.** Books
> deploy via Actions; a Git-connected Workers Build is a *competing* pipeline (it's what produced the
> `Missing script: "build"` error — it was building `main`, which doesn't have the build script until
> PR #18 merges). Do **not** enter a build command in the CF dashboard.

---

## 1. Add the Cloudflare secrets (one-time)

`deploy.yml` uses `secrets: inherit`; the reusable workflow needs (per-repo, like ssm-foundations):

```bash
gh secret set CLOUDFLARE_ACCOUNT_ID -R brandon-behring/claude-books   # account brandon-m-behring
gh secret set CLOUDFLARE_API_TOKEN  -R brandon-behring/claude-books   # Workers Scripts: Edit
```

Reuse ssm-foundations' values or mint a fresh token (your call). claude-books currently has **none**.

> ⚠️ `gh secret set NAME` reads the **value from stdin** at the prompt — the argument is the *name*,
> not the value. Paste the value when prompted.

## 2. Make the repo public (after the sweep)

Gate: a full-history secret scan (`gitleaks detect`) is clean **and** no licensed/third-party content
is in the history (confirm the Manning bundle was only ever in the gitignored
`~/Claude/claude-books-research-inputs/`, never committed; confirm rights to publish the
research-program dossiers). Then flip visibility:

```bash
gh repo edit brandon-behring/claude-books --visibility public --accept-visibility-change-consequences
```

Public → matches every other book, free Actions CI, and lets the portfolio card carry a `repo_url`.

## 3. Deploy

Merge **PR #18** to `main`. The Actions deploy runs `npm run build` → `./dist` → `wrangler deploy`,
creating the `brandon-behring-claude-books` Worker.

## 4. Bind the domain

Cloudflare dashboard → **Workers & Pages → `brandon-behring-claude-books` → Settings → Domains &
Routes → Add → Custom Domain** → `claude-books.brandon-behring.dev`. DNS + cert provision
automatically (the zone is already on this account).

## 5. Verify

```bash
for s in architect design agentic-coding; do
  curl -s -o /dev/null -w "%{http_code}  /$s/\n" -L https://claude-books.brandon-behring.dev/$s/
done   # expect 200 each
```

`/handbook/` is served but **noindex** (`dist/robots.txt` → `Disallow: /handbook/`) and is omitted
from the hub landing until its v1.0.

## 6. After go-live

- **Archive the retired repos:** `book-template-astro` (its Agentic Coding content is now canonical in
  `claude-books/agentic-coding`) and `claude-code-field-guide`. `claude-best-practices` archives on
  *its* gate ("once the Handbook ships v1.0"). `gh repo archive brandon-behring/<repo>`.
- **Flip the `claude-books` card live** on brandon-behring.dev: `draft: false`, `site_url`, `repo_url`
  (public now), + 1–2 subroute deep-links.

---

## Reference — how it's wired

- Each book: `base: '/<subroute>/'` + `site: 'https://claude-books.brandon-behring.dev'`; all on
  scaffold `^4.25` (base-aware links, #140/#141 fixed).
- Root `npm run build` → builds every workspace, then `scripts/assemble-hub.mjs` assembles `dist/`.
- One Worker (`brandon-behring-claude-books`) serves `./dist`. No per-book Workers, no proxy.
- Supersedes the 2026-06-12 Pages/per-subdomain plan — see `docs/ROADMAP.md` → Deployment.

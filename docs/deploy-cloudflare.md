# Deploy runbook — `claude-books.brandon-behring.dev` (Cloudflare Worker)

**Model:** apex + subroutes via **combined-dist, one Worker**. `scripts/assemble-hub.mjs`
builds each book into `dist/<subroute>/` (`/architect/`, `/design/`, `/agentic-coding/`,
`/handbook/`) plus a hub landing at the root; `wrangler.toml` (`name = "claude-books"`,
`[assets] directory = "./dist"`) serves it. CI is `.github/workflows/deploy.yml` →
`brandon-behring/deploy-workflows` (`npm ci` + `npm run build` + `wrangler deploy`) on push to
`main`.

> The repo is deploy-ready and the build is validated locally. Everything below is the
> **user-side go-live** that can't be done from code (Cloudflare account + DNS).

**Build command:** `npm run build` (root → `./dist`). **Deploy:** `npx wrangler deploy`.
Both run **in GitHub Actions** (`deploy.yml` → `deploy-workflows`) — **not** in Cloudflare.

> ⚠️ If the Cloudflare dashboard is *asking you for a build command*, you're in the **Workers
> Builds / Connect-to-Git wizard — don't use it.** The build is Actions-owned; a Git-connected
> Workers Build creates a *competing* pipeline (known foot-gun, `brandon-behring.dev/CLAUDE.md`).
> Correct path: let the Actions deploy create the `claude-books` Worker (§2 Option A), then only
> **bind the domain**. Leave the build/deploy commands to CI.

---

## 1. Cloudflare credentials (one-time)

`deploy.yml` uses `secrets: inherit`, so the reusable workflow needs:

| Secret | What | Scope |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | API token | **Workers Scripts: Edit** (+ **Zone: Edit** on `brandon-behring.dev` only if you bind the domain via wrangler — Option B below) |
| `CLOUDFLARE_ACCOUNT_ID` | account id | account `brandon-m-behring` |

As of 2026-06-16 `claude-books` has **no `CLOUDFLARE_*` repo secrets**. Add them (or confirm
org-level secrets already cover this repo):

```bash
gh secret set CLOUDFLARE_API_TOKEN  -R brandon-behring/claude-books
gh secret set CLOUDFLARE_ACCOUNT_ID -R brandon-behring/claude-books
```

> ⚠️ **Foot-gun:** `gh secret set NAME` reads the **value from stdin** at the prompt — the
> argument is the *name*, not the value. Paste the value when prompted (don't put it on the
> command line, or the secret's *name* becomes your credential).

---

## 2. Create + attach the Worker

### Option A — CI creates it, you bind the domain in the dashboard *(recommended; matches the guides-hub flow)*

1. Merge **PR #18** (or push the branch to `main`). The Actions deploy runs `wrangler deploy`,
   which **creates the Worker `claude-books`** from `wrangler.toml`.
2. Cloudflare dashboard → **Workers & Pages → `claude-books` → Settings → Domains & Routes →
   Add → Custom Domain** → `claude-books.brandon-behring.dev`. DNS is already on this account,
   so the record + TLS cert provision automatically.
3. *(optional)* Add the Cloudflare **Web Analytics** token for hub analytics.

### Option B — bind the domain via wrangler (no dashboard)

Add to `wrangler.toml`, then redeploy:

```toml
[[routes]]
pattern = "claude-books.brandon-behring.dev"
custom_domain = true
```

Requires the API token to also have **Zone: Edit** on `brandon-behring.dev`. Skip if you
prefer the dashboard step in Option A.

---

## 3. Verify go-live

```bash
for s in architect design agentic-coding; do
  curl -s -o /dev/null -w "%{http_code}  /$s/\n" -L https://claude-books.brandon-behring.dev/$s/
done
# expect: 200 for each
```

`/handbook/` is served but **`noindex`** (`dist/robots.txt` → `Disallow: /handbook/`) and is
omitted from the hub landing until its v1.0.

---

## 4. After go-live

- **Archive the sunset LaTeX repos:** `claude-code-field-guide` (retired from the public
  lineup) now; `claude-best-practices` on *its* own gate ("once the Handbook ships v1.0").
  `gh repo archive brandon-behring/<repo>`.
- **Flip the `claude-books` card live** on brandon-behring.dev: `draft: false`, add
  `site_url: https://claude-books.brandon-behring.dev` + 1–2 subroute deep-links.

---

## Reference — how it's wired

- Each book: `base: '/<subroute>/'` + `site: 'https://claude-books.brandon-behring.dev'` in its
  `astro.config.mjs`; all books on scaffold **`^4.25`** (base-aware links, #140/#141 fixed).
- Root `npm run build` → builds every workspace, then `scripts/assemble-hub.mjs` assembles
  `dist/`.
- One Worker serves `./dist`. No per-book Workers, no service-binding proxy.
- Supersedes the 2026-06-12 Pages/per-subdomain plan — see `docs/ROADMAP.md` → Deployment.

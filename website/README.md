# Orbital Crow website

The public website for **Orbital Crow** (orbitalcrow.com).

| Route | What it is |
|---|---|
| `/` | Orbital Crow homepage |
| `/games/` | Orbital Crow Studios page |
| `/web/` | **Intentionally empty.** Reserved for Orbital Crow Web (see below) |
| anything else | "Off course" not-found page (HTTP 404) |

The studio-name randomizer is published alongside the site at `/studio-tools/studio-randomizer/`, the same path it has in the repository.

## How it's built

The site is plain HTML and CSS, with no JavaScript and no framework. A small build script (`build.mjs`, about 150 lines, no dependencies) combines a shared header/footer template with each page and writes the finished site to `website/dist/`.

```
website/
├── site.config.json        ← names, email, links, logo paths. Most changes happen here.
├── build.mjs               ← builds website/dist
├── serve.mjs               ← local preview server (behaves like GitHub Pages)
├── src/
│   ├── templates/layout.html   ← shared <head>, header, navigation, footer
│   ├── pages/home.html         ← homepage content
│   ├── pages/games.html        ← studio page content
│   ├── pages/404.html          ← not-found page
│   ├── pages/web.html          ← the empty /web page (stand-alone, no header/footer)
│   └── assets/
│       ├── css/site.css        ← all styles; colours, fonts, spacing and motion are variables at the top
│       ├── fonts/              ← self-hosted fonts + their licences (SIL Open Font License)
│       └── img/                ← web-ready images (logos go here)
└── brand/originals/        ← keep untouched original logo files here (not published)
```

## Run it on your computer

You need [Node.js](https://nodejs.org/) version 18 or newer. Nothing else needs installing.

```bash
node website/build.mjs
```

```bash
node website/serve.mjs
```

Then open http://localhost:4173/. Stop the preview server with Ctrl+C.

To preview exactly as it looks on the `github.io` address, which lives in a `/project-x` sub-folder:

```bash
node website/build.mjs --base /project-x
```

```bash
node website/serve.mjs 4173 --base /project-x
```

Then open http://localhost:4173/project-x/.

## Changing content and links

**Links, email and names live in `website/site.config.json`:**

| Setting | What it does when filled in |
|---|---|
| `contactEmail` | Adds **Contact** to the navigation, the address to the footer, and a line on /games |
| `robloxCommunityUrl` | Adds a **Join the Roblox community** button on /games |
| `socialLinks` | A list like `[{ "label": "YouTube", "url": "https://www.youtube.com/@…" }]`; shown on /games and in the footer |
| `randomizerUrl` | Stored for later; not shown on the site |
| `logos.symbol` | Crow/orbit symbol: shown next to the name in the header and above the homepage title |
| `logos.studioWordmark` | Full "Orbital Crow Studios" logo: shown at the top of /games |
| `logos.socialPreviewImage` | Image used when the site is shared on social media or chat apps (1200×630 works well) |
| `deployAlongside` | Repository folders published next to the site at the same path |

Empty values are left off the site entirely. The build refuses placeholder links (`#`, `example.com`) and logo files that don't exist, so nothing fake can go live by accident.

**Page wording** lives in `src/pages/home.html` and `src/pages/games.html`. Edit the text between the tags. `{{studioName}}`-style placeholders are filled in from the config.

**Page titles and search descriptions** are in the `pages` list near the middle of `build.mjs`.

After any change, run `node website/build.mjs` to check it builds. Push to `main` and the site redeploys automatically.

## Adding the approved logos

No logo files were in the repository or attached when this was built, so the site currently uses a text identity, "Orbital Crow", plus a decorative orbit line. The favicon is a temporary orbit icon, not the crow.

1. Put the untouched originals (SVG, AI, large PNG) in `website/brand/originals/`.
2. Put web versions in `website/src/assets/img/`, for example `orbital-crow-symbol.svg` and `orbital-crow-studios.svg`. SVG is best. For PNG, use about twice the displayed size and make the background transparent.
3. In `site.config.json`, fill in `src` (for example `"assets/img/orbital-crow-symbol.svg"`), plus the image's real `width` and `height` in pixels and `alt` text.
4. To use the symbol as the favicon, replace `src/assets/img/favicon.svg`.

## Why /web is empty

`/web/` is reserved for a future website-building business whose offer isn't ready. It deliberately shows only the black brand background: no text, header, footer or navigation.

- **Search engines:** it has a `noindex` tag and is left out of `sitemap.xml`. It is not blocked in `robots.txt`, because search engines must be able to load the page to see the noindex tag.
- **Not hidden:** it isn't linked from anywhere on the site, but anyone who types the address can open it. noindex keeps it out of search results; it does not make it private.
- **Self-contained:** its file is `src/pages/web.html`, separate from the shared layout. To launch it later, turn it into a normal page: add an entry to the `pages` list in `build.mjs`, add `/web/` to the sitemap, and add a navigation link.

## Deployment (GitHub Pages)

`.github/workflows/deploy-website.yml` builds the site and publishes it whenever `website/` or the studio randomizer changes on `main`. It can also be run by hand from the **Actions** tab.

**One-time setup:** repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### Why GitHub Pages

- **Cost:** it's free for public repositories, and this one is public.
- **Continuity:** the randomizer already lives in this repository.
- **Terms (checked 2026-11-19):** GitHub's terms allow Pages as a showcase for projects and organisations. They do not allow it as "a free web-hosting service to run your online business, e-commerce site" or a site "primarily directed at … commercial transactions".
- **Limits:** the published site can be up to 1 GB, with a soft bandwidth limit of 100 GB per month.
- **What this means:** this brand-and-studio site is a good fit. If `/web` later sells services directly (prices, checkout, bookings), move the site to a host that permits commercial use (for example Cloudflare Pages or Netlify) at that point.

### Addresses

- **Preview:** `https://kavinx0.github.io/project-x/`, plus `/games/` and `/studio-tools/studio-randomizer/`.
- **After connecting the domain:** `https://orbitalcrow.com/`. GitHub automatically redirects the `github.io` addresses to the custom domain, so the randomizer becomes `https://orbitalcrow.com/studio-tools/studio-randomizer/`.

The build reads the correct base path from GitHub on every deploy (`/project-x` before the domain is connected, nothing after). After adding the custom domain, run the workflow once more so links use the new root.

## Connecting orbitalcrow.com (Spaceship DNS)

The domain uses Spaceship's nameservers (`launch1/launch2.spaceship.net`); keep them. Add records one by one on Spaceship's DNS records page for orbitalcrow.com (the menu names may differ slightly). Do not replace or reset the whole zone.

### Records to add

| Type | Host | Value | TTL | Status |
|---|---|---|---|---|
| A | `@` | `185.199.108.153` | 3600 (or Spaceship default) | **New** |
| A | `@` | `185.199.109.153` | 3600 | **New** |
| A | `@` | `185.199.110.153` | 3600 | **New** |
| A | `@` | `185.199.111.153` | 3600 | **New** |
| AAAA | `@` | `2606:50c0:8000::153` | 3600 | **New** |
| AAAA | `@` | `2606:50c0:8001::153` | 3600 | **New** |
| AAAA | `@` | `2606:50c0:8002::153` | 3600 | **New** |
| AAAA | `@` | `2606:50c0:8003::153` | 3600 | **New** |
| CNAME | `www` | `kavinx0.github.io` | 3600 | **New** |
| TXT | `_github-pages-challenge-kavinx0` | value shown by GitHub (see step 1 below) | 3600 | **New** (recommended) |

The IP addresses come from GitHub's "Managing a custom domain for your GitHub Pages site" documentation.

### Records to keep exactly as they are (Google Workspace email)

These existed on 2026-11-19 (looked up through public DNS):

| Type | Host | Value | Status |
|---|---|---|---|
| MX | `@` | `smtp.google.com` (priority 1) | **Preserve** |
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` (SPF) | **Preserve** |
| TXT | `@` | `google-site-verification=Ag4nEIl3…` | **Preserve** |
| TXT | `@` | `google-gws-recovery-domain-verification=77261806` | **Preserve** |
| TXT | `google._domainkey` | `v=DKIM1; k=rsa; p=…` (DKIM) | **Preserve** |
| NS | `@` | `launch1.spaceship.net`, `launch2.spaceship.net` | **Preserve** |

- **No existing web records:** none were found for `@` or `www`, so there's nothing to replace. If Spaceship shows a parking or "URL redirect" record for `@` or `www`, remove only that record.
- **No DMARC record yet:** adding one (`_dmarc`) is a good email-security step, but it's separate from the website and not required for it.

### Steps

1. **Verify the domain with GitHub (recommended):** your GitHub profile **Settings → Pages → Add a domain** → `orbitalcrow.com`. GitHub shows a TXT record; add it in Spaceship, then click **Verify**. This stops anyone else from claiming the domain on GitHub Pages.
2. **Add the A, AAAA and www CNAME records** from the table above in Spaceship.
3. **Set the custom domain:** repository **Settings → Pages → Custom domain** → enter `orbitalcrow.com` → **Save**. With `orbitalcrow.com` as the custom domain, GitHub redirects `www.orbitalcrow.com` to it.
4. **Wait for the DNS check:** wait until the Pages settings show the check succeeded. It's often minutes; GitHub allows up to 24 hours.
5. **Enforce HTTPS:** tick **Enforce HTTPS** once it's available. GitHub issues the certificate and redirects `http://` to `https://`.
6. **Rebuild:** **Actions → Deploy website → Run workflow**, so the site rebuilds for the root domain.
7. **Check each of these:**
   - `https://orbitalcrow.com/`
   - `https://orbitalcrow.com/games` (it should redirect to `/games/`, and refreshing should work)
   - `https://orbitalcrow.com/web/` (blank)
   - `https://orbitalcrow.com/anything` (not-found page)
   - `http://orbitalcrow.com` and `https://www.orbitalcrow.com` should both end at `https://orbitalcrow.com/`
   - `https://orbitalcrow.com/studio-tools/studio-randomizer/`
   - Send yourself an email at your Workspace address, to confirm email still works.

## Outstanding

- **Logos:** approved logo files (symbol, studio wordmark, social preview image).
- **Roblox community link:** not yet provided.
- **Contact email:** a confirmed public address.
- **Social links:** none confirmed yet.
- **GitHub Pages setup:** enable it (Source: GitHub Actions), then the DNS steps above.
- **Game randomizer:** it stays in the repository but is **not** published on the site. Its title uses wording you asked not to use publicly. To publish it, add `"studio-tools/game-randomizer"` to `deployAlongside`.

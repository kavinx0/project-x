# CLAUDE.md — project handover

Read this first. It explains who this repository belongs to, what's in it, and how to work with the founder.
**This repository is public:** never add private plans, financials, unannounced game ideas, credentials or personal details to any file here.

## Who and what

- **Orbital Crow** is an independent creative venture run by one person (a solo founder) in Malaysia. There are no employees: never imply a team.
- **Orbital Crow Studios** is the game studio. It starts on Roblox and may later make independent Unity games. As of late 2026 it is preparing its first project. No game has been publicly announced, and none is in public development.
- **Orbital Crow Web** is a future website-building business. Its public offer is not ready yet.
- **Brand:** an ivory crow silhouette inside an orbital ring, coloured black, warm ivory and crimson. The approved logo files are **not** in this repo yet (see `website/brand/originals/`). Do not draw or approximate a crow.

## Working with the founder

- They have limited programming experience. Explain consequential choices in plain English, make sensible technical decisions yourself, and give exact click-by-click steps for anything they must do (GitHub settings, DNS, running commands on Windows).
- They use Windows. Commands go in **Command Prompt or PowerShell opened in the project folder**, not the Node.js app/REPL.
- Verify work (build, test, look at it in a browser) before saying it's done. Say clearly what you checked and what they must check.
- Ask only when missing information truly blocks progress (for example a real URL, an email address or a logo file).

## Public-communication rules

- **Honesty:** say only accurate things. No invented release dates, player numbers, clients, testimonials, team members or "coming soon" promises.
- **First person:** use "I" when the founder speaks personally, and the studio name for the brand.
- **Keep internal plans private:** don't publish income goals, exit plans, business-plan content, or which game ideas are being considered. Unannounced game ideas stay private until the founder explicitly approves an announcement. Ask them; never guess or name one.
- **Banned word:** don't use the word "trendslop" in public-facing copy.
- **No placeholders:** never use "#" links, example.com, or a made-up email or social handle. Omit anything that isn't confirmed.

## What's in this repository

| Path | What it is | Live where |
|---|---|---|
| `website/` | Orbital Crow website: plain HTML/CSS plus a small no-dependency Node build (`node website/build.mjs`, preview with `node website/serve.mjs`). Pages `/`, `/games/`, an intentionally empty noindex `/web/`, and a 404 page. Links, email and logos are set in `website/site.config.json` | **orbitalcrow.com, hosted on Netlify** (configured in Netlify's dashboard, not in this repo) |
| `studio-tools/game-randomizer/` | Roblox game-idea slot machine (Verb / Determiner / Noun) as an installable offline PWA (`manifest.webmanifest`, `sw.js`, `icons/`). Word lists come from a public Roblox chart sample collected 2026-11-04 | GitHub Pages: https://kavinx0.github.io/project-x/studio-tools/game-randomizer/ |
| `studio-tools/studio-randomizer/` | Studio-name slot machine and shortlist tool | GitHub Pages (same path) and orbitalcrow.com/studio-tools/studio-randomizer/ |
| `.github/workflows/deploy-pages-tools.yml` + `.github/scripts/build-pages-tools.sh` | Publishes `studio-tools/` to GitHub Pages on pushes to `main` | — |
| `.github/workflows/deploy-website.yml` | Old GitHub Pages deploy for the website. **Manual-only on purpose**: running it would replace the tools on Pages | — |

Each folder has its own README with full details.

## Rules for changing things

- **`/web` must stay empty:** no text, header, footer, pricing, contact forms or "coming soon". Change it only when the founder says Orbital Crow Web is ready. If it later sells services directly, plan to move hosting off GitHub Pages, because Pages' terms forbid running an online business.
- **Leave hosting and accounts alone unless asked:** don't touch the website's Netlify setup, DNS (Spaceship), Google Workspace email records, or nameservers. The live DNS includes Google Workspace MX, SPF, DKIM and verification records that must be preserved.
- **Saved data:** keep the randomizers' localStorage keys and formats compatible (`gir:` for the game randomizer, `snr:` for the studio randomizer), so saved favourites survive updates.
- **Branches:** work on a branch and open a pull request; the founder merges. Don't push straight to `main`.

## Planned next steps (public-safe)

- **Website:** add the approved logo files, the Roblox community link and a public contact email once they exist. Later add Orbital Crow Web, a projects/games section and client work, using real items only, with clients' permission.
- **The first game:** build it in **its own repository**, not here, because Roblox development uses Roblox Studio, Luau and usually Rojo. Start that work in a fresh Claude Code session and attach the new repository.

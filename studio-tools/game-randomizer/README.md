# Roblox Trendslop Randomizer

A slot-machine brainstorming tool for Roblox game titles. Every built-in verb and noun comes from a real Roblox chart title, so rolls remix the words that trending games actually use. Three reels, **Verb / Determiner / Noun**, are combined under grammar rules (for example *Grow / Your / Arms*, *Escape From / The / Factory*, *Raise / A / Dragon*). Each roll comes with a short concept card.

Everything it generates is a brainstorming prompt. A random title is not a validated game idea, and the app makes no claim that it is.

- **One file:** `index.html` holds all the HTML, CSS, JavaScript and data.
- **No setup:** no build step, no installs, no external fonts or CDNs, and no network calls or AI when you spin.
- **Runs anywhere:** open the file directly in a browser or host it on GitHub Pages.

```
game-randomizer/
├── index.html                  ← the whole app (open this)
├── data/
│   ├── observed-sample.json    ← raw collector output (2026-11-04)
│   └── example-titles.csv      ← CSV format example (not real games)
└── collector/
    ├── collect.py              ← optional refresh job (Python 3 standard library only)
    └── embed.py                ← bakes a collector file into index.html
```

## Using it

- **ROLL GAME IDEA** (or <kbd>R</kbd>) spins every unlocked reel. The final words are chosen first; the animation only moves toward them.
- Each reel can be locked (or press <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd>) and rerolled on its own.
- When all three reels are locked, the roll button is disabled and the app says so.
- **Coherent mode** keeps verb and noun pairs that share a meaning class. **Chaos mode** allows any pairing, but grammar still applies.
- **Filters:**
  - Noun theme
  - Vocabulary source: observed (built-in), My words, or mixed
  - Noun number: singular, plural or uncountable
  - Sampling: uniform, or weighted by observed frequency
- **Locks and filters:** a locked word stays even when a filter would exclude it. The settings panel notes this.
- **No valid combinations:** the status line explains which lock or filter blocks the roll.
- **Favorites and history:** favorites, history, copy title, copy concept, and export favorites as JSON or text.
- **My words:** separate multiline inputs for verbs, determiners and nouns. Duplicates are removed, and a line with the same text as a built-in entry replaces its rules. Word banks import and export as JSON.
- **Import titles:** load a CSV of experience titles to get candidate words. You review each one before it's added.
- **Vocabulary browser:** searchable, with the source label for each word and links to the sample titles each observed word appears in.
- **Accessibility:** reduced motion follows the OS setting, with a manual toggle. Sound is off by default and generated locally. Everything works from the keyboard.

Settings, favorites, history and your words are saved in `localStorage`. If the browser blocks storage, the app still works and says that saving is off.

## Vocabulary and data coverage

### Bank sizes (as shipped)

| Reel | Entries | Notes |
|---|---|---|
| Verbs | 83 | All appear in at least one sample title. 4 are multi-word (*Hide From*, *Work At*, *Dig To*, *Hide In*) |
| Determiners | 31 | Closed grammar set, not taken from titles: *A/An*, *The*, *Your*, *Your Own*, *Every*, *These*, *99*, *A Lot of*, ∅ (no article)… |
| Nouns | 193 | All appear in at least one sample title. 361 noun forms (singular, plural, mass, proper) |

Under default settings (Coherent mode, all themes, mixed sources) there are **177,014 valid combinations**, counted under the actual rules. Chaos mode allows 552,448, and the unfiltered product of the three reels is 928,853. The app shows these numbers live for your current settings.

Nouns per theme: exploration 45, collection 23, animals 20, survival 20, vehicles 20, food 19, jobs 19, social 19, fantasy 18, absurd 15, construction 11, factory 10, body 8, space 8, sports 7, tech 4, nature 3. Thin themes give few combinations; the app explains when a filter leaves nothing to roll.

**Why it's narrowed:** an earlier version also shipped a hand-written "curated" bank (181 more verbs, 489 more nouns) for variety. It was removed so the built-in vocabulary is only words real Roblox titles use. You can add your own words in *My words*.

### Where the words come from

- **Observed (built-in):** every built-in verb and noun. Its exact wording appears in at least one title in the sample below. The match is recomputed in the browser at load time, and each word links back to its source titles.
- **What was written by hand:** the grammar metadata on each word (meaning classes, plural forms, themes) and the determiner set. Titles don't carry that information.
- **Refreshed samples:** if you load a newer sample and a built-in word no longer appears in it, the app labels that word *curated* instead of observed.
- **My words:** anything you add, including words accepted from a CSV import. Always labeled separately.

Observed counts are **per unique experience**: a word counts once per game, however often it repeats in that title.

Most frequent observed words:
- **Verbs:** Build 15, Escape 10, Survive 8, Steal 7, Guess 7, Sell 6, Clean 6
- **Nouns:** Tower 27, World 16, Tycoon 15, Ragdoll 13, Avatar 12, Outfit 10

A word appearing in popular titles doesn't mean it makes a game popular. It often reflects trends and copycat naming. Matching is lexical, with no part-of-speech tagging, so *Pet* or *Race* counts even when a title uses it as a noun.

### What Roblox data is actually available

Checked on 2026-11-04 by calling the endpoints:

| Source | What it exposes | Access | Limits |
|---|---|---|---|
| Open Cloud (`https://apis.roblox.com/cloud/v2/...`), docs at <https://create.roblox.com/docs/cloud> | Management of **your own** universes (configuration, data stores, publishing, etc.) | API key or OAuth with scopes | No discovery, popularity, or cross-platform listing endpoint |
| Legacy Games API v1: `https://games.roblox.com/v1/games?universeIds=…` | Lookup of **known** experiences: `name`, `playing` (current), `visits` (all-time), `favoritedCount`, `genre_l1`, `created`, `updated`, … | Public, no key | Lookup only. You must already have the universe IDs. **Max 50 IDs per request** (51 returns HTTP 400, "Too many universe IDs were requested") |
| Discover sorts: `https://apis.roblox.com/explore-api/v1/get-sorts?sessionId=…` | The Charts page sorts, each with up to ~100 experiences: `universeId`, `rootPlaceId`, `name`, `playerCount` (snapshot), vote totals, `isSponsored`, `genreL1` | Public, no key | **Undocumented**; can change without notice. Results depend on session, device and country |
| Search: `https://apis.roblox.com/search-api/omni-search` | Keyword search results | Public, no key | Undocumented; relevance-ranked, not popularity-ranked. Not used here |

Community references for the undocumented endpoints: [explore-api pagination thread](https://devforum.roblox.com/t/api-feature-that-allows-for-infinite-scrolling-on-front-page-pagination-for-apisrobloxcomexplore-apiv1get-sort-content/4040481), [games sorted by most played](https://devforum.roblox.com/t/get-a-list-of-games-on-roblox-sorted-by-most-played/4040395), [request for get-sorts documentation](https://devforum.roblox.com/t/looking-for-documentation-on-this-api/3981863), and [game data via games.roblox.com](https://devforum.roblox.com/t/how-to-get-a-gameexperiences-data-visits-playing-favorites/3073130).

There is no documented way to scan the whole Roblox catalog, and this project doesn't claim to.

### The embedded sample

| | |
|---|---|
| Collected | 2026-11-04 03:27 UTC (one run of `collector/collect.py`) |
| Unique experiences | **884**, deduplicated by universe ID |
| Selection | Every non-empty Discover sort returned for one anonymous session (default device and country), paged until no next-page token |
| Sorts covered | 26: Top Trending, Up-and-Coming, Top Playing Now, Fun with Friends, Top Revisited, Top Earning, Top Paid Access, Top Rated, Most Popular, Trending Music Experiences, 15 *Trending in &lt;genre&gt;* sorts, More When You Subscribe, Learn & Explore |
| Genre mix (`genre_l1`) | Simulation 251, Action 84, Roleplay & Avatar Sim 66, Survival 63, RPG 54, Party & Casual 47, Sports & Racing 46, Shooter 41, Obby & Platformer 41, Strategy 40, Adventure 39, Entertainment 33, Puzzle 31, Shopping 29, other 19 |
| Sponsored placements | 0 encountered (the collector drops any it finds) |
| Metrics kept | `playing`: current players, a single snapshot. `visits`: all-time total, **not** current popularity. Chart rank per sort |

Missing metrics and limits:
- **No growth data:** there are no historical player counts, so one snapshot can't show growth.
- **No revenue:** there is no retention, revenue or session-length data.
- **Ranking basis unknown:** Roblox doesn't say how sorts are ranked.
- **One snapshot:** the sample comes from one country, device and time of day.
- **Uneven sorts:** a few sorts (Top Paid Access, More When You Subscribe) list paid-access experiences, and some charts favor games that are already huge.

**Player-count weighting is not offered.** The snapshot depends on time of day and is dominated by a handful of very large games. The optional weighted mode uses only experience frequency: weight = 1 + the number of sample experiences containing the word. It is labeled as such in the app.

## Grammar rules (short version)

- **Noun kinds:** countable (singular plus plural form, with irregular overrides such as *Wolf → Wolves*, *Cactus → Cacti*), mass (*Lava*, *Candy*), proper (*Mars*, *the Backrooms*), or plural-only (*Fries*, *Stairs*).
- **Determiner agreement:** each determiner lists the numbers it accepts. *A/An*, *Every* and *One* need singular countable nouns. *Two*, *These* and *99* need plurals. *Some* and *More* take plurals or mass nouns.
- **A or An by sound:** *An Owl*, *A Unicorn*, *A UFO*, *An ATV*. Words can override it explicitly (`Hour | an`).
- **Coherent mode:** a verb and noun must share a meaning class (animal, monster, person, place, structure, vehicle, machine, food, plant, item, body, group, business, nature, event, abstract).
- **Sampling:** exact and uniform over valid triples by default. The only deviation is that an immediate exact repeat of the previous title is redrawn, up to 5 times.

Every rule is visible in the app's *How it works* tab and editable via *My words*. The built-in banks are plain text blocks near the end of `index.html`.

## CSV import format

Required column: `title`. Optional columns: `universe_id`, `place_id`, `playing`, `visits`, `source`, `collected_at`, `url`.

```csv
title,universe_id,playing,source,collected_at
"Example Farm Simulator",1234567890,1500,format-example,2026-11-04
"Example Tower Escape",,,format-example,2026-11-04
```

Rows merge by `universe_id`. Rows without one fall back to a normalized title (lowercase, bracketed tags and symbols removed). The app lists unknown words with their per-experience counts and a verb or noun guess. Nothing is added until you tick it. See `data/example-titles.csv`; its rows are format examples, not real games.

## Optional: refreshing the data (live refresh upgrade)

The app never fetches data itself: no browser API calls, no CORS proxies, no fake "live scan". A refresh is a separate job that writes a timestamped file:

```bash
cd studio-tools/game-randomizer/collector
python3 collect.py            # writes ../data/observed-sample.json (about a minute; 1 s pause between requests)
python3 embed.py              # bakes it into ../index.html
```

Both scripts use only the Python standard library and public endpoints, with no API keys. The collector records `collected_at` separately from anything the app does. To automate it, run the same two commands on a schedule, for example a weekly GitHub Actions workflow that commits the new file. The undocumented Discover endpoint can break without warning, so check the output counts before committing. You can also load a collector JSON file in the app under **Import titles → Use as observed sample** without editing `index.html`.

## Deploying to GitHub Pages (step by step)

These steps publish the randomizer at `https://kavinx0.github.io/project-x/studio-tools/game-randomizer/`.

1. **Get the files onto `main`.** The app was pushed to the branch `claude/blissful-bell-98s4jd`. On GitHub, open the repository, click **Pull requests → New pull request**, choose that branch, then **Create pull request → Merge pull request**.
2. Open the repository's **Settings** tab, then **Pages** in the left sidebar.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose `main` and the `/ (root)` folder, then click **Save**.
5. Wait 1–2 minutes. The Pages settings page shows "Your site is live at https://kavinx0.github.io/project-x/". Add `studio-tools/game-randomizer/` to the end of that address.
6. To update the site later, commit changes to `main`; Pages redeploys automatically.

Notes:
- **Private repositories:** GitHub Pages on a private repository needs a paid GitHub plan. On a free account, make the repository public first under **Settings → General → Danger Zone → Change visibility**.
- **Saved data per address:** favorites and custom words are stored per browser and per website address. Saves made while opening the file locally won't appear on the Pages site; use the export and import buttons to move them.

To run it locally, double-click `index.html` or drag it into a browser window. It works offline.

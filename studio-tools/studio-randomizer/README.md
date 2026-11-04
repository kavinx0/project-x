# Studio Name Randomizer

A slot-machine generator and shortlist for choosing a game studio name that can outlast one platform: Roblox now, Unity or anything else later.

- **One file:** `index.html` holds all the HTML, CSS, JavaScript and vocabulary.
- **Nothing to install:** no build tools or dependencies, no external fonts or images.
- **No outside services:** no accounts and no AI. Rolling never touches the network.

Every generated name is **unverified** until you check it yourself. The app never shows an "available" badge.

## Three naming modes

| Mode | Reels | Examples |
|---|---|---|
| Composed | Modifier / Core word / Suffix | Red Rain Interactive · Quiet Harbor Games · Iron Orchard Studios |
| Single name | Name / Suffix | Victoria Interactive · Afterlight Games · Coyote Studios |
| Phrase | Phrase / Suffix | Ground Zero Studios · Paper Moon Interactive |

The suffix is optional in every mode. Under **Filters → Suffix**, choose **Roll it** (no suffix is one of the options), **Always add a suffix**, or **No suffix**, which hides the suffix reel. Phrases are atomic: *Ground Zero* is never split apart.

## Using it

- **Rolling:** press **ROLL STUDIO NAME** (or <kbd>R</kbd>). The final name is chosen first; the reels then animate toward it.
- **Locks and rerolls:** lock any reel (<kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd>) or reroll it on its own. When every reel is locked, the button is disabled and says so.
- **Coherent vs Experimental:** Coherent avoids tone pairings that usually read as contradictions. Experimental lets stranger pairings through while keeping the grammar and spacing rules.
- **Filters:**
  - Theme and tone
  - Maximum length (10–40 characters, spaces included)
  - Suffix on/off/always, and conventional-only or experimental suffix words
  - Alliteration: allow a little, avoid, or prefer
  - Invented words and non-English words on or off
  - My words only
  - Reset filters
- **No valid names:** the status line explains why, including when a locked word is the cause.
- **Shortlist:**
  - **☆ Add to shortlist** (<kbd>F</kbd>) saves the current name.
  - Label each name *Shortlist* or *Maybe*, and write notes.
  - Answer the naming checklist: pronounce, spell after hearing, multiple genres, beyond Roblox, unwanted meanings, checked names and trademarks.
- **Compare:** view up to five saved names side by side. The table shows only mechanical facts (words, letters, a rough syllable estimate, initials) next to your own answers and notes. Nothing is scored.
- **History:** your last 50 rolls.
- **Copying and backup:** copy a name (<kbd>C</kbd>). Export saved names as JSON or plain text, and import a JSON backup.
- **Look it up:** search links for the current or saved name, plus a form to log each check you actually ran (source, date, scope, finding).
- **Word bank:**
  - Live counts calculated from the data.
  - Search every entry, edit or remove your own, and hide or restore built-ins.
  - **Restore defaults**, plus JSON import and export.
- **Add words:** one entry per line, for each of the five categories. Every batch shows a preview first, and duplicates are skipped regardless of capitals or stray spaces.

Destructive buttons (clear saved names, clear history, remove, restore defaults) need a second click to confirm.

## Vocabulary (actual counts in this version)

| Category | Built-in entries | Target |
|---|---|---|
| Modifiers | 267 | 250 |
| Core words | 733 | 400 |
| Standalone names | 485 | 250 |
| Phrases | 310 | 250 |
| Suffixes | 38 non-empty (20 conventional, 18 experimental) + "no suffix" | 30 + empty |

The app recalculates these numbers from its data at load time; see the Word bank tab.

With default filters, Composed mode can produce **3,526,521 valid names** in Coherent mode, out of a theoretical 4,056,885 before rules. Single-name mode has 10,184 and Phrase mode 6,389. The app shows both figures for your current filters.

### What's in the bank

- **Themes:** nature & weather, geography & landscape, architecture & industry, astronomy & science, literature & myth, abstract ideas, warm & playful, everyday objects, and Malay & Nusantara.
- **Tones:** elegant, dark & atmospheric, bright, quiet, playful, strange, bold, warm.
- **Word types are labeled:**
  - **Real word:** for example, *Halcyon*.
  - **Proper name:** for example, *Victoria*, *Avalon*, *Kinabalu*. Real place names are flagged because they can carry brand associations.
  - **Invented:** 55 coined words with pronunciation guides. Some are pure inventions (*Velloran*, *Kivora*); others are labeled compounds (*Tidelark* = tide + lark). Invented doesn't mean unused; they may still exist somewhere.
  - **Non-English:** each lists its language and meaning, plus pronunciation for most. These include 72 Malay words (*Senja* = dusk, *Congkak* = the traditional mancala game, *Kenyalang* = rhinoceros hornbill) and 20 Malay phrases (*Pasar Malam*, *Wau Bulan*, *Rumah Api*), along with a smaller set of Latin, Japanese, Spanish, Italian, Portuguese, Welsh, Finnish, Greek, Arabic and Scots words.
- **Meaning notes on sensitive or loaded entries:** for example, *Ground Zero* (strongly associated with the World Trade Center site), *Silk Road* (also the name of an illegal online market), *Bintang* (also a beer brand), *Kancil* (also a car model).
- **Dark names are balanced** by bright, quiet, warm, playful and strange ones.

### Expanding it

- **In the app:** use **Add words**, or edit a line in the Word bank. Options go after `|`, for example `Lanternfish | t=nature | tone=strange` or `Kelip | k=invented | say=KEH-lip | mean=coined`.
- **In the file:** the built-in banks are plain-text blocks near the end of `index.html` (`<script id="bank-mod" type="text/plain">` and similar). Edit them in any text editor. A line starting with `@` sets default tags for the lines below it.

## Rules (local and explicit, no language model)

- **No repeated words:** the same word or word stem can't appear twice (*Golden Gold*, *Starlit Starling*, *Paper Paperweight*).
- **No redundant pairs:** meaning groups stop pairs like *Lunar Moon*, *Misty Fog* and *Frozen Frost*.
- **Grammar:**
  - Number words force plurals, with irregular forms (*Seven Wolves*, *Nine Oxen*, *Hundred Nebulae*).
  - Uncountable nouns never follow a number (*Seven Rain* is rejected).
- **Suffix sense:** a suffix can't repeat a word in the name (*Neon Arcade Arcade*). A name ending in a studio-like word (*Workshop*, *Atelier*) gets no further suffix.
- **Readable length:** at most 5 words, and never longer than your maximum length.
- **Alliteration (heuristic):** words are compared by opening sound using spelling rules. C before E or I counts as S, PH as F, KN as N, and small words like *and*/*of* are ignored.
  - **Allow a little** blocks three matching words (*Silver Sparrow Studios*).
  - **Avoid** blocks any matching neighbors.
  - **Prefer** requires at least one matching pair.
- **Coherent mode (heuristic):** skips dark + playful, dark + bright and elegant + playful pairings unless the two words also share a tone. It also drops a few experimental-only entries (*Pickle*, *Toaster*, *Hullabaloo*…).
- **Known-studio skip list:** 234 well-known studio names (big publishers, famous indies, and Malaysian, Indonesian and Roblox studios). A generated name that matches one is skipped. **This short list is a courtesy, not a clearance check.**

**Sampling:** each roll is drawn uniformly from all valid full names (suffix included) under the current settings and locks. The only exception: if the result exactly repeats the previous name and other options exist, it is redrawn (up to 5 times).

There is no "brand quality" score. Length, word count and syllable figures are mechanical facts. The syllable count is a rough spelling-based estimate.

## Checking a name (the app does not do this for you)

The **Look it up** tab builds links and copyable queries for:

| What | Where |
|---|---|
| Existing game studios | Web search, [Steam](https://store.steampowered.com/), [itch.io](https://itch.io/), LinkedIn company search |
| Roblox groups / communities | `https://www.roblox.com/search/communities?keyword=…` |
| Domains | [ICANN Lookup](https://lookup.icann.org/) for .com / .games / .studio; [MYNIC WHOIS](https://mynic.my/whois) for .my and .com.my |
| Malaysian business name | [SSM](https://www.ssm.com.my/), the [SSM Business Name Registration Guidelines (PDF)](https://www.ssm.com.my/PublishingImages/Pages/Legal_Framework/Guidelines/business_name_registration_guidelines_-_final_1.pdf), ezBiz (needs an account) |
| Trademarks | [MyIPO](https://www.myipo.gov.my/) (its IP Online search may need a free account), [WIPO Global Brand Database](https://branddb.wipo.int/en/), [TMview](https://www.tmdn.org/tmview/), [USPTO](https://tmsearch.uspto.gov/), [Nice Classification](https://www.wipo.int/classifications/nice/en/) |

Points from SSM's business-name guidelines that matter for these names (read the PDF yourself for the full rules):
- **Meaning required:** a word that isn't Malay or English, or is invented, must have its meaning or origin given. The app keeps meanings for every non-English entry, and you can add `mean=` to your own.
- **Not distinct to SSM:** singular vs plural (*Studio* / *Studios*), "&" vs "and", and words with the same meaning don't make two names different.
- **Correct language:** a mixed Malay–English name must use correct language and word order, and names that are too general can be rejected.

Game-related trademark classes commonly include **9** (downloadable game software), **41** (entertainment, online game services) and **28** (games and toys). A quick search doesn't replace a professional search, which also covers similar-sounding and translated marks. **No results is not clearance.**

A saved name shows as "checked" only for the check records you log: source, date, scope and finding.

## Saving, opening and deploying

### 1. Open it on your computer
1. Download `index.html`. On GitHub, open the file and click **Download raw file**.
2. Double-click it, or drag it into Chrome, Edge, Firefox or Safari. It works offline.

### 2. Put it in a GitHub repository
It already lives in `kavinx0/project-x` under `studio-tools/studio-randomizer/`. For a different repository:
1. On GitHub, open the repository and click **Add file → Upload files**.
2. Drag in `index.html` (and this README if you like). To place them in a folder, type the folder path before the file name, then click **Commit changes**.

### 3. Turn on GitHub Pages
1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then click **Save**.
3. After 1–2 minutes, open `https://kavinx0.github.io/project-x/studio-tools/studio-randomizer/`.
4. If Pages is still set to the old `claude/…` branch, switch it to `main`, then merge this branch's pull request so the file is on `main`.
5. Pages on a private repository needs a paid GitHub plan. On a free account, the repository must be public.

### 4. Update it later
Open `studio-tools/studio-randomizer/index.html` on GitHub. Either click the pencil to edit, or upload a new copy with **Add file → Upload files** under the same name. Commit, and Pages redeploys in a minute or two.

### 5. Back up your shortlist
Saved names, notes, check records, your words and your settings are stored in **this browser only**, for **this web address**. A copy opened from your desktop and the GitHub Pages copy don't share data. Clearing browser data erases it.
- **Saved names:** use **Shortlist → Export JSON** now and then; **Import JSON** restores them.
- **Your words:** use **Word bank → Export my words** and **Import words**.

## Verification

**Run in headless Chromium (Playwright) on 2026-11-04, all passing:**
- **Loading and counts:**
  - The page loads with no console errors.
  - The vocabulary counts above are read from the running app.
- **Counting and sampling:**
  - Valid-name counts match a brute-force count: Single, Phrase, and Composed with the Malay theme.
  - Over 24,000 sampled names across all 3 modes × both styles, I found no double or edge spaces, nothing over the length limit, nothing over 5 words, and no repeated stems.
  - In the same sample, number words always took the correct plural, no number preceded an uncountable noun, and no redundant meaning group appeared.
  - Coherent mode produced no tone clashes and no experimental-only entries.
  - Phrases always stayed whole, no name had three alliterating words, and no known-studio name came out.
  - Sampling is uniform: all 454 names in a small locked pool were reached, chi-square 419 on 453 degrees of freedom.
- **Grammar spot checks:**
  - Irregular plurals: Wolves, Mice, Oases, Nebulae, Fireflies, Foxes, Oxen, Cyclopes.
  - *Seven Rain* rejected, *Seven Wolves* accepted.
  - *Lunar Moon*, *Starlit Starling* and *Misty Fog* rejected.
  - Suffix repetition blocked.
  - Alliteration "avoid" and "prefer" respected.
- **Rolls and locks:**
  - UI rolls work in all three modes, with 3 or 2 reels as expected.
  - Overlapping rolls are ignored.
  - A locked reel survives repeated rolls, and a single-reel reroll changes only that reel.
  - The all-locked state shows its message and disables the button.
- **Suffix settings:** None hides the reel; Always never yields an empty suffix; Roll sometimes does.
- **Empty and impossible filters:** each produces a clear message, including a locked word that can't fit.
- **Long names:** *Mechanical Cartographer Entertainment* fits the reels and the result area on desktop and at 390 px.
- **Your words:**
  - The preview flags new, repeated, already-built-in and too-long entries.
  - Pasted HTML is shown as text, never run.
  - Editing, removing, hiding a built-in, and JSON import with duplicate removal all work.
  - Restore defaults needs two clicks.
- **Saved names:**
  - Labels, notes, checklist answers and a logged check survive a reload.
  - Compare caps at five names.
  - JSON and text exports include check records and mark unchecked names "unverified".
  - Clearing needs two clicks.
- **Look it up:** builds Roblox, ICANN, SSM, MyIPO and WIPO links with the unverified notice.
- **Offline, mobile, motion and keyboard:**
  - The page makes no network requests, and it loads and rolls with the network off.
  - At 390 px there's no sideways scrolling in any tab, and no errors.
  - With reduced motion, a roll finishes in about 0.25 s without the reel animation.
  - Keyboard: <kbd>1</kbd> locks, <kbd>R</kbd> rolls, and Tab shows a visible focus outline.

**Not executed (inspected or untestable here):**
- Firefox, Safari and real phones; only Chromium was run.
- Screen-reader output.
- Hearing the sound effects (they are generated with Web Audio and off by default).
- Real clipboard and download permissions in your browser (the app falls back to a select-and-copy dialog).
- Search results behind each lookup link. At build time Roblox, ICANN, SSM, WIPO, TMview, USPTO, Steam and itch.io pages responded. MyIPO refused automated requests and ezBiz didn't respond from the build server, so they are linked but weren't verified here.
- Whether any specific generated name is free to use.

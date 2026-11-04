#!/usr/bin/env python3
"""Collect a public sample of Roblox experience titles for the Game Idea Reels app.

This is the optional "live refresh" collector. It runs on a computer or a CI
job, never in the browser. It uses only public, unauthenticated endpoints and
needs no API key or secret.

Sources
  1. Charts (Discover page sorts):
       GET https://apis.roblox.com/explore-api/v1/get-sorts?sessionId=<uuid>
     Undocumented by Roblox and can change without notice. Each sort lists up
     to about 100 experiences with a current playerCount snapshot.
  2. Experience details by universe ID (legacy Games API v1):
       GET https://games.roblox.com/v1/games?universeIds=<up to 50 ids>
     Max 50 IDs per call. Returns name, playing (current), visits (all-time total), genre, dates.

Output: a timestamped JSON file (default data/observed-sample.json) that the
static app can import. Sponsored chart placements are dropped because they are
paid ads, not a popularity signal; the count is recorded in the output.

Usage
  python3 collect.py                 # writes ../data/observed-sample.json
  python3 collect.py --out sample.json --max-pages 20
"""
import argparse
import datetime as dt
import json
import os
import time
import urllib.parse
import urllib.request
import uuid

SORTS_URL = "https://apis.roblox.com/explore-api/v1/get-sorts"
GAMES_URL = "https://games.roblox.com/v1/games"
BATCH = 50  # Games API rejects more than 50 universe IDs per request (observed Nov 2026)
USER_AGENT = "game-idea-reels-collector/1.0"


def get_json(url, params=None, retries=3):
    if params:
        url = url + "?" + urllib.parse.urlencode(params)
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:  # network error, 429, 5xx
            last = e
            time.sleep(2 ** (attempt + 1))
    raise RuntimeError(f"GET failed after {retries} tries: {url}: {last}")


def collect_charts(max_pages, pause):
    session = str(uuid.uuid4())
    token = None
    sorts_seen = []
    rows = {}  # universeId -> record
    sponsored_skipped = 0
    for page in range(max_pages):
        params = {"sessionId": session}
        if token:
            params["sortsPageToken"] = token
        data = get_json(SORTS_URL, params)
        for s in data.get("sorts", []):
            games = s.get("games") or []
            if not games:
                continue
            sort_id = s.get("sortId") or s.get("id")
            label = s.get("sortDisplayName") or sort_id
            sorts_seen.append({"sortId": sort_id, "name": label, "games": len(games)})
            for rank, g in enumerate(games, 1):
                if g.get("isSponsored"):
                    sponsored_skipped += 1
                    continue
                uid = g.get("universeId")
                if not uid:
                    continue
                rec = rows.setdefault(uid, {
                    "universe_id": uid,
                    "root_place_id": g.get("rootPlaceId"),
                    "title": g.get("name", ""),
                    "chart_player_count": g.get("playerCount"),
                    "genre_l1": g.get("genreL1"),
                    "charts": [],
                })
                rec["charts"].append({"sort": label, "rank": rank})
        token = data.get("nextSortsPageToken")
        if not token:
            break
        time.sleep(pause)
    return sorts_seen, rows, sponsored_skipped


def enrich(rows, pause):
    ids = list(rows)
    for i in range(0, len(ids), BATCH):
        chunk = ids[i:i + BATCH]
        data = get_json(GAMES_URL, {"universeIds": ",".join(str(x) for x in chunk)})
        for g in data.get("data", []):
            rec = rows.get(g.get("id"))
            if not rec:
                continue
            rec["title"] = g.get("name") or rec["title"]
            rec["playing"] = g.get("playing")
            rec["visits"] = g.get("visits")
            rec["genre"] = g.get("genre_l1") or g.get("genre")
            rec["created"] = g.get("created")
            rec["updated"] = g.get("updated")
        time.sleep(pause)


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(here, "..", "data", "observed-sample.json"))
    ap.add_argument("--max-pages", type=int, default=30)
    ap.add_argument("--pause", type=float, default=1.0, help="seconds between requests")
    args = ap.parse_args()

    started = dt.datetime.now(dt.timezone.utc)
    sorts, rows, sponsored = collect_charts(args.max_pages, args.pause)
    enrich(rows, args.pause)
    finished = dt.datetime.now(dt.timezone.utc)

    out = {
        "format": "game-idea-reels/observed-sample@1",
        "collected_at": finished.isoformat(timespec="seconds"),
        "collection_started_at": started.isoformat(timespec="seconds"),
        "method": (
            "All non-empty Discover sorts returned by explore-api get-sorts for one anonymous session "
            "(default device/country), paged until no next token. Sponsored placements removed. "
            "Deduplicated by universe ID. Details added from games.roblox.com/v1/games."
        ),
        "sources": [
            {"name": "Roblox Discover sorts (explore-api get-sorts, undocumented)", "url": SORTS_URL},
            {"name": "Roblox Games API v1 (legacy)", "url": GAMES_URL},
        ],
        "metrics": {
            "chart_player_count": "current players reported by the chart at collection time (snapshot)",
            "playing": "current players reported by Games API at enrichment time (snapshot)",
            "visits": "all-time total visits; NOT current popularity",
        },
        "sorts": sorts,
        "sponsored_skipped": sponsored,
        "experiences": sorted(rows.values(), key=lambda r: -(r.get("playing") or 0)),
    }
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"{len(rows)} unique experiences from {len(sorts)} sorts "
          f"({sponsored} sponsored placements skipped) -> {args.out}")


if __name__ == "__main__":
    main()

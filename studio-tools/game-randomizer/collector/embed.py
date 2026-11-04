#!/usr/bin/env python3
"""Embed a collector output file into index.html so the app stays one self-contained file.

  python3 embed.py                       # data/observed-sample.json -> ../index.html
  python3 embed.py --sample other.json

Replaces everything inside <script id="sample-data" type="application/json"> ... </script>.
Only titles, universe IDs, snapshot metrics, genre and chart placements are kept.
"""
import argparse
import json
import os
import re

here = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser()
ap.add_argument("--sample", default=os.path.join(here, "..", "data", "observed-sample.json"))
ap.add_argument("--html", default=os.path.join(here, "..", "index.html"))
args = ap.parse_args()

src = json.load(open(args.sample, encoding="utf-8"))
sort_names = [s["name"] for s in src["sorts"]]
idx = {n: i for i, n in enumerate(sort_names)}
rows = []
for e in src["experiences"]:
    charts = [[idx[c["sort"]], c["rank"]] for c in e.get("charts", []) if c["sort"] in idx]
    rows.append([e["universe_id"], e["title"], e.get("playing"), e.get("visits"), e.get("genre"), charts, e.get("root_place_id")])

compact = {
    "format": "trendslop-randomizer/sample@1",
    "collected_at": src["collected_at"],
    "collection_started_at": src.get("collection_started_at"),
    "method": src["method"],
    "sources": src["sources"],
    "metrics": src["metrics"],
    "sponsored_skipped": src.get("sponsored_skipped", 0),
    "sorts": src["sorts"],
    "fields": ["universe_id", "title", "playing", "visits", "genre", "charts[sortIndex,rank]", "root_place_id"],
    "rows": rows,
}
blob = json.dumps(compact, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
html = open(args.html, encoding="utf-8").read()
pat = re.compile(r'(<script id="sample-data" type="application/json">)(.*?)(</script>)', re.S)
if not pat.search(html):
    raise SystemExit("sample-data script tag not found in " + args.html)
html = pat.sub(lambda m: m.group(1) + blob + m.group(3), html, count=1)
open(args.html, "w", encoding="utf-8").write(html)
print(f"Embedded {len(rows)} experiences ({len(blob)//1024} KB) into {args.html}")

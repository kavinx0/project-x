#!/usr/bin/env bash
# Assembles the studio tools for GitHub Pages into the folder given as $1 (default: _site).
# Paths are kept identical to the repository, so the game randomizer is served at
#   <pages-root>/studio-tools/game-randomizer/
# Its service worker gets a content hash, so every change to the app ships as a new version.
set -euo pipefail
OUT="${1:-_site}"
rm -rf "$OUT"
mkdir -p "$OUT/studio-tools"

# Game randomizer (PWA): app files only, not the Python collector or raw data.
GR="$OUT/studio-tools/game-randomizer"
mkdir -p "$GR/icons"
cp studio-tools/game-randomizer/index.html studio-tools/game-randomizer/manifest.webmanifest studio-tools/game-randomizer/sw.js "$GR/"
cp studio-tools/game-randomizer/icons/* "$GR/icons/"
HASH=$( (cat studio-tools/game-randomizer/index.html studio-tools/game-randomizer/manifest.webmanifest studio-tools/game-randomizer/sw.js; cat studio-tools/game-randomizer/icons/*) | sha256sum | cut -c1-16)
sed -i "s/__BUILD_HASH__/$HASH/" "$GR/sw.js"
grep -q "$HASH" "$GR/sw.js"

# Studio-name randomizer: unchanged, published at its usual repository path.
mkdir -p "$OUT/studio-tools/studio-randomizer"
cp studio-tools/studio-randomizer/index.html "$OUT/studio-tools/studio-randomizer/"

touch "$OUT/.nojekyll"
echo "Assembled $(find "$OUT" -type f | wc -l) files into $OUT (game randomizer version $HASH)"

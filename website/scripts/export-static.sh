#!/usr/bin/env bash
# Build a static, CMS-less snapshot of the site for GitHub Pages.
# Output: website/out/  (serve under a repo subpath, default /pkt).
set -euo pipefail
cd "$(dirname "$0")/.."

BASE="${BASE_PATH:-/pkt}"          # GitHub Pages repo subpath, e.g. /pkt
APP="src/app"
HIDDEN=".export-hidden"

# `dynamicParams` must be a literal for the static parser, so we can't env-gate
# it in source — the export flips these to false, then git restores them.
DP_FILES=(
  "$APP/(site)/[locale]/blog/[slug]/page.tsx"
  "$APP/(site)/[locale]/soluzioni/[category]/page.tsx"
  "$APP/(site)/[locale]/soluzioni/[category]/[machine]/page.tsx"
)

# Payload's admin/api route handlers and the proxy (middleware) are illegal
# under `output: export`, so move them out of the build tree — and always
# put them back, even if the build fails.
restore() {
  [ -d "$HIDDEN/(payload)" ] && mv "$HIDDEN/(payload)" "$APP/(payload)" || true
  [ -f "$HIDDEN/proxy.ts" ] && mv "$HIDDEN/proxy.ts" "src/proxy.ts" || true
  rmdir "$HIDDEN" 2>/dev/null || true
  git checkout -- "${DP_FILES[@]}" 2>/dev/null || true
}
trap restore EXIT

rm -rf "$HIDDEN" out
mkdir -p "$HIDDEN"
mv "$APP/(payload)" "$HIDDEN/(payload)"
mv "src/proxy.ts" "$HIDDEN/proxy.ts"
perl -i -pe 's/dynamicParams = true/dynamicParams = false/' "${DP_FILES[@]}"

NEXT_PUBLIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH="$BASE" npx next build

# Images are served by Payload at /api/media/file/<f> in the running app (Next
# already prefixed these with the base path). Copy the files in and repoint
# both the HTML and the client-nav RSC payloads at the static path.
mkdir -p out/media
cp -R media/. out/media/
find out \( -name '*.html' -o -name '*.txt' \) -exec perl -i -pe 's{/api/media/file/}{/media/}g' {} +

# No middleware means no `/` -> `/it` rewrite; add a redirect landing page.
cat > out/index.html <<HTML
<!doctype html><meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=./it/">
<link rel="canonical" href="./it/"><a href="./it/">PKT</a>
HTML

touch out/.nojekyll   # keep _next/ (Jekyll strips underscore dirs)

echo "✔ Static site in website/out (base path: $BASE)"

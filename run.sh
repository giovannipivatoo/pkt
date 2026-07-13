#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/website"
[ -d node_modules ] || npm install
npm run dev

#!/usr/bin/env bash
# One-time Mac setup for Reel Studio Kit. Safe to re-run.
# Usage (from this folder):  bash setup.sh
set -e
cd "$(dirname "$0")"

step() { printf "\n\033[1m==> %s\033[0m\n" "$1"; }

# 1. Node.js 18+ and ffmpeg
missing=()
command -v node   >/dev/null 2>&1 || missing+=(node)
command -v ffmpeg >/dev/null 2>&1 || missing+=(ffmpeg)
if [ ${#missing[@]} -gt 0 ]; then
  if command -v brew >/dev/null 2>&1; then
    step "Installing ${missing[*]} with Homebrew"
    brew install "${missing[@]}"
  else
    echo "Missing: ${missing[*]}."
    echo "Install Homebrew from https://brew.sh, then run: brew install ${missing[*]}"
    exit 1
  fi
fi
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "Node $(node -v) is too old; need 18+. Run: brew upgrade node"; exit 1
fi
echo "node $(node -v), $(ffmpeg -version | head -1 | cut -d' ' -f1-3)"

# 2. Packages + typecheck
step "Installing packages (npm ci)"
npm ci --no-audit --no-fund
step "Typechecking"
npm run typecheck

# 3. Private .env for voice keys (never committed)
[ -f .env ] || { cp .env.example .env; echo "Created .env (add OPENAI_API_KEY or ELEVENLABS_* only if you use those voices)"; }

# 4. Demo render (first run downloads a headless browser + fonts, needs internet once)
step "Rendering the demo -> out/Demo.mp4"
npm run demo

# 5. Local caption sync (Whisper). Needs Python 3.11, 3.12 or 3.13.
PY=""
for c in python3.12 python3.11 python3.13; do command -v $c >/dev/null 2>&1 && PY=$c && break; done
if [ -d tools/.venv ]; then
  echo "Caption sync already set up (tools/.venv)."
elif [ -n "$PY" ]; then
  step "Setting up local caption sync ($PY)"
  npm run setup:captions
else
  echo
  echo "Skipped caption sync: needs Python 3.11-3.13."
  echo "  brew install python@3.12 && npm run setup:captions"
fi

step "Done"
echo "Next: run 'claude' in this folder and type:  reel banao: <your topic>"
[ -f out/Demo.mp4 ] && open out/Demo.mp4 || true

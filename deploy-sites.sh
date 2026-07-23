#!/usr/bin/env bash
set -euo pipefail

SITE=flexiproelite
BUCKET=clearprompt-templates
OUT_DIR=out

# Rebuild. Optional local `.env` is only for AWS tooling (e.g. AWS_PROFILE) — not ClearPrompt API config.
if [ -z "${GITHUB_ACTIONS:-}" ]; then
  if [ -f .env ]; then
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a
  fi
  npm run build
fi

if [ ! -d "$OUT_DIR" ]; then
  echo "Error: $OUT_DIR/ not found. Run 'npm run build' (Next.js static export) first." >&2
  exit 1
fi

# GitHub Actions: use credentials from the environment (no ~/.aws profile).
# Local: default --profile clearprompt, or set AWS_PROFILE to override.
aws_profile_args=()
if [ -n "${GITHUB_ACTIONS:-}" ]; then
  :
elif [ -n "${AWS_PROFILE:-}" ]; then
  aws_profile_args=(--profile "$AWS_PROFILE")
else
  aws_profile_args=(--profile clearprompt)
fi

# upload hashed Next.js static assets (long cache)
if [ -d "$OUT_DIR/_next" ]; then
  aws s3 sync "$OUT_DIR/_next" "s3://$BUCKET/$SITE/_next" \
    --delete \
    --cache-control "public,max-age=31536000,immutable" \
    "${aws_profile_args[@]}"
fi

# upload public assets from export (images, icons, etc.) — never upload the JSON source
aws s3 sync "$OUT_DIR" "s3://$BUCKET/$SITE" \
  --delete \
  --exclude "_next/*" \
  --exclude "*.html" \
  --exclude "*.json" \
  --cache-control "public,max-age=86400" \
  "${aws_profile_args[@]}"

# upload html entrypoints (no cache)
find "$OUT_DIR" -name '*.html' -print0 | while IFS= read -r -d '' file; do
  rel="${file#"$OUT_DIR"/}"
  aws s3 cp "$file" "s3://$BUCKET/$SITE/$rel" \
    --cache-control "no-cache" \
    --content-type "text/html" \
    "${aws_profile_args[@]}"
done

echo "Deployed to s3://$BUCKET/$SITE/"

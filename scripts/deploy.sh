#!/usr/bin/env bash
#
# Build the site and deploy it to Infomaniak via SFTP.
#
# Usage:
#   1. cp .env.deploy.example .env.deploy
#   2. Fill in your settings in .env.deploy (host, user, remote dir, SSH key)
#   3. ./deploy.sh        (full deploy: build + upload)
#      ./deploy.sh --skip-build   (upload existing dist/ only)
#
# Authentication uses a dedicated SSH key (no password anywhere), so deploy
# credentials never appear in the process list (`ps aux`) nor on disk.
#
# Upload is done with rsync over ssh (mirrors dist/ with --delete).
# Requirements: rsync, both locally and on the remote host.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../.env.deploy"
DIST_DIR="${SCRIPT_DIR}/../dist"

SKIP_BUILD=0
for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=1 ;;
    *) echo "Unknown argument: $arg" >&2; exit 1 ;;
  esac
done

if [[ ! -f "$ENV_FILE" ]]; then
  echo "✗ $ENV_FILE not found." >&2
  echo "  Copy .env.deploy.example to .env.deploy and fill in your credentials." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

: "${SFTP_HOST:?SFTP_HOST is required in .env.deploy}"
: "${SFTP_USER:?SFTP_USER is required in .env.deploy}"
: "${SFTP_REMOTE_DIR:?SFTP_REMOTE_DIR is required in .env.deploy}"
SFTP_PORT="${SFTP_PORT:-22}"
SFTP_SSH_KEY="${SFTP_SSH_KEY:-$HOME/.ssh/id_villard}"
# Expand a leading ~ to the home directory.
SFTP_SSH_KEY="${SFTP_SSH_KEY/#\~/$HOME}"

if [[ ! -f "$SFTP_SSH_KEY" ]]; then
  echo "✗ SSH key not found at $SFTP_SSH_KEY." >&2
  echo "  Generate one with: ssh-keygen -t ed25519 -f \"$SFTP_SSH_KEY\" -C villard-deploy" >&2
  echo "  then add the .pub key to your Infomaniak SSH keys." >&2
  exit 1
fi

if ! command -v rsync >/dev/null 2>&1; then
  echo "✗ rsync is not installed locally." >&2
  echo "  Install with: brew install rsync" >&2
  exit 1
fi

if [[ "$SKIP_BUILD" -eq 0 ]]; then
  echo "→ Building production bundle…"
  npm run build
fi

if [[ ! -d "$DIST_DIR" ]]; then
  echo "✗ $DIST_DIR not found. Run without --skip-build first." >&2
  exit 1
fi

echo "→ Uploading dist/ to ${SFTP_USER}@${SFTP_HOST}:${SFTP_REMOTE_DIR} (port ${SFTP_PORT})…"

# BatchMode=yes: fail fast instead of falling back to an interactive password
# prompt if key auth ever breaks. IdentitiesOnly=yes: offer only our key.
SSH_CMD="ssh -i ${SFTP_SSH_KEY} -p ${SFTP_PORT} -o IdentitiesOnly=yes -o BatchMode=yes"

rsync -az --delete --exclude='.DS_Store' \
  -e "${SSH_CMD}" \
  "${DIST_DIR}/" "${SFTP_USER}@${SFTP_HOST}:${SFTP_REMOTE_DIR}/"

echo "✓ Deployed to https://${SFTP_HOST%%.*}… (replace with your actual domain)"

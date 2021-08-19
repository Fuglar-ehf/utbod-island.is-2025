#!/usr/bin/env bash
set -euxo pipefail

# Run code tests

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT="$DIR/../.."

(cd "$ROOT"; ./node_modules/.bin/prettier --check .)
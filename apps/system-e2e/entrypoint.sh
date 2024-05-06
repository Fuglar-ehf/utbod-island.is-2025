#!/usr/bin/env bash

set -euo pipefail

: "${TEST_ENVIRONMENT:=local}"
: "${TEST_TYPE:=smoke}"
: "${TEST_PROJECT:=everything}"
: "${TEST_RESULTS_S3:=}"
: "${TEST_FILTER:=$*}"

if [[ "$*" =~ --project ]]; then
  TEST_PROJECT="$(echo "$*" | grep -oP -- '--project[= ](\S+)')"
  TEST_PROJECT="${TEST_PROJECT##--project?}"
fi

export TEST_PROJECT TEST_ENVIRONMENT TEST_TYPE TEST_RESULTS_S3 TEST_FILTER
export PATH="./node_modules/.bin:$PATH"

echo "Current test environment: ${TEST_ENVIRONMENT}"
echo "Playwright args: $*"
if ! command -v playwright >/dev/null; then
  echo "Can't find 'playwright'. Is it installed?"
  echo "Your \$PATH might need updating"
  echo "  PATH=$PATH"
  exit 1
fi
echo "Playwright version: $(playwright --version)"

TEST_EXIT_CODE=0
playwright test -c . "$@" || TEST_EXIT_CODE=$?

# Upload results
if [[ -n "$TEST_RESULTS_S3" ]]; then
  zip -r -0 test-results playwright-report src/test-results
  aws s3 cp test-results.zip "$TEST_RESULTS_S3"
fi
if [ "$TEST_EXIT_CODE" != "0" ]; then
  node ./src/notifications/notify.*
fi

cat <<EOF
To access the detailed report (with any failure traces), download it from the command
line like this, extract and open 'index.html':

  aws s3 cp ${TEST_RESULTS_S3:-'<s3-bucket-name>'} ./tesults-results.zip
  unzip ./tesults-results.zip
  firefox ./tesults-results/index.html

Additionally a web-based overview can be found at
  https://www.tesults.com/digital-iceland/monorepo
EOF

exit "$TEST_EXIT_CODE"

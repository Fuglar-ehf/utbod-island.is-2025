#!/bin/bash
set -euxo pipefail

: "${DD_CIVISIBILITY_AGENTLESS_ENABLED:=true}"
: "${DD_SITE:=datadoghq.eu}"
: "${DD_ENV:=ci}"
# DD_SERVICE is never used as-is, but initializes the variable, and makes easy
# debugging for when the environment variable isn't successfully set in earlier CI steps
: "${DD_SERVICE:=${APP:-"unit-test"}}"
: "${DD_API_KEY:='<set-api-key>'}"
: "${NODE_OPTIONS:=}"
: "${FLAKY_TEST_RETRIES:=3}"

# Default to big old-space, and more options for testing, but allow overriding
NODE_OPTIONS="--max-old-space-size=8193 --unhandled-rejections=warn --require=dd-trace/ci/init ${NODE_OPTIONS:-}"
EXTRA_OPTS=""

FLAKY_TESTS=(
  "services-auth-delegation-api"
  "services-auth-personal-representative"
)
if [[ ${FLAKY_TESTS[*]} =~ ${APP} ]]; then
  IS_FLAKY_TEST=true
else
  IS_FLAKY_TEST=false
fi

projects_uncollectible_coverage=(
  "application-templates-no-debt-certificate"
  "api-domains-email-signup"
  "skilavottord-web"
  "shared-babel"
  "service-portal-core"
)
# shellcheck disable=SC2076
if [[ ! " ${projects_uncollectible_coverage[*]} " =~ " ${APP} " ]]; then
  EXTRA_OPTS="--codeCoverage"
fi

export DD_CIVISIBILITY_AGENTLESS_ENABLED \
  DD_SITE \
  DD_ENV \
  DD_SERVICE \
  DD_API_KEY \
  NODE_OPTIONS \
  SERVERSIDE_FEATURES_ON=\"\" # disable server-side features

if [[ $IS_FLAKY_TEST == true ]]; then
  for ((i=1; i<=FLAKY_TEST_RETRIES; i++)); do
    if yarn run test "${APP}" ${EXTRA_OPTS} --verbose --no-watchman "$@"; then
      break
    fi
  done
else
  yarn run test \
    "${APP}" \
    ${EXTRA_OPTS} \
    --verbose \
    --no-watchman \
    "$@"
fi

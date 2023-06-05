#!/bin/bash

set -euo pipefail

CLEAN_DRY=false
CLEAN_CACHES=false
CLEAN_YARN=false
CLEAN_GENERATED=false
CLEAN_CACHES_LIST=(.cache node_modules dist)
CLEAN_YARN_IGNORES_LIST=(patches releases)

log() {
  echo "$@" >&2
}

dry() {
  [[ $# -gt 0 ]] && log "$*"
  if [[ "$CLEAN_DRY" == "true" ]]; then
    return 0
  fi
  return 1
}

show_help() {
  cat <<EOF
Usage:
  ./scripts/clean.sh [OPTIONS]
  -f | --force    Force clean
  -d | --dry      Dry run
  -h | --help     Show help
EOF
}

cli() {
  while [[ $# -gt 0 ]]; do
    local arg="${1:-}"
    case "$arg" in
    --generated)
      CLEAN_GENERATED=true
      ;;
    --yarn)
      CLEAN_YARN=true
      ;;
    --cache)
      CLEAN_CACHES=true
      ;;
    -d | --dry)
      CLEAN_DRY=true
      ;;
    *)
      show_help
      exit
      ;;
    esac
    shift
  done
  if [[ "$CLEAN_GENERATED" == "false" && "$CLEAN_YARN" == "false" && "$CLEAN_CACHES" == "false" ]]; then
    CLEAN_GENERATED=true
    CLEAN_YARN=true
    CLEAN_CACHES=true
  fi
}

clean_generated() {
  find . -type f \( -name "openapi.yaml" \
    -o -name "api.graphql" \
    -o -name "schema.d.ts" \
    -o -name "schema.tsx" \
    -o -name "schema.ts" \
    -o -path "*/gen/graphql.ts" \
    -o -name "possibleTypes.json" \
    -o -name "fragmentTypes.json" \
    \) $(dry && echo -print || -delete)

  find . -type d \( -path "*/gen/fetch" \
    \) -exec $(dry && echo 'echo') rm -rf '{}' +
}

clean_caches() {
  dry "Removing: ${CLEAN_CACHES_LIST[*]}" || rm -rf "${CLEAN_CACHES_LIST[@]}"
}

clean_yarn() {
  if ! [[ -d ".yarn" ]]; then
    log "No .yarn folder"
    return
  fi
  if [[ .yarn/* == '.yarn/*' ]]; then
    log "Nothing in .yarn folder"
    return
  fi
  for f in ./.yarn/*; do
    fname="${f##*.yarn/}"
    log " \"${CLEAN_YARN_IGNORES_LIST[*]}\" =~ $fname "
    if ! [[ "${CLEAN_YARN_IGNORES_LIST[*]}" =~ "${fname}" ]]; then
      dry "Removing $f" || rm -rf "$f"
    fi
  done
}

clean_all() {
  for job in generated caches yarn; do
    job_uppercase="${job^^}"
    job_variable="CLEAN_${job_uppercase}"

    # Run only if corresponding job variable is true
    if [[ "${!job_variable}" == "true" ]]; then
      log "Cleaning $job files"
      clean_job="clean_${job}"
      $clean_job || log "Job $job failed"
    else
      log "Skipping $job"
    fi
  done
}

cli "$@"
if (return 2>/dev/null); then
  echo "Exiting because sourced"
  return
fi
clean_all

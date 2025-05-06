#!/usr/bin/env bash

# Source: https://gist.github.com/cdown/1163649
urlencode() {
  # urlencode <string>

  old_lc_collate=${LC_COLLATE}
  LC_COLLATE=C

  local length="${#1}"
  for (( i = 0; i < length; i++ )); do
    local c="${1:${i}:1}"
    case ${c} in
      [a-zA-Z0-9.~_-]) printf '%s' "${c}" ;;
      *) printf '%%%02X' "'${c}" ;;
    esac
  done

  LC_COLLATE=${old_lc_collate}
}

echo "==> Packaging CSS…"
cat src/lib/cleanslate.css src/snoopy.css > dist/snoopy.css
curl -X POST -s --data-urlencode 'input@dist/snoopy.css' https://www.toptal.com/developers/cssminifier/api/raw > dist/snoopy-min.css

echo "==> Packaging JavaScript…"
cat src/lib/floodlight.js src/lib/sniffer.js src/snoopy.js > dist/snoopy.js
curl -X POST -s --data-urlencode 'input@dist/snoopy.js' https://www.toptal.com/developers/javascript-minifier/api/raw > dist/snoopy-min.js

echo "==> Packaging bookmarklet…"
printf "javascript:" > dist/bookmarklet.js
curl -X POST -s --data-urlencode 'input@src/bookmarklet.js' https://www.toptal.com/developers/javascript-minifier/api/raw >> dist/bookmarklet.js
# bookmarklet=$(curl -X POST -s --data-urlencode 'input@src/bookmarklet.js' https://www.toptal.com/developers/javascript-minifier/api/raw)
# urlencode "${bookmarklet}" >> dist/bookmarklet.js
# echo "${bookmarklet}" >> dist/bookmarklet.js

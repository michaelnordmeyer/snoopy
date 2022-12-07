#!/usr/bin/env bash

# Source: https://gist.github.com/cdown/1163649
urlencode() {
    # urlencode <string>

    old_lc_collate=$LC_COLLATE
    LC_COLLATE=C

    local length="${#1}"
    for (( i = 0; i < length; i++ )); do
        local c="${1:$i:1}"
        case $c in
            [a-zA-Z0-9.~_-]) printf '%s' "$c" ;;
            *) printf '%%%02X' "'$c" ;;
        esac
    done

    LC_COLLATE=$old_lc_collate
}

echo Packaging Snoopy CSS…
cat src/lib/cleanslate.css src/snoopy.css > snoopy.css
curl -X POST -s --data-urlencode 'input@snoopy.css' https://www.toptal.com/developers/cssminifier/api/raw > snoopy-min.css
rm snoopy.css

echo Packaging Snoopy JavaScript…
cat src/lib/floodlight.js src/lib/sniffer.js src/snoopy.js > snoopy.js
curl -X POST -s --data-urlencode 'input@snoopy.js' https://www.toptal.com/developers/javascript-minifier/api/raw > snoopy-min.js
rm snoopy.js

echo Packaging Snoopy bookmarklet…
printf "javascript:" > bookmarklet.js
bookmarklet=$(curl -X POST -s --data-urlencode 'input@src/bookmarklet.js' https://www.toptal.com/developers/javascript-minifier/api/raw)
#urlencode ${bookmarklet} >> bookmarklet.js
echo ${bookmarklet} >> bookmarklet.js

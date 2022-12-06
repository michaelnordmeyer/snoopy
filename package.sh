#!/usr/bin/env sh

echo Packaging Snoopy CSS…
cat src/lib/cleanslate.css src/snoopy.css > snoopy.css
curl -X POST -s --data-urlencode 'input@snoopy.css' https://www.toptal.com/developers/cssminifier/api/raw > snoopy-min.css
rm snoopy.css

echo Packaging Snoopy JavaScript…
curl -X POST -s --data-urlencode 'input@src/snoopy.js' https://www.toptal.com/developers/javascript-minifier/api/raw > snoopy-min.js

echo Packaging Snoopy bookmarklet…
printf 'javascript:' > bookmarklet.js
curl -X POST -s --data-urlencode 'input@src/bookmarklet.js' https://www.toptal.com/developers/javascript-minifier/api/raw >> bookmarklet.js

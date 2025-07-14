#!/usr/bin/env sh

# Caching by jsDelivr
# - Version aliasing - 7 days. This also includes latest versions. They are cached on our CDN for 7 days with the option to purge the cache using our API to speed up the release of your project to your users.
# - Branches - 12 hours.
# In certain cases, purgeable files can get updated faster due to low-cache hit ratio or forced CDN purge from our side for maintenance reasons.
# We use permanent S3 caching even with dynamic URLs, such as version aliasing, meaning once we download your tagged files, there is no way for you to update them. If there is a critical issue in your latest release the best course of action is to tag a new semver valid release with the fix and purge the CDN URLs using our purge API.
# Cache purging forces the update of all version-aliased users. Please note:
# - It will not work for static files as explained above.
# - Valid semver releases must be used for purge to work
# - Rate-limiting applies to all users
# To avoid abuse, access to purge is given after an email request (for now - d@jsdelivr.com).

curl https://purge.jsdelivr.net/gh/michaelnordmeyer/snoopy@latest/dist/snoopy-min.css
curl https://purge.jsdelivr.net/gh/michaelnordmeyer/snoopy@latest/dist/snoopy-min.js

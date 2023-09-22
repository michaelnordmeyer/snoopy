# Snoopy

Snoopy is a bookmarklet for snooping on web pages. It's intended for use on mobile browsers where you can't view-source to poke around under the hood of sites to see how they're built, but you might find it useful for your desktop browser too.

Using the bookmarklet will give you an overlay featuring information that Snoopy can 'sniff' out of the page, such as the doctype, what JS libraries are used in the page, what analytics, what font embedding technique is used, etc. It also gives you the ability to view the raw and/or generated source of the page.

The Snoopy bookmarklet (click to try): [Snoopy](javascript:(function()%7Bvar%20c=document.getElementById(%22snpy%22);if(c)%7Bc.classList.toggle(%22closed%22);return%7Dvar%20b=document.createElement(%22link%22);b.setAttribute(%22href%22,%22https://cdn.jsdelivr.net/gh/michaelnordmeyer/snoopy@latest/snoopy-min.css%22);b.setAttribute(%22rel%22,%22stylesheet%22);document.head.appendChild(b);var%20a=document.createElement(%22script%22);a.setAttribute(%22src%22,%22https://cdn.jsdelivr.net/gh/michaelnordmeyer/snoopy@latest/snoopy-min.js%22);document.body.appendChild(a)%7D)()){:other style="display: inline-block; padding: 8px 15px; background: #333; color: #FFF; margin-left: 10px; border-radius: 10px; text-decoration: none;"}

## Detection Capabilities

Snoopy can detect the following items:

* General page information
  * Doctype
  * Charset
* JavaScript libraries
  * Dojo
  * ExtJS
  * Glow
  * Google Closure
  * jQuery
  * JQuery Mobile
  * jQuery UI
  * Modernizr
  * MooTools
  * Prototype
  * Scriptaculous
  * YUI2
  * YUI3
* Content Management Systems
  * Blogger
  * Drupal
  * Ghost
  * Jekyll
  * Jimdo
  * Joomla
  * Medium
  * MovableType
  * Octopress
  * Squarespace
  * Tumblr
  * Typepad
  * Typo3
  * Weebly
  * Wix
  * WordPress
* Analytics
  * Ackee
  * Chartbeat
  * Clicky
  * Cloudflare Insights
  * Fathom
  * Gauges
  * GoatCounter
  * Google Analytics (ga.js, analytics.js, and GA4)
  * Koko Analytics
  * Matomo
  * Microanalytics
  * Mint
  * New Relic
  * Open Web Analytics
  * Pirsch
  * Plausible
  * Reinvigorate
  * Slimstat Analytics
  * TinyAnalytics
  * Umami
  * W3Counter
  * Webtrends
  * Woopra
  * WordPress Stats
* Font embedding (technique)
  * Adobe Fonts
  * Cufon
  * Google Fonts
  * sIFR
* Commenting systems
  * Cactus Comments
  * Discourse
  * Disqus
  * Giscus
  * Isso
  * Utterances

## Built with

Snoopy makes use of a few other projects to make it all run nicely:

* Cleanslate (Heavy-duty reset stylesheet for widgets) - [https://github.com/premasagar/cleanslate](http://github.com/premasagar/cleanslate), MIT license
* Floodlight.js (Lightweight (X)HTML syntax highlighter) - [https://github.com/aron/floodlight.js](https://github.com/aron/floodlight.js), MIT license
* Sniffer (Page info detection) - [https://github.com/allmarkedup/sniffer](https://github.com/allmarkedup/sniffer)

## Browser Support

This is intended to be used in modern, mobile browsers, although it's intended to work in modern *desktop* browsers too. At the moment it is only really being actively tested in Mobile Safari, although I'll hopefully get some more complete browser testing done at some point soon.

I am not currently intending to support any versions of IE (although IE9 *may* be supported in the future... but don't hold your breath).

## How to Build

Run `package.sh` to create files from source.

After `snoopy-min.{css,js}` have been pushed to Github, `purge-caches.sh` will purge the jsDelivr caches so the new version can be used.

## Installation

### Mobile Safari

The easiest way is to open up desktop Safari, drag the bookmarklet above to the bookmarks bar, and then either use MobileMe or standard USB bookmark syncing to your iDevice. Alternatively, if you don't like syncing, you can do it the hard way…

1. Visit *this* page in Mobile Safari.
2. Copy all of the code in the following text area to the clipboard: `<textarea id="snoopycode">javascript:(function()%7Bvar%20c=document.getElementById(%22snpy%22);if(c)%7Bc.classList.toggle(%22closed%22);return%7Dvar%20b=document.createElement(%22link%22);b.setAttribute(%22href%22,%22https://cdn.jsdelivr.net/gh/michaelnordmeyer/snoopy@latest/snoopy-min.css%22);b.setAttribute(%22rel%22,%22stylesheet%22);document.head.appendChild(b);var%20a=document.createElement(%22script%22);a.setAttribute(%22src%22,%22https://cdn.jsdelivr.net/gh/michaelnordmeyer/snoopy@latest/snoopy-min.js%22);document.body.appendChild(a)%7D)();</textarea>`
3. Click the `+` button on the menu bar and click the `Add Bookmark` button.
4. Change the top field (the Title field) to `Snoopy` or whatever you want.
5. (I'd recommend adding this to the Bookmarks Bar at this point, too)
6. Click the `Save` button.
7. Take a deep breath. You're halfway there.
8. Now click on the little book icon in the menu bar to bring up your bookmarks. Navigate to the folder that you saved the Snoopy bookmark in.
9. Click the `Edit` button and then tap on the bookmark you just created to edit it.
10. Now select the second field from the top (the Address field), clear it out and paste the link you copied at the start into the field.
11. Hit the `Done` button to save, and you're all set!

### Chrome

The installation process for Chrome on iOS is essentially the same as for Mobile Safari:

1. Save the bookmarklet to the 'Bookmarks Bar' using Chrome on the desktop.
2. Sync bookmarks between iOS and desktop using your Google account.

OR…

1. Visit *this* page in Chrome for iOS.
2. Manually copy/paste the JavaScript into a new bookmark.

#### To then launch Snoopy on Chrome for iOS

1. Visit the web page on which you want to launch Snoopy
2. Type the name of your bookmarklet (eg. Snoopy) into the Omnibar.
3. Find the Snoopy bookmark at the end of the list Chrome displays.

[Read more](https://www.idownloadblog.com/2012/06/30/how-to-easily-use-bookmarklets-in-google-chrome-for-ios/) about bookmarklets and Chrome on iOS, including a short video.

### Android

~~~Unfortunately the stock Android browser doesn't currently support the use of the `javascript:` pseudo-protocol bookmarklets, so Snoopy can't be installed. If anyone has any ideas on how to work around this issue, then please get in touch and open an issue or create a pull request.~~~

It appears that newer versions (>2.1?) of Android *can* install bookmarklets - although there is a limited character set that can be used which may cause it to fail. Currently investigating.

### Desktop Browsers

Simply drag the bookmarklet above to your bookmarks bar and you're done.

## Contributors

* Mark Perkins (owner)
* James Brooks [https://github.com/jbrooksuk](https://github.com/jbrooksuk)
* Michael Nordmeyer [https://github.com/michaelnordmeyer](https://github.com/michaelnordmeyer)

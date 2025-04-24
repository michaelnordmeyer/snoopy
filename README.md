# Snoopy

Snoopy is a [bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet) for snooping on web pages. It's intended for use on mobile browsers where you can't view-source to poke around under the hood of sites to see how they're built, but you might find it useful for your desktop browser too.

Using the bookmarklet will give you an overlay featuring information that Snoopy can 'sniff' out of the page, such as the doctype, what JS libraries are used in the page, what analytics, what font embedding technique is used, etc. It also gives you the ability to view the raw and/or generated source of the page. To use it, just select the bookmarklet when being on the page you want to inspect.

JavaScript has to be turned on for bookmarklets to function.

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
  * Astro
  * Blogger
  * ClassicPress
  * Docusaurus
  * Drupal
  * Eleventy
  * Gatsby
  * Ghost
  * Gridsome
  * Hexo
  * Hugo
  * Jekyll
  * Jimdo
  * Joomla
  * Medium
  * Metalsmith
  * MovableType
  * Octopress
  * Scully
  * Squarespace
  * Tumblr
  * Typepad
  * Typo3
  * VuePress
  * Weebly
  * Wix
  * WordPress
  * Write.as
* Analytics
  * Ackee
  * Bearblog
  * Cabin
  * Chartbeat
  * Clicky
  * Cloudflare Insights
  * Fathom
  * Gauges
  * GoatCounter
  * Google Analytics (urchin.js, GA3 (=UA, ga.js, analytics.js, gtag.js), and GA4)
  * Google Tag Manager
  * Koko Analytics
  * Matomo
  * Microanalytics
  * New Relic
  * Open Web Analytics
  * Pirsch
  * Plausible
  * Reinvigorate
  * Simple Analytics
  * Slimstat Analytics
  * Statcounter
  * Statify
  * TinyAnalytics
  * Umami
  * W3Counter
  * Webtrends
  * Woopra
  * WordPress Stats
  * WP Statistics
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

## Browser Support

This is intended to be used in modern, mobile browsers, although it works in modern desktop browsers as well.

## Installation

1. Visit *this* page in Mobile Safari.
2. Bookmark it.
3. Copy all of the code in the following to the clipboard: `javascript:(function()%7Bvar%20c=document.getElementById(%22snpy%22);if(c)%7Bc.classList.toggle(%22closed%22);return%7Dvar%20b=document.createElement(%22link%22);b.setAttribute(%22href%22,%22https://cdn.jsdelivr.net/gh/michaelnordmeyer/snoopy@latest/snoopy-min.css%22);b.setAttribute(%22rel%22,%22stylesheet%22);document.head.appendChild(b);var%20a=document.createElement(%22script%22);a.setAttribute(%22src%22,%22https://cdn.jsdelivr.net/gh/michaelnordmeyer/snoopy@latest/snoopy-min.js%22);document.body.appendChild(a)%7D)();`
4. Edit saved bookmark.
5. Paste the copied code into the URL field.
6. Change the name of the bookmark to your linking.
7. Save it.

## Built with

Snoopy makes use of a few other projects to make it all run nicely:

* Cleanslate (Heavy-duty reset stylesheet for widgets) - [https://github.com/premasagar/cleanslate](http://github.com/premasagar/cleanslate), MIT license
* Floodlight.js (Lightweight (X)HTML syntax highlighter) - [https://github.com/aron/floodlight.js](https://github.com/aron/floodlight.js), MIT license
* Sniffer (Page info detection) - [https://github.com/michaelnordmeyer/sniffer](https://github.com/michaelnordmeyer/sniffer)

## How to Build

Run `package.sh` to create files from source.

After `snoopy-min.{css,js}` have been pushed to Github, `purge-caches.sh` will purge the jsDelivr caches so the new version can be used.

## Contributors

* [Mark Perkins (owner)](https://github.com/allmarkedup)
* [James Brooks](https://github.com/jbrooksuk)
* [Michael Nordmeyer](https://github.com/michaelnordmeyer)

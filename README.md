# Snoopy

Snoopy is a [bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet) for snooping on web pages. It's intended for use on mobile browsers where you can't view-source to poke around under the hood of sites to see how they're built, but you might find it useful for your desktop browser too.

Using the bookmarklet will give you an overlay featuring information that Snoopy can 'sniff' out of the page, such as the doctype, what JS libraries are used in the page, what analytics, what font embedding technique is used, etc. It also gives you the ability to view the raw and/or generated source of the page. To use it, just select the bookmarklet when being on the page you want to inspect.

JavaScript has to be turned on for bookmarklets to function.

## Detection Capabilities

Snoopy can detect the following items:

* General page information
  * Doctype
  * Charset
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
  * Lume
  * Medium
  * Metalsmith
  * MovableType
  * Nikola
  * Obsidian Publish
  * Octopress
  * Pandoc
  * Publii
  * Scully
  * Squarespace
  * Sushy
  * Tumblr
  * Typepad
  * Typo3
  * VitePress
  * VuePress
  * Weebly
  * Wix
  * WordPress
  * Write.as
  * WriteFreely
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
* Font embedding (technique)
  * Adobe Fonts
  * Cufon
  * Google Fonts
  * sIFR
* Commenting systems
  * Cactus Comments
  * Commento
  * Cusdis
  * Discourse
  * Disqus
  * Giscus
  * Isso
  * OpenWeb
  * Remark42
  * Utterances
* Analytics
  * Ackee
  * Bearblog
  * Burst Statistics
  * Cabin
  * Chartbeat
  * Clicky
  * Cloudflare Insights
  * Fathom
  * Gauges
  * GoatCounter
  * Google Analytics (urchin.js, GA3 (=UA, ga.js, analytics.js, gtag.js), and GA4)
  * Google Tag Manager
  * Hotjar
  * Koko Analytics
  * Matomo
  * Microanalytics
  * New Relic
  * Open Web Analytics
  * Pirsch
  * Plausible
  * Posthog
  * Rybbit
  * Seline
  * Simple Analytics
  * Slimstat Analytics
  * Statcounter
  * Statify
  * Statsig
  * TinyAnalytics.io
  * Tinybird
  * Tinylytics
  * Trackboxx
  * Umami
  * Usermaven
  * W3Counter
  * Webtrends
  * Woopra
  * WordPress Stats
  * WP Statistics

## Browser Support

This is intended to be used in modern, mobile browsers, although it works in modern desktop browsers as well.

## Installation

1. Visit *this* page in a browser.
2. Bookmark it.
3. Copy all of the code in the following to the clipboard: `javascript:(function()%7Bvar%20c=document.getElementById(%22snpy%22);if(c)%7Bc.classList.toggle(%22closed%22);return%7Dvar%20b=document.createElement(%22link%22);b.setAttribute(%22href%22,%22https://snoopy.michaelnordmeyer.com/snoopy-min.css%22);b.setAttribute(%22rel%22,%22stylesheet%22);document.head.appendChild(b);var%20a=document.createElement(%22script%22);a.setAttribute(%22src%22,%22https://snoopy.michaelnordmeyer.com/snoopy-min.js%22);document.body.appendChild(a)%7D)();`
4. Edit saved bookmark.
5. Paste the copied code into the URL field.
6. Change the name of the bookmark to your liking.
7. Save it.

## Dependencies

Snoopy makes use of a few other projects to make it all run nicely:

* [Cleanslate](http://github.com/premasagar/cleanslate) (Heavy-duty reset stylesheet for widgets), MIT license
* [Floodlight.js](https://github.com/aron/floodlight.js) (Lightweight (X)HTML syntax highlighter), MIT license
* [Sniffer](https://github.com/michaelnordmeyer/sniffer) (Page info detection)

## How to Build

Run `package.sh` to create files from source in directory `dist`.

## Contributors

* [Mark Perkins (original author)](https://github.com/allmarkedup)
* [James Brooks](https://github.com/jbrooksuk)
* [Michael Nordmeyer (current maintainer)](https://github.com/michaelnordmeyer)

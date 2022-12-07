Snoopy
=======

Snoopy is a bookmarklet for snooping on web pages. It's intended for use on mobile browsers where you can't view-source to poke around under the hood of sites to see how they're built, but you might find it useful for your desktop browser too.

Using the bookmarklet will give you an overlay featuring information that Snoopy can 'sniff' out of the page, such as the doctype, what JS libraries are used in the page, what analytics, what font embedding technique is used, etc. It also gives you the ability to view the raw and/or generated source of the page.

For full details and installation instructions please see [http://snoopy.allmarkedup.com](http://snoopy.allmarkedup.com/)

Canonical repo URL: [https://github.com/allmarkedup/snoopy](https://github.com/allmarkedup/snoopy)

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
  * Raphael
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
  * Weebly
  * Wix
  * WordPress
* Analytics
  * Chartbeat
  * Clicky
  * Gauges
  * Google Analytics
  * Mint
  * New Relic
  * Open Web Analytics
  * Piwik (now Matomo)
  * Reinvigorate
  * Slim Stat Analytics
  * W3Counter
  * Webtrends
  * Woopra
  * WordPress Stats
* Font embedding (technique)
  * Cufon
  * Google Fonts
  * sIFR
  * Typekit
* Commenting systems
  * Disqus


Built with...
-------------

Snoopy makes use of a few other projects to make it all run nicely:

* Cleanslate (Heavy-duty reset stylesheet for widgets) - [https://github.com/premasagar/cleanslate](http://github.com/premasagar/cleanslate), MIT license
* Floodlight.js (Lightweight (X)HTML syntax highlighter) - [https://github.com/aron/floodlight.js](https://github.com/aron/floodlight.js), MIT license
* Sniffer (Page info detection) - [https://github.com/allmarkedup/sniffer](https://github.com/allmarkedup/sniffer)


Browser Support
---------------

This is intended to be used in modern, mobile browsers, although it's intended to work in modern *desktop* browsers too. At the moment it is only really being actively tested in Mobile Safari, although I'll hopefully get some more complete browser testing done at some point soon.

I am not currently intending to support any versions of IE (although IE9 *may* be supported in the future... but don't hold your breath).


How to Build
------------

Run `package.sh` to create files from source.

After snoopy-min.{css,js} have been pushed to Github, `purge-caches.sh` will purge the jsDelivr caches so the new version can be used.


Contributors
------------

* Mark Perkins (owner)
* James Brooks [https://github.com/jbrooksuk](https://github.com/jbrooksuk)
* Michael Nordmeyer [https://github.com/michaelnordmeyer](https://github.com/michaelnordmeyer)

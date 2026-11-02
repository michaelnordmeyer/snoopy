/*
 * Sniffer - sniffs web pages to extract information such as CMS, JavaScript libraries, font services, commenting systems, analytics packages, etc.
 * Author: Mark Perkins, mark@allmarkedup.com
 * Author: Michael Nordmeyer
 */

var Sniffer = (function() {
  /* page component detection tests */

  var detect = {};

  detect.pageinfo = {
    description: 'Page Information',
    return_type: 'detail',
    tests: {
      'Doctype': [{
        type: 'doctype', // source: https://www.w3.org/QA/2002/04/valid-dtd-list.html
        test: {
          'HTML5': {
            name: 'html',
            publicId: ''
          },
          'HTML 4.01 Strict': {
            name: 'html',
            publicId: '-//W3C//DTD HTML 4.01//EN'
          },
          'HTML 4.01 Transitional': {
            name: 'html',
            publicId: '-//W3C//DTD HTML 4.01 Transitional//EN'
          },
          'HTML 3.0': {
            name: 'html',
            publicId: '-//W3C//DTD HTML 3.2 Final//EN'
          },
          'HTML 2.0': {
            name: 'html',
            publicId: '-//IETF//DTD HTML 2.0//EN'
          },
          'XHTML 1.1': {
            name: 'html',
            publicId: '-//W3C//DTD XHTML 1.1//EN'
          },
          'XHTML 1.0 Strict': {
            name: 'html',
            publicId: '-//W3C//DTD XHTML 1.0 Strict//EN'
          },
          'XHTML 1.0 Transitional': {
            name: 'html',
            publicId: '-//W3C//DTD XHTML 1.0 Transitional//EN'
          },
          'XHTML 1.0 Frameset': {
            name: 'html',
            publicId: '-//W3C//DTD XHTML 1.0 Frameset//EN'
          },
          'XHTML 1.0 Basic': {
            name: 'html',
            publicId: '-//W3C//DTD XHTML Basic 1.0//EN'
          }
        }
      }],
      'Charset': [{
        type: 'custom',
        test: function() {
          return document.characterSet || 'None detected';
        }
      }]
    }
  };

  detect.cms = {
    description: 'Content Management System',
    return_type: 'version',
    tests: {
      'Astro': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Astro v([\w\.-]*)/i
        }
      }],
      'Bear Blog': [{
        type: 'text',
        test: /<!-- Powered by Bear Blog -->/i
      },{
        type: 'link',
        test: {
          rel: 'canonical',
          match: /\/\/[^.]+\.bearblog\.dev/i
        }
      }],
      'Blogger': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /blogger/i
        }
      }, {
        type: 'custom',
        test: function() {
          return !!window._BlogView;
        }
      }],
      'Blot': [{
        type: 'link',
        test: {
          rel: 'icon',
          match: /\/\/cdn\.blot\.im\//i
        }
      },{
        type: 'link',
        test: {
          rel: 'stylesheet',
          match: /\/\/cdn\.blot\.im\//i
        }
      }],
      'ClassicPress': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /ClassicPress\s?([\w\.-]*)/i
        }
      }],
      'Docusaurus': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Docusaurus v([\w\.-]*)/i
        }
      }],
      'Drupal': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Drupal ([\w\.-]*) \(https:\/\/www\.drupal\.org\)/i
        }
      }, {
        type: 'custom',
        test: function() {
          return !!window.Drupal;
        } // no version in js obj
      }],
      'Eleventy': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Eleventy v([\w\.-]*)/i
        }
      }, {
        type: 'meta',
        test: {
          name: 'generator',
          match: /Eleventy/i
        }
      }],
      'Gatsby': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Gatsby ([\w\.-]*)/i
        }
      }],
      'Ghost': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Ghost\s?([\w\.-]*)/i
        }
      }],
      'Gridsome': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Gridsome v([\w\.-]*)/i
        }
      }],
      'Hexo': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Hexo ([\w\.-]*)/i
        }
      }],
      'Hugo': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Hugo ([\w\.-]*)/i
        }
      }],
      'Jekyll': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Jekyll v([\w\.-]*)/i
        }
      }],
      'Jimdo': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Jimdo Creator/i
        }
      }, {
        type: 'meta',
        test: {
          name: 'generator',
          match: /Jimdo Dolphin/i
        }
      }, {
        type: 'custom',
        test: function() {
          return !!window.jimdoData;
        }
      }],
      'Joomla': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /joomla\!?\s?([\d.]*)/i
        }
      }],
      'Lume': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Lume ([\w\.-]*)/i
        }
      }],
      'Medium': [{
        type: 'custom',
        test: function() {
          return !!window.__GRAPHQL_URI__;
        }
      }],
      'Metalsmith': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Metalsmith/i
        }
      }],
      'Micro.blog': [{
        type: 'custom',
        test: function() {
          return !!window.microblog;
        }
      }, {
        type: 'link',
        test: {
          rel: 'subscribe',
          match: /\/\/micro\.blog\//i
        }
      }],
      'MovableType': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Movable Type Pro ([\d.]*)/i
        }
      }, {
        type: 'custom',
        test: function() {
          return !!window.MT;
        }
      }],
      'Neato': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Neato/i
        }
      }],
      'Next.js': [{
        type: 'custom',
        test: function() {
          return window.next ? window.next.version : false;
        }
      }],
      'Nikola': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Nikola \(getnikola\.com\)/i
        }
      }],
      'Nuxt.js': [{
        type: 'custom',
        test: function() {
          return !!window.__NUXT_COLOR_MODE__;
        }
      }],
      'Obsidian Publish': [{
        type: 'text',
        test: /<base [^>]+\/\/publish\.obsidian\.md/i
      }],
      'Octopress': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /.*Octopress.*/i
        }
      }],
      'Pandoc': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /pandoc/i
        }
      }],
      'Publii': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Publii Open-Source CMS for Static Site/i
        }
      }],
      'Quarto': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /quarto-([\w\.-]*)/i
        }
      }],
      'Scully': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Scully ([\w\.-]*)/i
        }
      }],
      'Squarespace': [{
        type: 'custom',
        test: function() {
          return !!window.Squarespace;
        }
      }],
      'Substack': [{
        type: 'link',
        test: {
          rel: 'icon',
          match: /\/\/substackcdn\.com\//i
        }
      },{
        type: 'link',
        test: {
          rel: 'stylesheet',
          match: /\/\/substackcdn\.com\//i
        }
      }],
      'Sushy': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Sushy ([\w\.-]*)/i
        }
      }],
      'Svbtle': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Svbtle\.com/i
        }
      }],
      'Tumblr': [{
        type: 'custom',
        test: function() {
          return !!window.Tumblr;
        }
      }],
      'Typepad': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /typepad\.com/i
        }
      }],
      'Typo3': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Typo3 CMS/i
        }
      }],
      'VitePress': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /VitePress ([\w\.-]*)/i
        }
      }],
      'VuePress': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /VuePress ([\w\.-]*)/i
        }
      }],
      'Weebly': [{
        type: 'custom',
        test: function() {
          return !!window.Weebly;
        }
      }],
      'Wix': [{
        type: 'custom',
        test: function() {
          return !!(window.wixDeveloperAnalytics || window.wixEmbedsAPI || window.wixPerformanceMeasurements || window.wixTagManager);
        }
      }],
      'WordPress': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /WordPress\s?([\w\.-]*)/i
        }
      }, {
        type: 'text',
        test: /<link [^>]+wp-content/i
      }],
      'Write.as': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Write\.as/i
        }
      }],
      'WriteFreely': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /WriteFreely/i
        }
      }]
    }
  };

  detect.js_libs = {
    description: 'JavaScript Libraries',
    return_type: 'version',
    // All individual tests should either return a version number, true or false.
    tests: {
      'Dojo': [{
        type: 'custom',
        test: function() {
          return window.dojo ? window.dojo.version.toString() : false;
        }
      }],
      'ExtJS': [{
        type: 'custom',
        test: function() {
          return window.Ext ? window.Ext.version : false;
        }
      }],
      'Glow': [{
        type: 'custom',
        test: function() {
          return window.glow ? window.glow.VERSION : false;
        }
      }],
      'Google Closure': [{
        type: 'custom',
        test: function() {
          return !!window.goog;
        } // need to figure out how to get Closure version
      }],
      'jQuery': [{
        type: 'custom',
        test: function() {
          return window.jQuery ? window.jQuery.fn.jquery : false;
        }
      }],
      'jQuery Mobile': [{
        type: 'custom',
        test: function() {
          return window.jQuery && window.jQuery.mobile ? window.jQuery.mobile.version : false;
        }
      }],
      'jQuery UI': [{
        type: 'custom',
        test: function() {
          return window.jQuery && window.jQuery.ui ? window.jQuery.ui.version : false;
        }
      }],
      'Modernizr': [{
        type: 'custom',
        test: function() {
          return window.Modernizr ? window.Modernizr._version : false;
        }
      }],
      'MooTools': [{
        type: 'custom',
        test: function() {
          return window.MooTools ? window.MooTools.version : false;
        }
      }],
      'Prototype': [{
        type: 'custom',
        test: function() {
          return window.Prototype ? window.Prototype.Version : false;
        }
      }],
      'Scriptaculous': [{
        type: 'custom',
        test: function() {
          return window.Scriptaculous ? window.Scriptaculous.Version : false;
        }
      }],
      'YUI2': [{
        type: 'custom',
        test: function() {
          return window.YAHOO ? window.YAHOO.VERSION : false;
        }
      }],
      'YUI3': [{
        type: 'custom',
        test: function() {
          return window.YUI ? window.YUI.version : false;
        }
      }]
    }
  };

  detect.fonts = {
    description: 'Fonts',
    return_type: 'version',
    tests: {
      'Adobe Fonts': [{
        type: 'custom',
        test: function() {
          return !!window.Typekit
        }
      }],
      'Cufon': [{
        type: 'custom',
        test: function() {
          return !!window.Cufon
        }
      }],
      'Google Fonts': [{
        type: 'custom',
        test: function() {
          return !!window.WebFont
        }
      }, {
        type: 'text',
        test: /<link [^>]+fonts\.googleapis\.com/i
      }],
      'sIFR': [{
        type: 'custom',
        test: function() {
          return !!window.sIFR
        }
      }]
    }
  };

  detect.comments = {
    description: 'Comments',
    return_type: 'version',
    tests: {
      'Cactus Comments': [{
        type: 'text',
        test: /<script [^>]+\/\/latest\.cactus\.chat\/cactus\.js/i
      }],
      'Commento': [{
        type: 'text',
        test: /<script [^>]+\/\/cdn\.commento\.io\/js\/commento\.js/i
      }, {
        type: 'custom',
        test: function() {
          return !!window.commento
        }
      }],
      'Cusdis': [{
        type: 'text',
        test: /<script [^>]+\/\/cusids\.com\/js\/cusdis\.es\.js/i
      }, {
        type: 'custom',
        test: function() {
          return !!window.CUSDIS
        }
      }],
      'Discourse': [{
        type: 'custom',
        test: function() {
          return !!window.DiscourseEmbed
        }
      }],
      'Disqus': [{
        type: 'custom',
        test: function() {
          return !!window.disqus_identifier
        }
      },{
        type: 'text',
        test: /<div [^>]+disqus_thread/i
      }],
      'Giscus': [{
        type: 'text',
        test: /<script [^>]+giscus\.app\/client\.js/i
      },{
        type: 'text',
        test: /<iframe [^>]+giscus-frame/i
      }],
      'Isso': [{
        type: 'text',
        test: /<section [^>]+isso-thread/i
      }],
      'OpenWeb': [{
        type: 'text',
        test: /<script [^>]+data-spotim-module/i
      }],
      'Remark42': [{
        type: 'text',
        test: /<div [^>]+\/\/id="remark42"/i
      }, {
        type: 'custom',
        test: function() {
          return !!window.remark_config
        }
      }],
      'Talkyard': [{
        type: 'custom',
        test: function() {
          return !!window.talkyardServerUrl
        }
      }],
      'Utterances': [{
        type: 'text',
        test: /<script [^>]+utteranc\.es\/client\.js/i
      },{
        type: 'text',
        test: /<iframe [^>]+utterances-frame/i
      }],
      'Zoomment': [{
        type: 'text',
        test: /<script [^>]+cdn\.zoomment\.com\/zoomment\.min\.js/i
      }]
    }
  };

  detect.analytics = {
    description: 'Analytics',
    return_type: 'version',
    tests: {
      'Ackee': [{
        type: 'text',
        test: /<script [^>]+\/\/a\.electerious\.com\/_\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.ackeeTracker;
        }
      }],
      'Bear Blog': [{
        type: 'text',
        test: /<style>[^\/]+body:hover/i
      }],
      'Burst Statistics': [{
        type: 'custom',
        test: function() {
          return !!window.burst;
        }
      }],
      'Cabin': [{
        type: 'text',
        test: /<script [^>]+\/\/scripts\.withcabin\.com\/hello\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.cabin;
        }
      }],
      'Chartbeat': [{
        type: 'text',
        test: /<script [^>]+\/\/static\.chartbeat\.com\/js\/chartbeat\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!(window._cb_shared || window._sf_async_config);
        }
      }],
      'Clicky': [{
        type: 'text',
        test: /<script [^>]+\/\/static\.getclicky\.com\/js/i
      },{
        type: 'custom',
        test: function() {
          return !!window.clicky;
        }
      }],
      'Cloudflare Insights': [{
        type: 'text',
        test: /<script [^>]+\/\/static\.cloudflareinsights\.com\/beacon\.min\.js/i
      },{
        type: 'custom',
        test: function() {
          return !!window.__cfBeacon;
        }
      }],
      'DataFast': [{
        type: 'text',
        test: /<script [^>]+\/\/datafa\.st\/js\/script\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.datafast;
        }
      }],
      'Fathom': [{
        type: 'text',
        test: /<script [^>]+\/\/cdn\.usefathom\.com\/script\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.fathom;
        }
      }],
      'Fullres': [{
        type: 'text',
        test: /<script [^>]+\/\/t\.fullres\.net\/tag_[0-9a-zA-Z]{8}\.js\?[0-9]{13}/i
      }],
      'Gauges': [{
        type: 'text',
        test: /<script [^>]+\/\/secure\.gaug\.es\/track\.js/i
      },{
        type: 'custom',
        test: function() {
          return !!window._gauges;
        }
      }],
      'Ghost Web Analytics': [{
        type: 'text',
        test: /<script [^>]+\/ghost-stats\.min\.js/i
      }],
      'GoatCounter': [{
        type: 'text',
        test: /<script [^>]+\/\/gc\.zgo\.at\/count\.js/i
      },
      {
        type: 'text',
        test: /<script[^>]+data-goatcounter=/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.goatcounter;
        }
      }],
      'GoSquared': [{
        type: 'text',
        test: /<script [^>]+\/\/d1l6p2sc9645hc\.cloudfront\.net\/gosquared\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!(window.GoSquared || window._gs);
        }
      }],
      'Google Analytics 1': [{ // 2005
        type: 'text',
        test: /<script [^>]+\/\/www\.google-analytics\.com\/urchin\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window._uacct;
        }
      }],
      'Google Analytics 2': [{ // 2007 _gat, 2009 _gaq
        type: 'text',
        test: /<script [^>]+\/\/ssl\.google-analytics\.com\/ga\.js/i
      },
      {
        type: 'text',
        test: /<script [^>]+\/\/www\.google-analytics\.com\/ga\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!(window._gaq || window._gat);
        }
      }],
      'Google Analytics 3': [{ // 2013
        type: 'text',
        test: /<script [^>]+\/\/www\.google-analytics\.com\/analytics\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.ga;
        }
      }],
      'Google Analytics 3/GST': [{ // 2017
        type: 'text',
        test: /<script [^>]+\/\/www\.googletagmanager\.com\/gtag\/js\?id=UA-[A-Z0-9]{8}-[0-9]+/i // A property ID can have 25 view IDs
      },
      {
        type: 'custom',
        test: function() {
          return !!window.gtag;
        }
      }],
      'Google Analytics 4': [{ // 2020
        type: 'text',
        test: /<script [^>]+\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]{10}/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.gtag;
        }
      }],
      'Google Tag Manager': [{
        type: 'text',
        test: /<script [^>]+\/\/www\.googletagmanager\.com\/gtm\.js\?id=GTM-[A-Z0-9]{6,13}/i
      },
      {
        type: 'text',
        test: /<iframe [^>]+\/\/www\.googletagmanager\.com\/ns\.html\?id=GTM-[A-Z0-9]{6,13}/i
      }],
      'Growblog': [{
        type: 'text',
        test: /<script [^>]+\/\/t\.ghostboard\.io\/min\.js/i
      },
      {
        type: 'text',
        test: /<script [^>]+\/\/t\.growblog\.io\/min\.js/i
      }],
      'Hotjar': [{
        type: 'text',
        test: /<script [^>]+\/\/static\.hotjar\.com\/c\/hotjar-[0-9]+\.js\?sv=[0-9]+/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.hj;
        }
      }],
      'Independent Analytics': [{
        type: 'text',
        test: /<script [^>]+independent-analytics-script/i
      }],
      'Koko Analytics': [{
        type: 'text',
        test: /<script [^>]+\/\/.+\/plugins\/koko-analytics\/assets\/dist\/js\/script\.js/i
      },
      {
        type: 'text',
        test: /<script [^>]+\/\/.+\/plugins\/koko-analytics-pro\/assets\/dist\/js\/script\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.koko_analytics;
        }
      }],
      'Matomo': [{
        type: 'text',
        test: /<script [^>]+\/\/.+\/matomo\.js/i
      },
      {
        type: 'text',
        test: /<script [^>]+\/\/.+\/piwik\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!(window._paq || window.Matomo || window.Piwik);
        }
      }],
      'Microanalytics': [{
        type: 'text',
        test: /<script [^>]+\/\/microanalytics\.io\/js\/script\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.pa;
        }
      }],
      'Momently': [{
        type: 'text',
        test: /<script [^>]+\/[0-9a-zA-Z]{11}_momently\.js/i
      }],
      'New Relic': [{
        type: 'custom',
        test: function() {
          return !!(window.NREUMQ || window.NREUM);
        }
      }],
      'Open Web Analytics': [{
        type: 'text',
        test: /<script [^>]+\/\/.+\/modules\/base\/js\/owa\.tracker-combined-min\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!(window.OWA || window.owa_baseUrl);
        }
      }],
      'Pirsch': [{
        type: 'text',
        test: /<script [^>]+\/\/api\.pirsch\.io\/pirsch\.js/i
      },
      {
        type: 'text',
        test: /<script [^>]+\/\/api\.pirsch\.io\/pirsch-extended\.js/i
      },
      {
        type: 'text',
        test: /<script [^>]+\/\/api\.pirsch\.io\/pirsch-events\.js/i
      },
      {
        type: 'text',
        test: /<script [^>]+\/\/api\.pirsch\.io\/pirsch-sessions\.js/i
      }],
      'Plausible': [{
        type: 'text',
        test: /<script [^>]+\/\/plausible\.io\/js\/script\.js/i
      },
      {
        type: 'text',
        test: /<script [^>]+\/\/plausible\.io\/js\/plausible\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.plausible;
        }
      }],
      'PostHog': [{
        type: 'custom',
        test: function() {
          return !!window.posthog;
        }
      }],
      'Rybbit': [{
        type: 'text',
        test: /<script [^>]+\/\/app\.rybbit\.io\/api\/script\.js/i
      },{
        type: 'custom',
        test: function() {
          return !!window.rybbit;
        }
      }],
      'Seline': [{
        type: 'text',
        test: /<script [^>]+\/\/cdn\.seline\.com\/seline\.js/i
      },{
        type: 'custom',
        test: function() {
          return !!window.seline;
        }
      }],
      'Simple Analytics': [{
        type: 'text',
        test: /<script [^>]+\/\/scripts\.simpleanalyticscdn\.com\/latest\.js/i
      },{
        type: 'custom',
        test: function() {
          return !!window.sa_loaded;
        }
      }],
      'Slimstat Analytics': [{
        type: 'text',
        test: /<script [^>]+\/\/cdn\.jsdelivr\.net\/wp\/wp-slimstat\/tags\/.+\/wp-slimstat\.min\.js/i
      },{
        type: 'custom',
        test: function() {
          return !!window.SlimStatParams;
        }
      }],
      'Statcounter': [{
        type: 'text',
        test: /<script [^>]+statcounter\.com\/counter\/counter.*\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window._statcounter;
        }
      }],
      'Statify': [{
        type: 'custom',
        test: function() {
          return !!window.statify_ajax;
        }
      },
      {
        type: 'custom',
        test: function() {
          return !!window.statifyAjax;
        }
      }],
      'Statsig': [{
        type: 'text',
        test: /<script [^>]+\/\/cdn\.jsdelivr\.net\/npm\/@statsig\/js-client@3\/build\/statsig-js-client\+session-replay\+web-analytics\.min\.js\?apikey=123/i
      },{
        type: 'custom',
        test: function() {
          return !!window.Statsig;
        }
      }],
      'TinyAnalytics.io': [{
        type: 'text',
        test: /<script [^>]+\/\/app\.tinyanalytics\.io\/pixel\/[a-zA-Z0-9]{16}/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.tinyanalytics;
        }
      }],
      'Tinybird': [{
        type: 'text',
        test: /<script [^>]+\/\/unpkg\.com\/@tinybirdco\/flock\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.Tinybird;
        }
      }],
      'Tinylytics': [{
        type: 'text',
        test: /<script [^>]+\/\/tinylytics\.app\/embed\/[a-zA-Z0-9-_]{20}(\/min)?\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.should_collect;
        }
      }],
      'Trackboxx': [{
        type: 'text',
        test: /<script [^>]+\/\/cdn\.trackboxx\.info\/p\/tracker\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.trackboxx;
        }
      }],
      'Umami': [{
        type: 'text',
        test: /<script [^>]+\/\/umami\.is\/a\/script\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.umami;
        }
      }],
      'Usermaven': [{
        type: 'text',
        test: /<script [^>]+\/\/t\.usermaven\.com\/lib\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.usermaven;
        }
      }],
      'Vercel Insights': [{
        type: 'text',
        test: /<script [^>]+\/_vercel\/insights\/script\.js/i
      }],
      'W3Counter': [{
        type: 'text',
        test: /<script [^>]+\/\/www\.w3counter\.com\/tracker\.js\?id=.+/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window._w3counter;
        }
      }],
      'Webtrends': [{
        type: 'text',
        test: /<script [^>]+\/\/s\.webtrends\.com\/js\/webtrends\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window.Webtrends;
        }
      }],
      'Woopra': [{
        type: 'custom',
        test: function() {
          return !!window.woopra;
        }
      }],
      'WordPress Stats': [{
        type: 'text',
        test: /<script [^>]+\/\/stats\.wp\.com\/w\.js/i
      },
      {
        type: 'text',
        test: /<script [^>]+\/\/stats\.wp\.com\/e-.+\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!(window._tkq || window._stq);
        }
      }],
      'WP Statistics': [{
        type: 'custom',
        test: function() {
          return !!window.WP_Statistics_Tracker_Object;
        }
      }]
    }
  };

  detect.feeds = {
    description: 'Web Feeds',
    return_type: 'version',
    tests: {
      'Atom': [{
        type: 'link',
        test: {
          rel: 'alternate',
          match: /^application\/atom\+xml$/i
        }
      }],
      'JSON Feed': [{
        type: 'link',
        test: {
          rel: 'alternate',
          match: /^application\/feed\+json$/i
        }
      }],
      'RSS': [{
        type: 'link',
        test: {
          rel: 'alternate',
          match: /^application\/rss\+xml$/i
        }
      }]
    }
  };

  /* utility functions */

  // test arg should be a regexp, in which the only *specific* match is the version number
  function match(str, test) {
    var match = str.match(test);
    if (match) {
      return match[1] && match[1] != '' ? match[1] : true; // return version number if poss or else true.
    }
    return false;
  }

  // iterate over the tests
  var forEachTest = function(callback) {
    for (group in detect) {
      if (detect.hasOwnProperty(group)) {
        for (test in detect[group].tests) {
          if (detect[group].tests.hasOwnProperty(test)) {
            if (callback(group, test) === false) {
              return;
            }
          }
        }
      }
    }
  }

  var empty = function(obj) {
    for (var name in obj) {
      return false;
    }
    return true;
  }

  /* test runners */

  var test_runner = {};

  // custom tests just run a function that returns a version number, true or false.
  test_runner.custom = function(test) {
    return test();
  }

  // one-off regexp-based tests
  var html = document.documentElement.outerHTML || document.documentElement.innerHTML;
  test_runner.text = function(test) {
    return match(html, test);
  }

  // check the doctype
  var doctype = document.doctype;
  if (doctype) {
    test_runner.doctype = function(test) {
      for (subtest in test) {
        if (test.hasOwnProperty(subtest)) {
          var actualTest = test[subtest];
          if (doctype.name.toLowerCase() == actualTest.name && doctype.publicId == actualTest.publicId) {
            return subtest;
          }
        }
      }
      return false;
    }
  } else {
    test_runner.doctype = function() {
      return 'None detected';
    }
  }

  // check the head's link elements
  var links = document.getElementsByTagName("link");
  // discard link tags that aren't useful
  links = (function() {
    for (var link, temp = [], i = -1; link = links[++i];) {
      if (link.rel && link.href) temp.push(link);
    }
    return temp;
  })();

  if (links.length) {
    test_runner.link = function(test) {
      for (var link, i = -1; link = links[++i];) {
        if (link.rel.localeCompare(test.rel, "en", { sensitivity: "base" }) === 0) {
          var result = match(link.href, test.match);
          if (result) {
            return result;
          } else {
            result = match(link.type, test.match);
            if (result) {
              return result;
            }
          }
        }
      }
      return false;
    }
  } else {
    test_runner.link = function() {
      return false;
    }
  }

  // check the head's meta elements
  var metas = document.getElementsByTagName("meta");
  // discard meta tags that aren't useful
  metas = (function() {
    for (var meta, temp = [], i = -1; meta = metas[++i];) {
      if (meta.name && meta.content) temp.push(meta);
    }
    return temp;
  })();

  if (metas.length) {
    test_runner.meta = function(test) {
      for (var meta, i = -1; meta = metas[++i];) {
        if (meta.name.localeCompare(test.name, "en", { sensitivity: "base" }) === 0) {
          var result = match(meta.content, test.match);
          if (result) {
            return result;
          }
        }
      }
      return false;
    }
  } else {
    test_runner.meta = function() {
      return false;
    }
  }

  // check the script src
  var scripts = document.getElementsByTagName("script");
  // discard script tags that aren't useful
  scripts = (function() {
    for (var script, temp = [], i = -1; script = scripts[++i];) {
      if (script.src) temp.push(scripts);
    }
    return temp;
  })();

  if (scripts.length) {
    test_runner.script = function(test) {
      for (var script, i = -1; script = scripts[++i];) {
        var result = match(script.src, test);
        if (result) {
          return result;
        }
      }
      return false;
    }
  } else {
    test_runner.script = function() {
      return false;
    }
  }

  /* main function responsible for running the tests */

  var run = function(tests_array) {
    for (var check, i = -1; check = tests_array[++i];) {
      var result = test_runner[check.type](check.test);
      if (result !== false) return result;
    }
    return false;
  }

  var results = {};
  var indexed_results = {};

  var addToResults = function(group, test, result) {
    results[group] = results[group] || {};
    results[group].results = results[group].results || {};
    results[group].description = detect[group].description;
    results[group].return_type = detect[group].return_type;
    results[group]['results'][test] = result;
    indexed_results[test.toLowerCase()] = result;
  }

  /* publicly available methods */

  var sniff = {};

  // perform an individual check
  sniff.check = function(to_test) {
    to_test = to_test.toLowerCase();
    if (indexed_results[to_test] != undefined) {
      return indexed_results[to_test];
    } else {
      forEachTest(function(group, test) {
        if (test.toLowerCase() === to_test) {
          addToResults(group, test, run(detect[group].tests[test]));
          return false; // break out of forEachTest loop
        }
      });
    }
    return indexed_results[to_test];
  };

  // run or re-run all checks
  sniff.run = function() {
    forEachTest(function(group, test) {
      addToResults(group, test, run(detect[group].tests[test]));
    });

    return results;
  };

  return sniff;
})();

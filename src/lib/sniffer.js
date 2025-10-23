/*
 * Sniffer - sniffs web pages to extract information such as CMS, JavaScript libraries, font services, commenting systems, analytics packages, etc.
 * Author: Mark Perkins, mark@allmarkedup.com
 */

var Sniffer = (function(win, doc, undefined) {
  var sniff = {};
  var detect = {};
  var pageinfo = {};
  var test_runner = {};
  var results = {};
  var indexed_results = {};
  var scripts = doc.getElementsByTagName("script");
  var metas = doc.getElementsByTagName("meta");
  var html = doc.documentElement.outerHTML || doc.documentElement.innerHTML;
  var doctype = doc.doctype;
  var has_run = false;

  // discard meta tags that aren't useful
  metas = (function() {
    for (var meta, temp = [], i = -1; meta = metas[++i];) {
      if (meta.name && meta.content) temp.push(meta);
    }
    return temp;
  })();

  // discard script tags that aren't useful
  scripts = (function() {
    for (var script, temp = [], i = -1; script = scripts[++i];) {
      if (script.src) temp.push(scripts);
    }
    return temp;
  })();

  /* page component detection tests */

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
          return doc.characterSet || 'None detected';
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
      'Blogger': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /blogger/i
        }
      }, {
        type: 'custom',
        test: function() {
          return win._BlogView ? true : false;
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
          return win.Drupal ? true : false;
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
          return win.jimdoData ? true : false;
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
          return win.__GRAPHQL_URI__ ? true : false;
        }
      }],
      'Metalsmith': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Metalsmith/i
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
          return win.MT ? true : false;
        }
      }],
      'Nikola': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Nikola \(getnikola\.com\)/i
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
          return win.Squarespace ? true : false;
        }
      }],
      'Sushy': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Sushy ([\w\.-]*)/i
        }
      }],
      'Tumblr': [{
        type: 'custom',
        test: function() {
          return win.Tumblr ? true : false;
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
          return win.Weebly ? true : false;
        }
      }],
      'Wix': [{
        type: 'custom',
        test: function() {
          return (win.wixDeveloperAnalytics || win.wixEmbedsAPI || win.wixPerformanceMeasurements || win.wixTagManager) ? true : false;
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
          return win.dojo ? win.dojo.version.toString() : false;
        }
      }],
      'ExtJS': [{
        type: 'custom',
        test: function() {
          return win.Ext ? win.Ext.version : false;
        }
      }],
      'Glow': [{
        type: 'custom',
        test: function() {
          return win.glow ? win.glow.VERSION : false;
        }
      }],
      'Google Closure': [{
        type: 'custom',
        test: function() {
          return !!win.goog;
        } // need to figure out how to get Closure version
      }],
      'jQuery': [{
        type: 'custom',
        test: function() {
          return win.jQuery ? win.jQuery.fn.jquery : false;
        }
      }],
      'jQuery Mobile': [{
        type: 'custom',
        test: function() {
          return win.jQuery && win.jQuery.mobile ? win.jQuery.mobile.version : false;
        }
      }],
      'jQuery UI': [{
        type: 'custom',
        test: function() {
          return win.jQuery && win.jQuery.ui ? win.jQuery.ui.version : false;
        }
      }],
      'Modernizr': [{
        type: 'custom',
        test: function() {
          return win.Modernizr ? win.Modernizr._version : false;
        }
      }],
      'MooTools': [{
        type: 'custom',
        test: function() {
          return win.MooTools ? win.MooTools.version : false;
        }
      }],
      'Prototype': [{
        type: 'custom',
        test: function() {
          return win.Prototype ? win.Prototype.Version : false;
        }
      }],
      'Scriptaculous': [{
        type: 'custom',
        test: function() {
          return win.Scriptaculous ? win.Scriptaculous.Version : false;
        }
      }],
      'YUI2': [{
        type: 'custom',
        test: function() {
          return win.YAHOO ? win.YAHOO.VERSION : false;
        }
      }],
      'YUI3': [{
        type: 'custom',
        test: function() {
          return win.YUI ? win.YUI.version : false;
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
          return !!win.Typekit
        }
      }],
      'Cufon': [{
        type: 'custom',
        test: function() {
          return !!win.Cufon
        }
      }],
      'Google Fonts': [{
        type: 'custom',
        test: function() {
          return !!win.WebFont
        }
      }, {
        type: 'text',
        test: /<link [^>]+fonts\.googleapis\.com/i
      }],
      'sIFR': [{
        type: 'custom',
        test: function() {
          return !!win.sIFR
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
          return !!win.commento
        }
      }],
      'Cusdis': [{
        type: 'text',
        test: /<script [^>]+\/\/cusids\.com\/js\/cusdis\.es\.js/i
      }, {
        type: 'custom',
        test: function() {
          return !!win.CUSDIS
        }
      }],
      'Discourse': [{
        type: 'custom',
        test: function() {
          return !!win.DiscourseEmbed
        }
      }],
      'Disqus': [{
        type: 'custom',
        test: function() {
          return !!win.disqus_identifier
        }
      }],
      'Giscus': [{
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
          return !!win.remark_config
        }
      }],
      'Utterances': [{
        type: 'text',
        test: /<iframe [^>]+utterances-frame/i
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
          return !!win.ackeeTracker;
        }
      }],
      'Bearblog': [{
        type: 'text',
        test: /<style>[^\/]+body:hover/i
      }],
      'Burst Statistics': [{
        type: 'custom',
        test: function() {
          return !!win.burst;
        }
      }],
      'Cabin': [{
        type: 'text',
        test: /<script [^>]+\/\/scripts\.withcabin\.com\/hello\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win.cabin;
        }
      }],
      'Chartbeat': [{
        type: 'text',
        test: /<script [^>]+\/\/static\.chartbeat\.com\/js\/chartbeat\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!(win._cb_shared || win._sf_async_config);
        }
      }],
      'Clicky': [{
        type: 'text',
        test: /<script [^>]+\/\/static\.getclicky\.com\/js/i
      },{
        type: 'custom',
        test: function() {
          return !!win.clicky;
        }
      }],
      'Cloudflare Insights': [{
        type: 'text',
        test: /<script [^>]+\/\/static\.cloudflareinsights\.com\/beacon\.min\.js/i
      },{
        type: 'custom',
        test: function() {
          return !!win.__cfBeacon;
        }
      }],
      'Fathom': [{
        type: 'text',
        test: /<script [^>]+\/\/cdn\.usefathom\.com\/script\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win.fathom;
        }
      }],
      'Gauges': [{
        type: 'text',
        test: /<script [^>]+\/\/secure\.gaug\.es\/track\.js/i
      },{
        type: 'custom',
        test: function() {
          return !!win._gauges;
        }
      }],
      'GoatCounter': [{
        type: 'text',
        test: /<script [^>]+\/\/gc\.zgo\.at\/count\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win.goatcounter;
        }
      }],
      'Google Analytics 1': [{ // 2005
        type: 'text',
        test: /<script [^>]+\/\/www\.google-analytics\.com\/urchin\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win._uacct;
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
          return !!(win._gaq || win._gat);
        }
      }],
      'Google Analytics 3': [{ // 2013
        type: 'text',
        test: /<script [^>]+\/\/www\.google-analytics\.com\/analytics\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win.ga;
        }
      }],
      'Google Analytics 3/GST': [{ // 2017
        type: 'text',
        test: /<script [^>]+\/\/www\.googletagmanager\.com\/gtag\/js\?id=UA-[A-Z0-9]{8}-[0-9]+/i // A property ID can have 25 view IDs
      },
      {
        type: 'custom',
        test: function() {
          return !!win.gtag;
        }
      }],
      'Google Analytics 4': [{ // 2020
        type: 'text',
        test: /<script [^>]+\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]{10}/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win.gtag;
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
      'Hotjar': [{
        type: 'text',
        test: /<script [^>]+\/\/static\.hotjar\.com\/c\/hotjar-[0-9]+\.js\?sv=[0-9]+/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win.hj;
        }
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
          return !!win.koko_analytics;
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
          return !!(win._paq || win.Matomo || win.Piwik);
        }
      }],
      'Microanalytics': [{
        type: 'text',
        test: /<script [^>]+\/\/microanalytics\.io\/js\/script\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win.pa;
        }
      }],
      'New Relic': [{
        type: 'custom',
        test: function() {
          return !!(win.NREUMQ || win.NREUM);
        }
      }],
      'Open Web Analytics': [{
        type: 'text',
        test: /<script [^>]+\/\/.+\/modules\/base\/js\/owa\.tracker-combined-min\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!(win.OWA || win.owa_baseUrl);
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
        type: 'custom',
        test: function() {
          return !!win.plausible;
        }
      }],
      'Posthog': [{
        type: 'custom',
        test: function() {
          return !!win.posthog;
        }
      }],
      'Rybbit': [{
        type: 'text',
        test: /<script [^>]+\/\/app\.rybbit\.io\/api\/script\.js/i
      },{
        type: 'custom',
        test: function() {
          return !!win.rybbit;
        }
      }],
      'Seline': [{
        type: 'text',
        test: /<script [^>]+\/\/cdn\.seline\.com\/seline\.js/i
      },{
        type: 'custom',
        test: function() {
          return !!win.seline;
        }
      }],
      'Simple Analytics': [{
        type: 'text',
        test: /<script [^>]+\/\/scripts\.simpleanalyticscdn\.com\/latest\.js/i
      },{
        type: 'custom',
        test: function() {
          return !!win.sa_loaded;
        }
      }],
      'Slimstat Analytics': [{
        type: 'text',
        test: /<script [^>]+\/\/cdn\.jsdelivr\.net\/wp\/wp-slimstat\/tags\/.+\/wp-slimstat\.min\.js/i
      },{
        type: 'custom',
        test: function() {
          return !!win.SlimStatParams;
        }
      }],
      'Statcounter': [{
        type: 'text',
        test: /<script [^>]+statcounter\.com\/counter\/counter.*\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win._statcounter;
        }
      }],
      'Statify': [{
        type: 'custom',
        test: function() {
          return !!win.statify_ajax;
        }
      },
      {
        type: 'custom',
        test: function() {
          return !!win.statifyAjax;
        }
      }],
      'Statsig': [{
        type: 'text',
        test: /<script [^>]+\/\/cdn\.jsdelivr\.net\/npm\/@statsig\/js-client@3\/build\/statsig-js-client\+session-replay\+web-analytics\.min\.js\?apikey=123/i
      },{
        type: 'custom',
        test: function() {
          return !!win.Statsig;
        }
      }],
      'TinyAnalytics.io': [{
        type: 'text',
        test: /<script [^>]+\/\/app\.tinyanalytics\.io\/pixel\/[a-zA-Z0-9]{16}/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win.tinyanalytics;
        }
      }],
      'Tinybird': [{
        type: 'text',
        test: /<script [^>]+\/\/unpkg\.com\/@tinybirdco\/flock\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win.Tinybird;
        }
      }],
      'Tinylytics': [{
        type: 'text',
        test: /<script [^>]+\/\/tinylytics\.app\/embed\/[a-zA-Z0-9-_]{20}(\/min)?\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win.should_collect;
        }
      }],
      'Trackboxx': [{
        type: 'text',
        test: /<script [^>]+\/\/cdn\.trackboxx\.info\/p\/tracker\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win.trackboxx;
        }
      }],
      'Umami': [{
        type: 'text',
        test: /<script [^>]+\/\/umami\.is\/a\/script\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win.umami;
        }
      }],
      'Usermaven': [{
        type: 'text',
        test: /<script [^>]+\/\/t\.usermaven\.com\/lib\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win.usermaven;
        }
      }],
      'W3Counter': [{
        type: 'text',
        test: /<script [^>]+\/\/www\.w3counter\.com\/tracker\.js\?id=.+/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win._w3counter;
        }
      }],
      'Webtrends': [{
        type: 'text',
        test: /<script [^>]+\/\/s\.webtrends\.com\/js\/webtrends\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!win.Webtrends;
        }
      }],
      'Woopra': [{
        type: 'custom',
        test: function() {
          return !!win.woopra;
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
          return !!(win._tkq || win._stq);
        }
      }],
      'WP Statistics': [{
        type: 'custom',
        test: function() {
          return !!win.WP_Statistics_Tracker_Object;
        }
      }]
    }
  };

  /* test runners */

  // custom tests just run a function that returns a version number, true or false.
  test_runner.custom = function(test) {
    return test();
  }

  // one off regexp-based tests
  test_runner.text = function(test) {
    return match(html, test);
  }

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

  // check the script src... probably pretty unreliable
  if (scripts.length) {
    test_runner.script = function(test) {
      for (var script, i = -1; script = scripts[++i];) {
        return match(script.src, test);
      }
      return false;
    }
  } else {
    // no scripts, tests will always return false.
    test_runner.script = function() {
      return false;
    }
  }

  // check the meta elements in the head
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
    // there are no meta elements on the page so this will always return false
    test_runner.meta = function() {
      return false;
    }
  }

  // test arg should be a regexp, in which the only *specific* match is the version number
  function match(str, test) {
    var match = str.match(test);
    if (match) {
      return match[1] && match[1] != '' ? match[1] : true; // return version number if poss or else true.
    }
    return false;
  }

  /* main function responsible for running the tests */

  var run = function(tests_array) {
    for (var check, i = -1; check = tests_array[++i];) {
      var result = test_runner[check.type](check.test);
      if (result !== false) return result;
    }
    return false;
  }

  var empty = function(obj) {
    for (var name in obj) {
      return false;
    }
    return true;
  }

  // utility function for iterating over the tests
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

  var addToResults = function(group, test, result) {
    // add results to group results object
    results[group] = results[group] || {};
    results[group].results = results[group].results || {};
    results[group].description = detect[group].description;
    results[group].return_type = detect[group].return_type;
    results[group]['results'][test] = result;

    // add the result to the name-index results object
    indexed_results[test.toLowerCase()] = result;
  }

  /* publicly available methods */

  // return results of all checks run so far
  sniff.results = function() {
    return results;
  };

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

    return sniff.results();
  };

  return sniff;

})(window, document);

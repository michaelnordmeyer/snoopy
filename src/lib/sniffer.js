/*
 * Sniffer - sniffs web pages to extract information such as JS libraries, CMS, analytics packages, etc.
 * Author: Mark Perkins, mark@allmarkedup.com
 */

var Sniffer = (function(win, doc, undefined) {

  var sniff = {},
    detect = {},
    pageinfo = {},
    test_runner = {},
    results = {},
    indexed_results = {},
    scripts = doc.getElementsByTagName("script"),
    metas = doc.getElementsByTagName("meta"),
    html = doc.documentElement.outerHTML || doc.documentElement.innerHTML,
    doctype = doc.doctype,
    has_run = false;

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

  detect.cms = {

    description: 'Content Management System',

    return_type: 'version',

    tests: {

      'Blogger': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /blogger/i
        }
      }],
      'Drupal': [{
        type: 'custom',
        test: function() {
          return win.Drupal ? true : false;
        } // no version in js obj
      }],
      'Ghost': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Ghost\s?([\w\d\.\-_]*)/i
        }
      }, {
        type: 'custom',
        test: function() {
          return win.ghost ? true : false;
        }
      }],
      'Jekyll': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /Jekyll v([\w\d\.]*)/i
        }
      }],
      'Jimdo': [{
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
      'Medium': [{
        type: 'custom',
        test: function() {
          return win.__GRAPHQL_URI__ ? true : false;
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
      'Octopress': [{
        type: 'meta',
        test: {
          name: 'generator',
          match: /.*Octopress.*/i
        }
      }],
      'Squarespace': [{
        type: 'custom',
        test: function() {
          return win.Squarespace ? true : false;
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
          match: /WordPress\s?([\w\d\.\-_]*)/i
        }
      }, {
        type: 'text',
        test: /<link [^>]+wp-content/i
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
      'Google Analytics': [{
        type: 'text',
        test: /<script [^>]+\/\/ssl\.google-analytics\.com\/ga\.js/i
      },
      {
        type: 'text',
        test: /<script [^>]+\/\/www\.google-analytics\.com\/analytics\.js/i
      },
      {
        type: 'text',
        test: /<script [^>]+\/\/www\.googletagmanager\.com\/gtag\/js\?id=UA-xxxxxxxxx-1/i
      },
      {
        type: 'custom',
        test: function() {
          return !!(win._gat || win._gaq || win.ga || win.datalayer || win.gtag);
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
      'Reinvigorate': [{
        type: 'custom',
        test: function() {
          return !!win.reinvigorate;
        }
      }],
      'Simple Analytics': [{
        type: 'text',
        test: /<script [^>]+\/\/scripts\.simpleanalyticscdn\.com\/latest\.js/i
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
        test: /<script [^>]+\/\/secure\.statcounter\.com\/counter\/counter\.js/i
      }],
      'TinyAnalytics': [{
        type: 'text',
        test: /<script [^>]+\/\/cdn\.segment\.com\/analytics\.js\/v1\/.+\/analytics\.min\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!window["tinyanalytics"];
        }
      },
      {
        type: 'custom',
        test: function() {
          return !!window.AnalyticsNext;
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
      'Utterances': [{
        type: 'text',
        test: /<iframe [^>]+utterances-frame/i
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
          var t = test[subtest];

          if (doctype.name.toLowerCase() == t.name && doctype.publicId == t.publicId) {
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
        if (meta.name == test.name) {
          var res = match(meta.content, test.match);
          if (res) {
            return res;
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

  var addToResults = function(group, test, res) {
    // add results to group results object

    results[group] = results[group] || {};
    results[group].results = results[group].results || {};

    results[group].description = detect[group].description;
    results[group].return_type = detect[group].return_type;

    results[group]['results'][test] = res;

    // add the result to the name-index results object

    indexed_results[test.toLowerCase()] = res;
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

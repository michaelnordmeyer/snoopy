/*  Floodlight (X)HTML Syntax Highlighter - v0.2
 *  Copyright 2010, Aron Carroll
 *  Released under the MIT license
 *  More Information: https://github.com/aron/floodlight.js
 *  Based on hijs by Alexis Sellier https://github.com/cloudhead/hijs
 */

(function (window, undefined) {
	var _filters = {},
	    _table = {},
	    options  = {
	    	prefix: '',
	    	spaces: '  ',
	    	regex: {
	    		encode:  /<|>|"|&/g,
	    		decode:  /&(?:lt|gt|quot|amp);/g
	    	},
	    	map: {
	    		encode: {'<':'&lt;', '>':'&gt;', '"':'&quot;', '&':'&amp;'},
	    		decode: {'&lt;':'<', '&gt;':'>', '&quot;':'"', '&amp;':'&'}
	    	}
	    };

	function isArray(array) {
		return Object.prototype.toString.call(array) === '[object Array]';
	}

	function entities(string, type) {
		return string.replace(options.regex[type], function (match) {
			return options.map[type][match];
		});
	}

	function encode(string) {
		var characters = string.split(''),
		    encoded = [],
		    count = characters.length,
		    index = 0;

		for (; index < count;index += 1) {
			if (characters[index].charCodeAt(0) > 127) {
				encoded.push(characters[index]);
			} else {
				encoded.push(String.fromCharCode(characters[index].charCodeAt(0) + 0x2800));
			}
		}

		encoded = encoded.join('');
		_table[encoded] = string;
		return encoded;
	}

	function decode(string) {
		return _table[string] || '';
	}

	function wrap(string, klass) {
		return '\u00ab' + encode(klass)  + '\u00b7'
		                + encode(string) +
		       '\u00b7' + encode(klass)  + '\u00bb';
	}

	function unwrap(string) {
		return string.replace(/\u00ab(.+?)\u00b7(.+?)\u00b7\1\u00bb/g, function (_, name, value) {
			value = value.replace(/\u00ab[^\u00b7]+\u00b7/g, '').replace(/\u00b7[^\u00bb]+\u00bb/g, '');
			return span(decode(value), decode(name));
		});
	}

	function span(string, klass) {
		return '<span class="' + options.prefix + klass + '">' + entities(string, 'encode') + '</span>';
	}

	function filter(filters, string, escape) {
		var index = 0, count, filter;

		filters = isArray(filters) ? filters : [filters];
		for (count = filters.length; index < count; index += 1) {
			filter = _filters[filters[index]];

			if (filter) {
				string = string.replace(filter.regex, filter.callback);
			}
		}
		return escape === false ? string : unwrap(string);
	}

	function addFilter(name, regex, callback) {
		_filters[name] = {regex: regex, callback: callback};
	}

	// ! floodlight();

	window.floodlight = function (source) {
		return window.floodlight.html(source);
	};
	window.floodlight.options = options;
	window.floodlight.encode  = function (string) { return entities(string, 'encode'); };
	window.floodlight.decode  = function (string) { return entities(string, 'decode'); };

	addFilter('whitespace', (/\t/g), function () { return options.spaces; });

	// ! floodlight.javascript();

	window.floodlight.javascript = function (source) {
			return filter(window.floodlight.javascript.filters, source);
	};

	(function () {
		var key;

		this.keywords = ('var function if else for while break switch case do new null in with void '
		                +'continue delete return this true false throw catch typeof with instanceof').split(' ');
		this.special  = ('eval window document undefined NaN Infinity parseInt parseFloat '
		                +'encodeURI decodeURI encodeURIComponent decodeURIComponent').split(' ');
		this.regex = {
			'comment': (/(\/\/[^\n]*|\/\*(?:[^*\n]|\*+[^\/*])*\*+\/)/g),
		  'string':  (/("(?:(?!")[^\\\n]|\\.)*"|'(?:(?!')[^\\\n]|\\.)*')/g),
		  'regexp':  (/(\/.+\/[mgi]*)(?!\s*\w)/g),
		  'class':   (/\b([A-Z][a-zA-Z]+)\b/g),
		  'number':  (/\b([0-9]+(?:\.[0-9]+)?)\b/g),
		  'keyword': new(RegExp)('\\b(' + window.floodlight.javascript.keywords.join('|') + ')\\b', 'g'),
		  'special': new(RegExp)('\\b(' + window.floodlight.javascript.special.join('|')  + ')\\b', 'g')
		};

		this.filters = ['whitespace'];

		for (key in this.regex) {
			(function (regex, name, filters) {
				var namespace = 'javascript.' + name;

				addFilter(namespace, regex, function (match, capture) {
					return wrap(capture, 'javascript-' + name);
				});

				filters.push(namespace);
			})(window.floodlight.javascript.regex[key], key, this.filters);
		}
	}).call(window.floodlight.javascript);

	// ! floodlight.css();

	window.floodlight.css = function (source) {
		return filter(window.floodlight.css.filters, source);
	};

	(function () {
		
		var escape  = '/[0-9a-f]{1,6}(?:\\r\\n|[ \\n\\r\\t\\f])?|[^\\n\\r\\f0-9a-f]/',
		    nmstart = '[_a-z]|[^\\0-\\237]|(?:' + escape + ')',
		    nmchar  = '[_a-z0-9-]|[^\\0-\\237]|(?:' + escape + ')',
		    ident   = '[-]?(?:' + nmstart + ')(?:' + nmchar + ')*';
		
		this.regex = {
			rule: new RegExp('@' + ident, 'g'),
			selector: new RegExp(ident, 'g'),
			string: new RegExp('(?:"|\')(?:[^\\n\\r\\f\\1]|\\n\\\|\\r\\n|\\r|\\f|' + escape + ')*\\1', 'g'),
			number: /[0-9]+|[0-9]*\.[0-9]+/g,
			block: /\{([^\}]*)\}/g,
			declaration: new RegExp('(' + ident + ')[^:]*:[\\s\\n]*([^;]*);', 'g'),
			comment: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g
		};
		
		this.filters = ['css.comment', 'css.block'];
		
		
		addFilter('css.block', this.regex.block, function (_, contents) {
			var declarations = filter('css.declaration', contents, false);
			return _.replace(contents, declarations);
		});
		
		addFilter('css.declaration', this.regex.declaration, function (_, prop, value) {
			console.log("%o", value);
			var wrapped_value = filter(['css.string', 'css.number'], value, false);
			if (wrapped_value === value) {
				wrapped_value = wrap(value, 'css-value');
			}
			return _.replace(prop, wrap(prop, 'css-property')).replace(value, wrapped_value);
		});

		addFilter('css.string', this.regex.string, function (string) {
			console.log("'%o'", string);
			return wrap(string, 'css-string');
		});
		
		addFilter('css.number', this.regex.number, function (number) {
			return wrap(number, 'css-number');
		});

		addFilter('css.comment', this.regex.comment, function (comment) {
			return wrap(comment, 'css-comment');
		});
		
	}).call(window.floodlight.css);

	// ! floodlight.html();

	window.floodlight.html = function (source) {
		return filter(window.floodlight.html.filters, source);
	};

	(function () {

		this.regex = {
			tag:     (/(<\/?)(\w+)([^>]*)(\/?>)/g),
			attr:    (/(\w+)(?:\s*=\s*("[^"]*"|'[^']*'|[^>\s]+))?/g),
			comment: (/<!--[^\-]*-->/g),
			entity:  (/&[^;]+;/g),
			script:  (/<script[^>]*>([^<]*)<\/script>/gi)
		};

		this.filters = ['whitespace', 'html.script', 'html.comment', 'html.tag', 'html.entity'];

		addFilter('html.tag', this.regex.tag, function (match, open, tag, attr, close) {
			var attributes = filter('html.attr', attr, false);
			return wrap(open, 'html-bracket') + wrap(tag, 'html-tag') + attributes + wrap(close, 'html-bracket');
		});

		addFilter('html.attr', this.regex.attr, function (match, attr, value) {
			return wrap(attr, 'html-attribute') + (value ? '=' + wrap(value, 'html-value') : '');
		});

		addFilter('html.comment', this.regex.comment, function (comment) {
			return wrap(comment, 'html-comment');
		});

		addFilter('html.entity', this.regex.entity, function (entity) {
			return wrap(entity, 'html-entity');
		});

		addFilter('html.script', this.regex.script, function (match, source) {
			var js = filter(window.floodlight.javascript.filters, source, false);
			return match.replace(source, js);
		});

	}).call(window.floodlight.html);
})(this);
/*
 * Sniffer - sniffs web pages to extract information such as CMS, JavaScript libraries, font services, commenting systems, analytics packages, etc.
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
        test: /<style>[^\/]+body.hover/i
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
      'Google Analytics 1': [{ // 2005
        type: 'text',
        test: /<script [^>]+\/\/www\.google-analytics\.com\/urchin\.js/i
      },
      {
        type: 'custom',
        test: function() {
          return !!(win._uacct);
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
          return !!(win.ga);
        }
      }],
      'Google Analytics 3/GST': [{ // 2017
        type: 'text',
        test: /<script [^>]+\/\/www\.googletagmanager\.com\/gtag\/js\?id=UA-[A-Z0-9]{8}-[0-9]+/i // A property ID can have 25 view IDs
      },
      {
        type: 'custom',
        test: function() {
          return !!(win.gtag);
        }
      }],
      'Google Analytics 4': [{ // 2020
        type: 'text',
        test: /<script [^>]+\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]{10}/i
      },
      {
        type: 'custom',
        test: function() {
          return !!(win.gtag);
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
      'Statify': [{
        type: 'custom',
        test: function() {
          return !!win.statify_ajax;
        }
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
        if (meta.name.localeCompare(test.name, "en", { sensitivity: "base" }) === 0) {
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
// Snoopy - View-source and page info bookmarklet for mobile Safari-based browsers
// Written by Mark Perkins, mark@allmarkedup.com
// License: https://unlicense.org/ (i.e. do what you want with it!)

(function() {
  var isTouch = (function() {
    var ua = navigator.userAgent;
    return (ua.match(/iPhone/i) || ua.match(/iPod/i) || ua.match(/iPad/i) || ua.match(/Android/i)) ? true : false;
  })();

  var config = {
    NAME: 'Snoopy',
    VERSION: '0.7.3',
    URL: 'https://github.com/michaelnordmeyer/snoopy',
    CREATED: 'Created by <a href="http://allmarkedup.com/">Mark Perkins</a> and <a href="https://michaelnordmeyer.com/">Michael Nordmeyer</a>'
  };

  var snoopy = {
    element: null,
    modulesHtml: '',
    rawSource: '',
    generatedSource: '',

    init: function() {
      var self = this;

      this.sniff();
      this.getRawSource();
      this.getGeneratedSource();

      this.element = document.createElement('div');
      this.element.setAttribute('id', 'snpy');
      this.element.classList.add('cleanslate');
      this.element.innerHTML = this.createHtml();

      document.body.appendChild(this.element);

      this.markupLastDetectedModule();
      this.setMaxDimensions();
      this.bindEvents();
    },

    sniff: function() {
      const results = Sniffer.run();
      var output;

      for (group in results) {
        var groupHasPositives = false;
        output = '<h2>' + results[group].description + '</h2><ul class="tests">';

        for (test in results[group].results) {
          const result = results[group].results[test];
          output += '<li class="' + (result ? 'positive' : 'negative') + '">';
          output += '<span class="test-for">' + test + '</span>';
          output += '<span class="test-result ' + (result === true ? 'no-detail' : (!!result).toString()) + '">' + (result === true ? '-' : result.toString()) + '</span></li>';
          if (result) {
            groupHasPositives = true;
          }
        }

        output += '</ul>';
        this.modulesHtml += '<div class="module' + (groupHasPositives ? '' : ' no-detection') + ' type_' + group + ' output_' + results[group].return_type + '">' + output + '</div>';
      }
    },

    getRawSource: function() {
      var self = this;
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        self.rawSource = floodlight(floodlight.decode(this.response.trim()));
        // self.rawSource = this.response.trim();
        document.querySelector('#snpy-rawsource code').innerHTML = self.rawSource;
      };
      xhr.open('GET', location.href, true);
      xhr.send();
    },

    getGeneratedSource: function() {
      this.generatedSource = floodlight(floodlight.decode(document.documentElement.outerHTML.toString()));
      // this.generatedSource = document.documentElement.outerHTML.toString();
    },

    markupLastDetectedModule: function() {
      var self = this;
      const module = self.getLastDetectedModule();
      if (module) {
        module.style.cssText = 'margin-bottom: 0 !important;';
      }
    },

    getLastDetectedModule: function() {
      const modules = document.querySelectorAll('#snpy .module');
      for (index = modules.length - 1; index >= 0; index -= 1) {
        if (!modules[index].classList.contains('no-detection')) {
          return modules[index];
        }
      }
    },

    bindEvents: function() {
      var self = this;

      window.addEventListener('resize', function() {
        self.setMaxDimensions();
      });

      document.querySelector('#snpy .toggle-tests').addEventListener('click', function() {
        self.toggleTests();
      });

      document.querySelector('#snpy .close').addEventListener('click', function() {
        document.getElementById('snpy').classList.add('closed');
      });

      window.addEventListener('keydown', function(event) {
        switch(event.key) {
          case 'Escape':
            document.getElementById('snpy').classList.add('closed');
            break;
        }
      });

      const tabs = document.querySelectorAll('#snpy .tabs li');
      const panels = document.querySelectorAll('#snpy .panel');
      tabs.forEach(function(tab) {
        tab.addEventListener('click', function(e) {
          tabs.forEach(function(tab) {
            tab.classList.remove('active');
          });
          e.target.parentElement.classList.add('active');
          panels.forEach(function(panel) {
            panel.classList.remove('active');
          });
          document.querySelector(this.children[0].getAttribute('data-href')).classList.add('active');
        });
      });
    },

    setMaxDimensions: function() {
      this.element.style.maxHeight = window.innerHeight + 'px';

      const height = window.innerHeight - document.querySelector('#snpy .header').clientHeight - document.querySelector('#snpy .tabs').clientHeight - document.querySelector('#snpy .footer').clientHeight;
      const modulesHeight = height - 30; // Subtract padding
      const codeHeight = height - 40; // Subtract padding
      const maxModulesHeightCssText = "max-height: " + modulesHeight + "px !important;";
      const maxCodeHeightCssText = "max-height: " + codeHeight + "px !important;";
      document.querySelector('#snpy .modules').style.cssText = maxModulesHeightCssText;
      document.querySelectorAll('#snpy pre code').forEach(function(code) {
        code.style.cssText = maxCodeHeightCssText;
      });
    },

    toggleTests: function() {
      var self = this;

      document.querySelectorAll('#snpy .tests li.negative').forEach(function(test) {
        if (test.style.cssText) {
          test.style.cssText = '';
        } else {
          test.style.cssText = 'display: block !important;';
        }
      });

      var displayToggledOn = false;
      var displayToggledOff = false;
      document.querySelectorAll('#snpy .module.no-detection').forEach(function(moduleWithoutDetection) {
        if (moduleWithoutDetection.style.cssText) {
          moduleWithoutDetection.style.cssText = '';
          displayToggledOff = true;
        } else {
          moduleWithoutDetection.style.cssText = 'display: block !important;';
          displayToggledOn = true;
        }
      });

      if (displayToggledOn === true) {
        const module = self.getLastDetectedModule();
        if (module) {
          module.style.cssText = '';
        }
      }

      if (displayToggledOff === true) {
        self.markupLastDetectedModule();
      }
    },

    createHtml: function() {
      return `
<div class="header">
  <button class="close" title="Closes Snoopy" type="button"></button>
  <button class="toggle-tests" title="Toggles undetected items in Overview" type="button"></button>
  <h1><a href="${config.URL}">${config.NAME} ${config.VERSION}</a></h1>
</div>
<div class="body">
  <ul class="tabs">
    <li class="active"><button data-href="#snpy-overview">Overview</button></li>
    <li><button data-href="#snpy-rawsource">Source</a></li>
    <li><button data-href="#snpy-gensource">Generated Source</button></li>
  </ul>
  <div class="panels">
    <div id="snpy-overview" class="panel active">
      <div class="modules">${this.modulesHtml}</div>
    </div>
    <div id="snpy-rawsource" class="panel">
      <pre><code>Loading source code…</code></pre>
    </div>
    <div id="snpy-gensource" class="panel">
      <pre><code>${this.generatedSource}</code></pre>
    </div>
  </div>
</div>
<div class="footer">
  ${config.CREATED}
</div>`;
    }
  };

  snoopy.init();
})();

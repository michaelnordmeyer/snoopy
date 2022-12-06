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
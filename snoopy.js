
;(function( window, document, undefined ){

    var doc     = document,
        body    = doc.body,
        q_cache = {},
        isMobile = (function(){
            var ua = navigator.userAgent;
            return (ua.match(/iPhone/i) || ua.match(/iPod/i) || ua.match(/iPad/i)) ? true : false;
        })(),
        viewport = getViewportDimensions(),
        snoopy, modules, config, templates, snoopQuery;

    config = {
        NAME            : 'Snoopy',
        VERSION         : '0.3',
        START_OFFSET    : { top : '0', left : '0' }
    };

    snoopy = {

        elem            : null,
        modules_html    : '',
        raw_source      : '',
        gen_source      : '',
        bind_stack      : [],
        position        : config.START_OFFSET,

        init : function()
        {
            var self = this,
                el = this.elem = $('<div />'),
                snpy;

            el.attr('id', 'snpy').addClass('cleanslate');

            if ( isMobile ) el.addClass('MobileSafari');

            el.style('top', this.position.top, true);
            el.style('left', this.position.left, true);

            if ( viewport.width == 320 || viewport.width == 480 )
            {
                body.scrollTop = 0;
                hideURLBar();
            }

            this.runTests();
            this.getRawSource();
            this.getGeneratedSource();

            el.html(tim(templates.snoopy, {
                        name             : config.NAME,
                        modules          : this.modules_html,
                        version          : config.VERSION,
                        generated_source : this.gen_source
                    }));

            $(body).append(el);

            this.setMaxDimensions();
            this.bindEvents();
        },

        runTests : function()
        {
            var results = Sniffer.run(),
                output;

            for ( group in results )
            {
                var positive = 0;

                output = '<h2>'+results[group].description+'</h2><ul class="tests">';

                for ( test in results[group].results )
                {
                    var res = results[group].results[test];
                    output += '<li class="'+( res ? 'positive' : 'negative' )+'">';
                    output += '<span class="test_for">'+test+'</span>';
                    output += '<span class="test_result '+( res === true ? 'true_no_detail' : (!!res).toString() )+'">'+( res === true ? '-' : res.toString() )+'</span></li>';
                    if ( res ) positive++;
                }
                output += '</ul>';
                this.modules_html += '<div class="module'+( positive ? '' : ' empty' )+' type_'+group+' output_'+results[group].return_type+'">'+output+'</div>';
            }
        },

        getRawSource : function()
        {
            var self = this;
            ajax({
                type        : 'GET',
                url         : location.href,
                onSuccess   : function( data ){
                     self.raw_source = floodlight(floodlight.decode(data));
                     $('#snpy_rawsource code.html').html(self.raw_source);
                }
            });
        },

        getGeneratedSource : function()
        {
            this.gen_source = floodlight(floodlight.decode(doc.documentElement.innerHTML.toString()));
        },

        bindEvents : function( bindStack )
        {
            var self = this,
                el   = this.elem;

            //////////// general snoopy events ////////////

            $('#snpy .close').bind('click', function(){
                el.addClass('closed');
                return false;
            });

            $(window).bind('resize', function(){
                self.setMaxDimensions();
            });

            // tabs & panels

            var tabs = $('#snpy .menu li'),
                panels = $('#snpy .panel');

            tabs.each(function(){
                $(this).bind('click', function(e){
                    var self = $(this);
                    tabs.removeClass('active');
                    panels.removeClass('active');
                    self.addClass('active');
                    $($(e.target).attr('href')).addClass('active');
                    return false;
                 });
             });

            //////////// module-specific events ////////////

            for ( var d, i = -1; d = this.bind_stack[++i]; ) d();
        },

        setMaxDimensions : function()
        {
            viewport = getViewportDimensions();
            if ( isMobile ) this.elem.style('max-width', (viewport.width - parseInt(config.START_OFFSET.left)*2)+'px', true);
            // if it is a mobile-optimised site, don't try and fit the source size to screen as it won't work properly
            if ( viewport.width != 320 && viewport.width != 480 )
            {
                // TODO: really need to implement some proper browser capability and type detection instead of one-off tests like this
                $('#snpy pre.source').style('max-height', (viewport.height - 180 - parseInt(config.START_OFFSET.top)*2)+'px', true);
            }
            else if (viewport.width == 320)
            {
                $('#snpy pre.source').style('height', '300px', true);
            }
            else if (viewport.width == 480)
            {
                $('#snpy pre.source').style('height', '150px', true);
            }
        }

    };

    templates = {

        snoopy : "\
<div class=\"head\">\
    <a class=\"close\" href=\"#\">close</a>\
    <h1>{{name}}</h1>\
</div>\
<div class=\"body\">\
    <ul class=\"menu tabs\">\
        <li class=\"active\"><a href=\"#snpy_overview\">overview</a></li>\
        <li><a href=\"#snpy_rawsource\">view source</a></li>\
        <li><a href=\"#snpy_gensource\"><span class=\"no320\">view</span> generated source</a></li>\
    </ul>\
    <div class=\"panels\">\
        <div id=\"snpy_overview\" class=\"panel active\">{{modules}}</div>\
        <div id=\"snpy_rawsource\" class=\"panel\">\
<p class=\"tip MobileSafari\">Tip: Use a two fingered drag to scroll the code.</p>\
        <pre class=\"source raw\"><code class=\"html\">loading source code...</code></pre></div>\
        <div id=\"snpy_gensource\" class=\"panel\">\
<p class=\"tip MobileSafari\">Tip: Use a two fingered drag to scroll the code.</p>\
<pre class=\"source generated\"><code class=\"html\">{{generated_source}}</code></pre></div>\
    </div>\
</div>\
<div class=\"footer\">\
    <p><a href=\"https://github.com/allmarkedup/Snoopy\">Snoopy <span class=\"version\">v{{version}}</span></a>. Created by <a href=\"http://allmarkedup.com/\">Mark Perkins</a>.</p>\
</div>"

    };

    //////////// HELPER FUNCTIONS ////////////////

    /*
     * Sniffer - sniffs web pages to extract information such as JS libraries, CMS, analytics packages, etc.
     * Author: Mark Perkins, mark@allmarkedup.com
     */

    var Sniffer = (function( win, doc, undefined ){

        var sniff       = {},
            detect      = {},
            pageinfo    = {},
            test_runner = {},
            results     = {},
            indexed_results = {},
            scripts     = doc.getElementsByTagName("script"),
            metas       = doc.getElementsByTagName("meta"),
            html        = doc.documentElement.outerHTML || doc.documentElement.innerHTML,
            doctype     = doc.doctype,
            has_run     = false;

        // discard meta tags that aren't useful
        metas = (function(){
            for ( var meta, temp = [], i = -1; meta = metas[++i]; )
            {
                if ( meta.name && meta.content ) temp.push(meta);
            }
            return temp;
        })();

        // discard script tags that aren't useful
        scripts = (function(){
            for ( var script, temp = [], i = -1; script = scripts[++i]; )
            {
                if ( script.src ) temp.push(scripts);
            }
            return temp;
        })();

        /* page component detection tests */

        detect.pageinfo = {

            description : 'Page information',

            return_type : 'detail',

            tests : {

                'Doctype' : [
                    {
                        type : 'doctype', // source: https://www.w3.org/QA/2002/04/valid-dtd-list.html
                        test : {
                            'HTML5'                    : { name : 'html', publicId : '' },
                            'HTML 4.01 Strict'         : { name : 'html', publicId : '-//W3C//DTD HTML 4.01//EN' },
                            'HTML 4.01 Transitional'   : { name : 'html', publicId : '-//W3C//DTD HTML 4.01 Transitional//EN' },
                            'XHTML 1.0 Strict'         : { name : 'html', publicId : '-//W3C//DTD XHTML 1.0 Strict//EN' },
                            'XHTML 1.0 Transitional'   : { name : 'html', publicId : '-//W3C//DTD XHTML 1.0 Transitional//EN' },
                            'XHTML 1.0 Frameset'       : { name : 'html', publicId : '-//W3C//DTD XHTML 1.0 Frameset//EN' },
                            'XHTML 1.1'                : { name : 'html', publicId : '-//W3C//DTD XHTML 1.1//EN' },
                            'HTML 2.0'                 : { name : 'html', publicId : '-//IETF//DTD HTML 2.0//EN' },
                            'HTML 3.0'                 : { name : 'html', publicId : '-//W3C//DTD HTML 3.2 Final//EN' },
                            'XHTML 1.0 Basic'          : { name : 'html', publicId : '-//W3C//DTD XHTML Basic 1.0//EN' }
                        }
                    }
                ],
                'Charset' : [
                    {
                        type : 'custom',
                        test : function(){ return doc.characterSet || 'None detected'; }
                    }
                ]
            }

        };

        detect.js_libs = {

            description : 'JavaScript Libraries',

            return_type : 'version',

            // All individual tests should either return a version number, true or false.

            tests : {

                'jQuery' : [
                    {
                        type : 'custom',
                        test : function(){ return win.jQuery ? win.jQuery.fn.jquery : false; }
                    }
                ],
                'jQuery UI' : [
                    {
                        type : 'custom',
                        test : function(){ return win.jQuery && win.jQuery.ui ? win.jQuery.ui.version : false; }
                    }
                ],
                'Prototype' : [
                    {
                        type : 'custom',
                        test : function(){ return win.Prototype ? win.Prototype.Version : false; }
                    }
                ],
                'Scriptaculous' : [
                    {
                        type : 'custom',
                        test : function(){ return win.Scriptaculous ? win.Scriptaculous.Version : false; }
                    }
                ],
                'MooTools' : [
                    {
                        type : 'custom',
                        test : function(){ return win.MooTools ? win.MooTools.version : false; }
                    }
                ],
                'Glow' : [
                    {
                        type : 'custom',
                        test : function(){ return win.glow ? win.glow.VERSION : false; }
                    }
                ],
                'Dojo' : [
                    {
                        type : 'custom',
                        test : function(){ return win.dojo ? win.dojo.version.toString() : false; }
                    }
                ],
                'ExtJS' : [
                    {
                        type : 'custom',
                        test : function(){ return win.Ext ? win.Ext.version : false; }
                    }
                ],
                'YUI2' : [
                    {
                        type : 'custom',
                        test : function(){ return win.YAHOO ? win.YAHOO.VERSION : false; }
                    }
                ],
                'YUI3' : [
                    {
                        type : 'custom',
                        test : function(){ return win.YUI ? win.YUI.version : false; }
                    }
                ],
                'Google Closure' : [
                    {
                        type : 'custom',
                        test : function(){ return !! win.goog; } // need to figure out how to get Closure version
                    }
                ],
                'Modernizr' : [
                    {
                        type : 'custom',
                        test : function(){ return win.Modernizr ? win.Modernizr._version : false; }
                    }
                ],
                'Raphael' : [
                    {
                        type : 'custom',
                        test : function(){ return win.Raphael ? win.Raphael.version : false; }
                    }
                ]
            }
        };

        detect.cms = {

            description : 'Content Management System',

            return_type : 'version',

            tests : {

                'Wordpress' : [
                    {
                        type : 'meta',
                        test : { name : 'generator', match : /WordPress\s?([\w\d\.\-_]*)/i }
                    },
                    {
                        type : 'text',
                        test : /<link rel=["|']stylesheet["|'] [^>]+wp-content/i
                    }
                ],
                'Tumblr' : [
                    {
                        type : 'custom',
                        test : function(){ return win.Tumblr ? true : false; }
                    }
                ],
                'Squarespace' : [
                    {
                        type : 'custom',
                        test : function(){ return win.Squarespace ? true : false; }
                    }
                ],
                'Typepad' : [
                    {
                        type : 'meta',
                        test : { name : 'generator', match : /typepad\.com/i }
                    }
                ],
                'Joomla' : [
                    {
                        type : 'meta',
                        test : { name : 'generator', match : /joomla\!?\s?([\d.]*)/i }
                    }
                ],
                'Blogger' : [
                    {
                        type : 'meta',
                        test : { name : 'generator', match : /blogger/i }
                    }
                ],
                'MovableType' : [
                    {
                        type : 'meta',
                        test : { name : 'generator', match : /Movable Type Pro ([\d.]*)/i }
                    }
                ],
                'Drupal' : [
                    {
                        type : 'custom',
                        test : function() { return win.Drupal ? true : false; } // no version in js obj
                    }
                ],
                'Jekyll' : [
                    {
                        type : 'meta',
                        test : { name : 'generator', match : /Jekyll v([\w\d\.]*)/i }
                    }
                ],
                'Octopress' : [
                    {
                        type : 'meta',
                        test : { name : 'generator', match : /.*Octopress.*/i }
                    }
                ],
                'Cisco Eos' : [
                    {
                        type : 'custom',
                        test : function() { return win.eos ? true : false; } // no version in js obj
                    },
                    {
                        type : 'text',
                        test : /<link rel=["|']stylesheet["|'] [^>]+ciscoeos.com/i
                    }
                ]
            }

        };

        detect.analytics = {

            description : 'Analytics',

            return_type : 'version',

            tests : {

                'Google Analytics' : [
                    {
                        type : 'custom',
                        test : function(){ return !! (win._gat || win._gaq || win.ga); }
                    }
                ],
                'Reinvigorate' : [
                    {
                        type : 'custom',
                        test : function(){ return !! win.reinvigorate; }
                    }
                ],
                'Piwik' : [
                    {
                        type : 'custom',
                        test : function(){ return !! win._paq; }
                    }
                ],
                'Clicky' : [
                    {
                        type : 'custom',
                        test : function(){ return !! win.clicky; }
                    }
                ],
                'Open Web Analytics' : [
                    {
                        type : 'custom',
                        test : function() { return !! win.OWA; }
                    }
                ],
                'New Relic' : [
                    {
                        type : 'custom',
                        test : function() { return !! win.NREUMQ; }
                    }
                ],
                'Gauges' : [
                    {
                        type : 'custom',
                        test : function() { return !! win._gauges; }
                    }
                ],
                'WordPress Stats' : [
                    {
                        type : 'custom',
                        test : function() { return !! (win._tkq || win._stq); }
                    }
                ],
                'Mint' : [
                    {
                        type : 'custom',
                        test : function() { return !! win.Mint; }
                    }
                ]

            }

        };

        detect.fonts = {

            description : 'Fonts',

            return_type : 'version',

            tests : {

                'Cufon' : [
                    {
                        type : 'custom',
                        test : function(){ return !! win.Cufon }
                    }
                ],
                'Typekit' : [
                    {
                        type : 'custom',
                        test : function(){ return !! win.Typekit }
                    }
                ],
                'Fontdeck' : [
                    {
                        type : 'text',
                        test : /<link rel=["|']stylesheet["|'] [^>]+f.fontdeck.com/i
                    }
                ],
                'Google Webfonts' : [
                    {
                        type : 'custom',
                        test : function(){ return !! win.WebFont }
                    },
                    {
                        type : 'text',
                        test : /<link rel=["|']stylesheet["|'] [^>]+fonts.googleapis.com/i
                    }
                ],
                'sIFR' : [
                    {
                        type : 'custom',
                        test : function(){ return win.sIFR ? win.sIFR.VERSION : false }
                    }
                ]
            }

        };


        /* test runners */

        // custom tests just run a function that returns a version number, true or false.
        test_runner.custom = function( test )
        {
            return test();
        }

        // one off regexp-based tests
        test_runner.text = function( test )
        {
            return match( html, test );
        }

        if ( doctype )
        {
            test_runner.doctype = function( test )
            {
                for ( subtest in test )
                {
                    if ( test.hasOwnProperty(subtest) )
                    {
                        var t = test[subtest];

                        if ( doctype.name.toLowerCase() == t.name && doctype.publicId == t.publicId )
                        {
                            return subtest;
                        }
                    }
                }
                return false;
            }
        }
        else
        {
            test_runner.doctype = function(){
                return 'None detected';
            }
        }

        // check the script src... probably pretty unreliable
        if ( scripts.length )
        {
            test_runner.script = function( test )
            {
                for ( var script, i = -1; script = scripts[++i]; )
                {
                    return match( script.src, test );
                }
                return false;
            }
        }
        else
        {
            // no scripts, tests will always return false.
           test_runner.script = function(){ return false; }
        }

        // check the meta elements in the head
        if ( metas.length )
        {
            test_runner.meta = function( test )
            {
                for ( var meta, i = -1; meta = metas[++i]; )
                {
                    if ( meta.name == test.name )
                    {
                        var res = match( meta.content, test.match );
                        if ( res ) return res;
                    }
                }
                return false;
            }
        }
        else
        {
            // there are no meta elements on the page so this will always return false
            test_runner.meta = function(){ return false; }
        }

        // test arg should be a regexp, in which the only *specific* match is the version number
        function match( str, test )
        {
            var match = str.match(test);
            if ( match ) return match[1] && match[1] != '' ? match[1] : true; // return version number if poss or else true.
            return false;
        }

        /* main function responsible for running the tests */

        var run = function( tests_array )
        {
            for ( var check, i = -1; check = tests_array[++i]; )
            {
                var result = test_runner[check.type]( check.test );
                if ( result !== false ) return result;
            }
            return false;
        }

        var empty = function( obj )
        {
            for ( var name in obj ) return false;
            return true;
        }

        // utility function for iterating over the tests
        var forEachTest = function( callback )
        {
            for ( group in detect )
            {
                if ( detect.hasOwnProperty(group) )
                {
                    for ( test in detect[group].tests )
                    {
                        if ( detect[group].tests.hasOwnProperty(test) )
                        {
                            if ( callback( group, test ) === false ) return;
                        }
                    }
                }
            }
        }

        var addToResults = function( group, test, res )
        {
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
        sniff.results = function(){
            return results;
        };

        // perform an individual check
        sniff.check = function( to_test )
        {
            to_test = to_test.toLowerCase();
            if ( indexed_results[to_test] != undefined ) return indexed_results[to_test];
            else {

                forEachTest(function( group, test ){

                    if ( test.toLowerCase() === to_test )
                    {
                        addToResults( group, test, run( detect[group].tests[test] ) );
                        return false; // break out of forEachTest loop
                    }

                });
            }
            return indexed_results[to_test];
        };

        // run or re-run all checks
        sniff.run = function()
        {
            forEachTest(function( group, test ){

                addToResults( group, test, run( detect[group].tests[test] ) );

            });

            return sniff.results();
        };

        return sniff;

    })( window, document );

	/*!
	* Tim (lite)
	*   github.com/premasagar/tim
	*
	*//*
	    A tiny, secure JavaScript micro-templating script.
	*//*

	    by Premasagar Rose
	        dharmafly.com

	    license
	        opensource.org/licenses/mit-license.php

	    **

	    creates global object
	        tim

	    **

	    v0.3.0

	*/

	(function(name, definition, context) {
	    if (typeof module != 'undefined' && module.exports) {
	        module.exports = definition();
	    } else if (typeof context['define'] == 'function' && context['define']['amd']) {
	        define(definition);
	    } else {
	        context[name] = definition();
	    }
	})('tim', function() {

	    var tim = (function(){
	        "use strict";

	        var start   = "{{",
	            end     = "}}",
	            path    = "[a-z0-9_$][\\.a-z0-9_]*", // e.g. config.person.name
	            pattern = new RegExp(start + "\\s*("+ path +")\\s*" + end, "gi"),
	            undef;

	        return function(template, data){
	            // Merge data into the template string
	            return template.replace(pattern, function(tag, token){
	                var path = token.split("."),
	                    len = path.length,
	                    lookup = data,
	                    i = 0;

	                for (; i < len; i++){
	                    lookup = lookup[path[i]];

	                    // Property not found
	                    if (lookup === undef){
	                        throw "tim: '" + path[i] + "' not found in " + tag;
	                    }

	                    // Return the required value
	                    if (i === len - 1){
	                        return lookup;
	                    }
	                }
	            });
	        };
	    }());

	    return tim;

	}, this);

   /*  Floodlight (X)HTML Syntax Highlighter - v0.2
    *  Copyright 2010, Aron Carroll
    *  Released under the MIT license
    *  More Information: http://github.com/aron/floodlight.js
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
    * 'snoopQuery' - mini jQuery-style DOM helper functions.
    * Only intended to work in newer browsers (eg. with querySelectorAll support),
    * VERY limited, not intended for extraction, only useful in a Snoopy-specific context
    * Methods should be ab API match for jQuery so that it could be dropped in as a replacement if necessary later on.
    */
   snoopQuery = function( selector )
   {
       return new snoopQuery.fn.init(selector);
   }

   snoopQuery.fn = snoopQuery.prototype = {

       length : 0,
       selector : '',

       init : function( selector )
       {
           var elem,
               tagExp = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
               match;

           if ( ! selector ) return this;

           if ( selector.nodeType )
           {
               this[0] = selector;
               this.length = 1;
               return this;
           }

           if ( selector === window )
           {
              this[0] = selector;
              this.length = 1;
              return this;
           }

           match = tagExp.exec(selector);

           if ( match )
           {
               // deal with very basic element creation here
               selector = [doc.createElement(match[1])];
               merge( this, selector );
               return this;
           }
           else if ( /^#[\w+]$/.test( selector ) )
           {
               // ID
               elem = doc.getElementById(selector);
               if ( elem )
               {
                   this.length = 1;
                   this[0] = elem;
               }
               this.selector = selector;
               this.context = document;
               return this;
           }
           else if ( /^\w+$/.test( selector ) )
           {
               // TAG
               this.selector = selector;
               this.context = document;
               selector = document.getElementsByTagName( selector );
               return merge( this, selector );
           }
           else if ( typeof selector === 'string' )
           {
               // else use generic querySelectorAll
               this.selector = selector;
               this.context = document;
               selector = document.querySelectorAll( selector );
               return merge( this, selector );
           }

           if (selector.selector !== undefined)
           {
               this.selector = selector.selector;
               this.context = selector.context;
           }

           return merge( selector, this );
       },

       // internal iterator
       each : function( callback )
       {
           var i = 0,
               length = this.length;

           for ( var value = this[0]; i < length && callback.call( value, i, value ) !== false; value = this[++i] ) {}
       },

       // very simple event binding function
       bind : function( event, callback )
       {
           for ( var i = 0, l = this.length; i < l; i++ )
           {
               this[i].addEventListener( event, function(e){
                   if ( callback.call(this, e) === false )
                   {
                       e.preventDefault();
                       e.stopPropagation();
                   }
               }, false );
           }
           return this;
       },

       addClass : function( value )
       {
           var cn = (value || '').split(/\s/);
           this.each(function(){
               for ( var i = 0, l = cn.length; i < l;  i++ )
               {
                   if ( ! snoopQuery(this).hasClass( cn[i] ) ) this.className += this.className ? ' '+cn[i] : cn[i];
               }
           });
           return this;
       },

       removeClass : function( value )
       {
           var cn = (value || '').split(/\s/);

           this.each(function(){
               for ( var i = 0, l = cn.length; i < l;  i++ )
               {
                   this.className = trim(this.className.replace( this.className.match(' '+cn[i]) ? ' '+ cn[i] : cn[i], '' ));
               }
           });
           return this;
       },

       hasClass : function( value )
       {
           return this[0] ? new RegExp('\\b'+value+'\\b').test(this[0].className) : false;
       },

       // get/set attributes

       attr : function( key, val )
       {
           if ( val !== undefined )
           {
               this.each(function(){
                   this.setAttribute( key, val );
               });
               return this;
           }
           else
           {
               return this[0] ? this[0].getAttribute( key ) : null;
           }
       },

       // VERY basic HTML function, no cleanup or anything yet.
       html : function( html )
       {
           if ( html !== undefined )
           {
               this.each(function(){
                   this.innerHTML = html;
               });
               return this;
           }
           return this[0] ? this[0].innerHTML : null;
       },

       // DOM insertion methods

       append : function( elem )
       {
           if ( elem !== undefined )
           {
               elem = elem[0] ? elem[0] : elem;
               this.each(function(){
                   this.appendChild(elem);
               });
               return this;
           }
       }

   };

   snoopQuery.fn.init.prototype = snoopQuery.fn;
   $ = snoopQuery;

   ////// snoopQuery methods that don't match the jQuery API are implemented as jQuery compatible plugins /////

   // add important styles inline
   (function() {

       var styles_regexp = /([\w-]+)\s*:\s*([^;!]+)\s?(!\s?important?)?\s?[;|$]?/i;

       $.fn.style = function( prop, val, important )
       {
           if ( val !== undefined )
           {
               // setting a value
               important = important || false;
               return this.each(function(){

                   var dconst_rules = [];

                   var self = $(this);
                   split(dconst_rules, self.attr('style')); // split up the rules
                   set(dconst_rules, prop, val, important);
                   self.attr('style', combine(dconst_rules) );
               });
           }
           else
           {
               // getting a value
               var self = $(this[0]),
                   dconst_rules = [];

               split(dconst_rules, self.attr('style')); // split up the rules
               return get(dconst_rules, prop);
           }
       }

       function get( dconst_rules, prop )
       {
           for ( var rule, i = -1; rule = dconst_rules[++i]; )
           {
               if ( prop === rule.prop ) return rule.val;
           }
           return null;
       }

       function set( dconst_rules, prop, val, important )
       {
           prop = trim(prop);

           for ( var rule, i = -1; rule = dconst_rules[++i]; )
           {
               if ( prop === rule.prop )
               {
                   dconst_rules[i].val = val;
                   dconst_rules[i].important = important;
                   return;
               }
           }
           dconst_rules.push({ prop : prop, val : val, important : important });
       }

       function combine( dconst_rules )
       {
           var rule_string = '';
           for ( var rule, i = -1; rule = dconst_rules[++i]; )
           {
               rule_string += rule.prop + ' : '+ rule.val;
               if ( rule.important ) rule_string += ' !important';
               rule_string += ';';
           }
           return rule_string;
       }

       function split( dconst_rules, rule_string )
       {
           if ( typeof rule_string === 'string' )
           {
               var rules = rule_string.split(/;/);

               for ( i= 0, l = rules.length; i < l; i++ )
               {
                   var r = trim(rules[i]);
                   if ( r !== '' )
                   {
                       var match = r.match(styles_regexp);
                       dconst_rules.push({ prop : trim(match[1]), val : trim(match[2]), important : !! match[3] });
                   }
               }
           }
       }

   })();

   //// Ajax Helper functions //////

   // Generic ajax helper functions. Could probably be cut down if the only use case turns out
   // to be for returning the source of the current page (i.e. remove type tests from ajaxData etc)
   function ajax( options )
   {
       options = {
           type        : options.type          || 'GET',
           url         : options.url           || '',
           timeout     : options.timeout       || 5000,
           onComplete  : options.onComplete    || function(){},
           onError     : options.onError       || function(){},
           onSuccess   : options.onSuccess     || function(){},
           data        : options.data          || ''
       }

       var r    = new XMLHttpRequest(),
           done = false;

       r.open(options.type, options.url, true);

       setTimeout(function(){
           done = true;
       }, options.timeout);

       r.onreadystatechange = function()
       {
           if ( r.readyState == 4 && ! done )
           {
               if ( ajaxSuccess( r ) )
               {
                   options.onSuccess( ajaxData( r, options.type ) );
               }
               else
               {
                   options.onError();
               }

               options.onComplete();

               r = null;
           }
       }

       r.send();
   }

   function ajaxSuccess( r )
   {
       try {
           return ! r.status && location.protocol == "file:" ||
               ( r.status >= 200 && r.status < 300 ) ||
               r.status == 304 ||
               navigator.userAgent.indexOf("Safari") >= 0 && typeof r.status == 'undefined';
               // could take out safari check here but better to keep it cross browser I think.
       } catch(e) {}
       return false;
   }

   function ajaxData( r, type )
   {
       var ct = r.getResponseHeader('content-type'),
           data = ! type && ct && ct.indexOf('xml') >= 0;

       data = type == 'xml' || data ? r.responseXML : r.responseText;
       if ( type == 'script' ) eval.call(window, data);
       return data;
   }

   function getViewportDimensions()
   {
       return {
           width: window.innerWidth,
           height: window.innerHeight
       }
   }

   function prepSource( source )
   {
       return source.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');
   }

   function trim(str)
   {
       return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
   }

   function isArray( obj )
   {
       return toString.call(obj) === "[object Array]";
   }

   // merge two arrays
   function merge( first, second )
   {
       var i = first.length,
           j = 0;

       if ( typeof second.length === "number" )
       {
           for ( var l = second.length; j < l; j++ )
           {
               first[i++] = second[j];
           }
       }
       else
       {
           while ( second[j] !== undefined )
           {
               first[i++] = second[j++];
           }
       }

       first.length = i;

       return first;
   }

   /// some iphone/ipod/ipad specific helpers

   function hideURLBar()
   {
       setTimeout(function() {
           window.scrollTo(0, 1);
       }, 0);
   }

    snoopy.init(); /* kick things off... */

})( window, document );
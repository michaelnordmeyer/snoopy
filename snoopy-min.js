!function(t,e){var s={},n={},r={prefix:"",spaces:"  ",regex:{encode:/<|>|"|&/g,decode:/&(?:lt|gt|quot|amp);/g},map:{encode:{"<":"&lt;",">":"&gt;",'"':"&quot;","&":"&amp;"},decode:{"&lt;":"<","&gt;":">","&quot;":'"',"&amp;":"&"}}};function i(t,e){return t.replace(r.regex[e],function(t){return r.map[e][t]})}function o(t){for(var e=t.split(""),s=[],r=e.length,i=0;i<r;i+=1)e[i].charCodeAt(0)>127?s.push(e[i]):s.push(String.fromCharCode(e[i].charCodeAt(0)+10240));return n[s=s.join("")]=t,s}function c(t){return n[t]||""}function a(t,e){return"\xab"+o(e)+"\xb7"+o(t)+"\xb7"+o(e)+"\xbb"}function u(t,e,n){var o,a,u,l,p=0;for(l=t,a=(t="[object Array]"===Object.prototype.toString.call(l)?t:[t]).length;p<a;p+=1)(u=s[t[p]])&&(e=e.replace(u.regex,u.callback));return!1===n?e:(o=e).replace(/\u00ab(.+?)\u00b7(.+?)\u00b7\1\u00bb/g,function(t,e,s){var n,o;return n=c(s=s.replace(/\u00ab[^\u00b7]+\u00b7/g,"").replace(/\u00b7[^\u00bb]+\u00bb/g,"")),o=c(e),'<span class="'+r.prefix+o+'">'+i(n,"encode")+"</span>"})}function l(t,e,n){s[t]={regex:e,callback:n}}t.floodlight=function(e){return t.floodlight.html(e)},t.floodlight.options=r,t.floodlight.encode=function(t){return i(t,"encode")},t.floodlight.decode=function(t){return i(t,"decode")},l("whitespace",/\t/g,function(){return r.spaces}),t.floodlight.javascript=function(e){return u(t.floodlight.javascript.filters,e)},(function(){var e;for(e in this.keywords="var function if else for while break switch case do new null in with void continue delete return this true false throw catch typeof with instanceof".split(" "),this.special="eval window document undefined NaN Infinity parseInt parseFloat encodeURI decodeURI encodeURIComponent decodeURIComponent".split(" "),this.regex={comment:/(\/\/[^\n]*|\/\*(?:[^*\n]|\*+[^\/*])*\*+\/)/g,string:/("(?:(?!")[^\\\n]|\\.)*"|'(?:(?!')[^\\\n]|\\.)*')/g,regexp:/(\/.+\/[mgi]*)(?!\s*\w)/g,class:/\b([A-Z][a-zA-Z]+)\b/g,number:/\b([0-9]+(?:\.[0-9]+)?)\b/g,keyword:RegExp("\\b("+t.floodlight.javascript.keywords.join("|")+")\\b","g"),special:RegExp("\\b("+t.floodlight.javascript.special.join("|")+")\\b","g")},this.filters=["whitespace"],this.regex)!function(t,e,s){var n="javascript."+e;l(n,t,function(t,s){return a(s,"javascript-"+e)}),s.push(n)}(t.floodlight.javascript.regex[e],e,this.filters)}).call(t.floodlight.javascript),t.floodlight.css=function(e){return u(t.floodlight.css.filters,e)},(function(){var t="/[0-9a-f]{1,6}(?:\\r\\n|[ \\n\\r\\t\\f])?|[^\\n\\r\\f0-9a-f]/",e="[-]?(?:[_a-z]|[^\\0-\\237]|(?:"+t+"))(?:[_a-z0-9-]|[^\\0-\\237]|(?:"+t+"))*";this.regex={rule:RegExp("@"+e,"g"),selector:RegExp(e,"g"),string:RegExp("(?:\"|')(?:[^\\n\\r\\f\\1]|\\n\\|\\r\\n|\\r|\\f|"+t+")*\\1","g"),number:/[0-9]+|[0-9]*\.[0-9]+/g,block:/\{([^\}]*)\}/g,declaration:RegExp("("+e+")[^:]*:[\\s\\n]*([^;]*);","g"),comment:/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g},this.filters=["css.comment","css.block"],l("css.block",this.regex.block,function(t,e){var s=u("css.declaration",e,!1);return t.replace(e,s)}),l("css.declaration",this.regex.declaration,function(t,e,s){console.log("%o",s);var n=u(["css.string","css.number"],s,!1);return n===s&&(n=a(s,"css-value")),t.replace(e,a(e,"css-property")).replace(s,n)}),l("css.string",this.regex.string,function(t){return console.log("'%o'",t),a(t,"css-string")}),l("css.number",this.regex.number,function(t){return a(t,"css-number")}),l("css.comment",this.regex.comment,function(t){return a(t,"css-comment")})}).call(t.floodlight.css),t.floodlight.html=function(e){return u(t.floodlight.html.filters,e)},(function(){this.regex={tag:/(<\/?)(\w+)([^>]*)(\/?>)/g,attr:/(\w+)(?:\s*=\s*("[^"]*"|'[^']*'|[^>\s]+))?/g,comment:/<!--[^\-]*-->/g,entity:/&[^;]+;/g,script:/<script[^>]*>([^<]*)<\/script>/gi},this.filters=["whitespace","html.script","html.comment","html.tag","html.entity"],l("html.tag",this.regex.tag,function(t,e,s,n,r){var i=u("html.attr",n,!1);return a(e,"html-bracket")+a(s,"html-tag")+i+a(r,"html-bracket")}),l("html.attr",this.regex.attr,function(t,e,s){return a(e,"html-attribute")+(s?"="+a(s,"html-value"):"")}),l("html.comment",this.regex.comment,function(t){return a(t,"html-comment")}),l("html.entity",this.regex.entity,function(t){return a(t,"html-entity")}),l("html.script",this.regex.script,function(e,s){var n=u(t.floodlight.javascript.filters,s,!1);return e.replace(s,n)})}).call(t.floodlight.html)}(this);var Sniffer=function(t,e,s){var n={},r={},i={},o={},c={},a=e.getElementsByTagName("script"),u=e.getElementsByTagName("meta"),l=e.documentElement.outerHTML||e.documentElement.innerHTML,p=e.doctype;function m(t,e){var s=t.match(e);return!!s&&(!s[1]||""==s[1]||s[1])}u=function(){for(var t,e=[],s=-1;t=u[++s];)t.name&&t.content&&e.push(t);return e}(),a=function(){for(var t,e=[],s=-1;t=a[++s];)t.src&&e.push(a);return e}(),r.pageinfo={description:"Page Information",return_type:"detail",tests:{Doctype:[{type:"doctype",test:{HTML5:{name:"html",publicId:""},"HTML 4.01 Strict":{name:"html",publicId:"-//W3C//DTD HTML 4.01//EN"},"HTML 4.01 Transitional":{name:"html",publicId:"-//W3C//DTD HTML 4.01 Transitional//EN"},"HTML 3.0":{name:"html",publicId:"-//W3C//DTD HTML 3.2 Final//EN"},"HTML 2.0":{name:"html",publicId:"-//IETF//DTD HTML 2.0//EN"},"XHTML 1.1":{name:"html",publicId:"-//W3C//DTD XHTML 1.1//EN"},"XHTML 1.0 Strict":{name:"html",publicId:"-//W3C//DTD XHTML 1.0 Strict//EN"},"XHTML 1.0 Transitional":{name:"html",publicId:"-//W3C//DTD XHTML 1.0 Transitional//EN"},"XHTML 1.0 Frameset":{name:"html",publicId:"-//W3C//DTD XHTML 1.0 Frameset//EN"},"XHTML 1.0 Basic":{name:"html",publicId:"-//W3C//DTD XHTML Basic 1.0//EN"}}}],Charset:[{type:"custom",test:function(){return e.characterSet||"None detected"}}]}},r.js_libs={description:"JavaScript Libraries",return_type:"version",tests:{Dojo:[{type:"custom",test:function(){return!!t.dojo&&t.dojo.version.toString()}}],ExtJS:[{type:"custom",test:function(){return!!t.Ext&&t.Ext.version}}],Glow:[{type:"custom",test:function(){return!!t.glow&&t.glow.VERSION}}],"Google Closure":[{type:"custom",test:function(){return!!t.goog}}],jQuery:[{type:"custom",test:function(){return!!t.jQuery&&t.jQuery.fn.jquery}}],"jQuery Mobile":[{type:"custom",test:function(){return!!t.jQuery&&!!t.jQuery.mobile&&t.jQuery.mobile.version}}],"jQuery UI":[{type:"custom",test:function(){return!!t.jQuery&&!!t.jQuery.ui&&t.jQuery.ui.version}}],Modernizr:[{type:"custom",test:function(){return!!t.Modernizr&&t.Modernizr._version}}],MooTools:[{type:"custom",test:function(){return!!t.MooTools&&t.MooTools.version}}],Prototype:[{type:"custom",test:function(){return!!t.Prototype&&t.Prototype.Version}}],Scriptaculous:[{type:"custom",test:function(){return!!t.Scriptaculous&&t.Scriptaculous.Version}}],YUI2:[{type:"custom",test:function(){return!!t.YAHOO&&t.YAHOO.VERSION}}],YUI3:[{type:"custom",test:function(){return!!t.YUI&&t.YUI.version}}]}},r.cms={description:"Content Management System",return_type:"version",tests:{Blogger:[{type:"meta",test:{name:"generator",match:/blogger/i}}],Drupal:[{type:"custom",test:function(){return!!t.Drupal}}],Ghost:[{type:"meta",test:{name:"generator",match:/Ghost\s?([\w\d\.\-_]*)/i}},{type:"custom",test:function(){return!!t.ghost}}],Jekyll:[{type:"meta",test:{name:"generator",match:/Jekyll v([\w\d\.]*)/i}}],Jimdo:[{type:"custom",test:function(){return!!t.jimdoData}}],Joomla:[{type:"meta",test:{name:"generator",match:/joomla\!?\s?([\d.]*)/i}}],Medium:[{type:"custom",test:function(){return!!t.__GRAPHQL_URI__}}],MovableType:[{type:"meta",test:{name:"generator",match:/Movable Type Pro ([\d.]*)/i}},{type:"custom",test:function(){return!!t.MT}}],Octopress:[{type:"meta",test:{name:"generator",match:/.*Octopress.*/i}}],Squarespace:[{type:"custom",test:function(){return!!t.Squarespace}}],Tumblr:[{type:"custom",test:function(){return!!t.Tumblr}}],Typepad:[{type:"meta",test:{name:"generator",match:/typepad\.com/i}}],Typo3:[{type:"meta",test:{name:"generator",match:/Typo3 CMS/i}}],Weebly:[{type:"custom",test:function(){return!!t.Weebly}}],Wix:[{type:"custom",test:function(){return!!t.wixDeveloperAnalytics||!!t.wixEmbedsAPI||!!t.wixPerformanceMeasurements||!!t.wixTagManager}}],WordPress:[{type:"meta",test:{name:"generator",match:/WordPress\s?([\w\d\.\-_]*)/i}},{type:"text",test:/<link [^>]+wp-content/i}]}},r.analytics={description:"Analytics",return_type:"version",tests:{Ackee:[{type:"text",test:/<script [^>]+\/\/a\.electerious\.com\/_\.js/i},{type:"custom",test:function(){return!!t.ackeeTracker}}],Cabin:[{type:"text",test:/<script [^>]+\/\/scripts\.withcabin\.com\/hello\.js/i},{type:"custom",test:function(){return!!t.cabin}}],Chartbeat:[{type:"text",test:/<script [^>]+\/\/static\.chartbeat\.com\/js\/chartbeat\.js/i},{type:"custom",test:function(){return!!(t._cb_shared||t._sf_async_config)}}],Clicky:[{type:"text",test:/<script [^>]+\/\/static\.getclicky\.com\/js/i},{type:"custom",test:function(){return!!t.clicky}}],"Cloudflare Insights":[{type:"text",test:/<script [^>]+\/\/static\.cloudflareinsights\.com\/beacon\.min\.js/i}],Fathom:[{type:"text",test:/<script [^>]+\/\/cdn\.usefathom\.com\/script\.js/i},{type:"custom",test:function(){return!!t.fathom}}],Gauges:[{type:"text",test:/<script [^>]+\/\/secure\.gaug\.es\/track\.js/i}],GoatCounter:[{type:"text",test:/<script [^>]+\/\/gc\.zgo\.at\/count\.js/i},{type:"custom",test:function(){return!!t.goatcounter}}],"Google Analytics (Urchin)":[{type:"text",test:/<script [^>]+\/\/www\.google-analytics\.com\/urchin\.js/i},{type:"custom",test:function(){return!!t._uacct}}],"Google Analytics (GA2)":[{type:"text",test:/<script [^>]+\/\/ssl\.google-analytics\.com\/ga\.js/i},{type:"text",test:/<script [^>]+\/\/www\.google-analytics\.com\/ga\.js/i},{type:"custom",test:function(){return!!(t._gaq||t._gat)}}],"Google Analytics (GA3)":[{type:"text",test:/<script [^>]+\/\/www\.google-analytics\.com\/analytics\.js/i},{type:"custom",test:function(){return!!t.ga}}],"Google Analytics (GA3 GST)":[{type:"text",test:/<script [^>]+\/\/www\.googletagmanager\.com\/gtag\/js\?id=UA-[A-Z0-9]{8}-[0-9]+/i},{type:"custom",test:function(){return!!t.gtag}}],"Google Analytics (GA4)":[{type:"text",test:/<script [^>]+\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]{10}/i},{type:"custom",test:function(){return!!t.gtag}}],"Google Tag Manager":[{type:"text",test:/<script [^>]+\/\/www\.googletagmanager\.com\/gtm\.js\?id=GTM-[A-Z0-9]{6,13}/i},{type:"text",test:/<iframe [^>]+\/\/www\.googletagmanager\.com\/ns\.html\?id=GTM-[A-Z0-9]{6,13}/i}],"Koko Analytics":[{type:"text",test:/<script [^>]+\/\/.+\/plugins\/koko-analytics\/assets\/dist\/js\/script\.js/i},{type:"text",test:/<script [^>]+\/\/.+\/plugins\/koko-analytics-pro\/assets\/dist\/js\/script\.js/i},{type:"custom",test:function(){return!!t.koko_analytics}}],Matomo:[{type:"text",test:/<script [^>]+\/\/.+\/matomo\.js/i},{type:"text",test:/<script [^>]+\/\/.+\/piwik\.js/i},{type:"custom",test:function(){return!!(t._paq||t.Matomo||t.Piwik)}}],Microanalytics:[{type:"text",test:/<script [^>]+\/\/microanalytics\.io\/js\/script\.js/i}],"New Relic":[{type:"custom",test:function(){return!!(t.NREUMQ||t.NREUM)}}],"Open Web Analytics":[{type:"text",test:/<script [^>]+\/\/.+\/modules\/base\/js\/owa\.tracker-combined-min\.js/i},{type:"custom",test:function(){return!!(t.OWA||t.owa_baseUrl)}}],Pirsch:[{type:"text",test:/<script [^>]+\/\/api\.pirsch\.io\/pirsch\.js/i},{type:"text",test:/<script [^>]+\/\/api\.pirsch\.io\/pirsch-extended\.js/i},{type:"text",test:/<script [^>]+\/\/api\.pirsch\.io\/pirsch-events\.js/i},{type:"text",test:/<script [^>]+\/\/api\.pirsch\.io\/pirsch-sessions\.js/i}],Plausible:[{type:"text",test:/<script [^>]+\/\/plausible\.io\/js\/script\.js/i},{type:"custom",test:function(){return!!t.plausible}}],Reinvigorate:[{type:"custom",test:function(){return!!t.reinvigorate}}],"Simple Analytics":[{type:"text",test:/<script [^>]+\/\/scripts\.simpleanalyticscdn\.com\/latest\.js/i}],"Slimstat Analytics":[{type:"text",test:/<script [^>]+\/\/cdn\.jsdelivr\.net\/wp\/wp-slimstat\/tags\/.+\/wp-slimstat\.min\.js/i},{type:"custom",test:function(){return!!t.SlimStatParams}}],Statcounter:[{type:"text",test:/<script [^>]+\/\/secure\.statcounter\.com\/counter\/counter\.js/i}],TinyAnalytics:[{type:"text",test:/<script [^>]+\/\/cdn\.segment\.com\/analytics\.js\/v1\/.+\/analytics\.min\.js/i},{type:"custom",test:function(){return!!window.tinyanalytics}},{type:"custom",test:function(){return!!window.AnalyticsNext}}],Umami:[{type:"text",test:/<script [^>]+\/\/umami\.is\/a\/script\.js/i},{type:"custom",test:function(){return!!t.umami}}],W3Counter:[{type:"text",test:/<script [^>]+\/\/www\.w3counter\.com\/tracker\.js\?id=.+/i},{type:"custom",test:function(){return!!t._w3counter}}],Webtrends:[{type:"text",test:/<script [^>]+\/\/s\.webtrends\.com\/js\/webtrends\.js/i},{type:"custom",test:function(){return!!t.Webtrends}}],Woopra:[{type:"custom",test:function(){return!!t.woopra}}],"WordPress Stats":[{type:"text",test:/<script [^>]+\/\/stats\.wp\.com\/w\.js/i},{type:"text",test:/<script [^>]+\/\/stats\.wp\.com\/e-.+\.js/i},{type:"custom",test:function(){return!!(t._tkq||t._stq)}}]}},r.fonts={description:"Fonts",return_type:"version",tests:{"Adobe Fonts":[{type:"custom",test:function(){return!!t.Typekit}}],Cufon:[{type:"custom",test:function(){return!!t.Cufon}}],"Google Fonts":[{type:"custom",test:function(){return!!t.WebFont}},{type:"text",test:/<link [^>]+fonts\.googleapis\.com/i}],sIFR:[{type:"custom",test:function(){return!!t.sIFR}}]}},r.comments={description:"Comments",return_type:"version",tests:{"Cactus Comments":[{type:"text",test:/<script [^>]+\/\/latest\.cactus\.chat\/cactus\.js/i}],Discourse:[{type:"custom",test:function(){return!!t.DiscourseEmbed}}],Disqus:[{type:"custom",test:function(){return!!t.disqus_identifier}}],Giscus:[{type:"text",test:/<iframe [^>]+giscus-frame/i}],Isso:[{type:"text",test:/<section [^>]+isso-thread/i}],Utterances:[{type:"text",test:/<iframe [^>]+utterances-frame/i}]}},i.custom=function(t){return t()},i.text=function(t){return m(l,t)},p?i.doctype=function(t){for(subtest in t)if(t.hasOwnProperty(subtest)){var e=t[subtest];if(p.name.toLowerCase()==e.name&&p.publicId==e.publicId)return subtest}return!1}:i.doctype=function(){return"None detected"},a.length?i.script=function(t){for(var e,s=-1;e=a[++s];)return m(e.src,t);return!1}:i.script=function(){return!1},u.length?i.meta=function(t){for(var e,s=-1;e=u[++s];)if(e.name==t.name){var n=m(e.content,t.match);if(n)return n}return!1}:i.meta=function(){return!1};var y=function(t){for(var e,s=-1;e=t[++s];){var n=i[e.type](e.test);if(!1!==n)return n}return!1},d=function(t){for(group in r)if(r.hasOwnProperty(group)){for(test in r[group].tests)if(r[group].tests.hasOwnProperty(test)&&!1===t(group,test))return}},f=function(t,e,s){o[t]=o[t]||{},o[t].results=o[t].results||{},o[t].description=r[t].description,o[t].return_type=r[t].return_type,o[t].results[e]=s,c[e.toLowerCase()]=s};return n.results=function(){return o},n.check=function(t){return void 0!=c[t=t.toLowerCase()]||d(function(e,s){if(s.toLowerCase()===t)return f(e,s,y(r[e].tests[s])),!1}),c[t]},n.run=function(){return d(function(t,e){f(t,e,y(r[t].tests[e]))}),n.results()},n}(window,document);!function(){(t=navigator.userAgent).match(/iPhone/i)||t.match(/iPod/i)||t.match(/iPad/i)||t.match(/Android/i);var t,e={NAME:"Snoopy",VERSION:"0.5.3",URL:"https://github.com/michaelnordmeyer/snoopy",CREATED:'Created by <a href="http://allmarkedup.com/">Mark Perkins</a> and <a href="https://michaelnordmeyer.com/">Michael Nordmeyer</a>'};({element:null,modulesHtml:"",rawSource:"",generatedSource:"",init:function(){this.sniff(),this.getRawSource(),this.getGeneratedSource(),this.element=document.createElement("div"),this.element.setAttribute("id","snpy"),this.element.classList.add("cleanslate"),this.element.innerHTML=this.createHtml(),document.body.appendChild(this.element),this.markupLastDetectedModule(),this.setMaxDimensions(),this.bindEvents()},sniff:function(){let t=Sniffer.run();for(group in t){var e,s=!1;for(test in e="<h2>"+t[group].description+'</h2><ul class="tests">',t[group].results){let n=t[group].results[test];e+='<li class="'+(n?"positive":"negative")+'">',e+='<span class="test-for">'+test+"</span>",e+='<span class="test-result '+(!0===n?"no-detail":(!!n).toString())+'">'+(!0===n?"-":n.toString())+"</span></li>",n&&(s=!0)}e+="</ul>",this.modulesHtml+='<div class="module'+(s?"":" no-detection")+" type_"+group+" output_"+t[group].return_type+'">'+e+"</div>"}},getRawSource:function(){var t=this,e=new XMLHttpRequest;e.onload=function(){t.rawSource=floodlight(floodlight.decode(this.response.trim())),document.querySelector("#snpy-rawsource code").innerHTML=t.rawSource},e.open("GET",location.href,!0),e.send()},getGeneratedSource:function(){this.generatedSource=floodlight(floodlight.decode(document.documentElement.outerHTML.toString()))},markupLastDetectedModule:function(){let t=this.getLastDetectedModule();t&&(t.style.cssText="margin-bottom: 0 !important;")},getLastDetectedModule:function(){let t=document.querySelectorAll("#snpy .module");for(index=t.length-1;index>=0;index-=1)if(!t[index].classList.contains("no-detection"))return t[index]},bindEvents:function(){var t=this;window.addEventListener("resize",function(){t.setMaxDimensions()}),document.querySelector("#snpy .toggle-tests").addEventListener("click",function(){t.toggleTests()}),document.querySelector("#snpy .close").addEventListener("click",function(){document.getElementById("snpy").classList.add("closed")});let e=document.querySelectorAll("#snpy .tabs li"),s=document.querySelectorAll("#snpy .panel");e.forEach(function(t){t.addEventListener("click",function(t){e.forEach(function(t){t.classList.remove("active")}),t.target.parentElement.classList.add("active"),s.forEach(function(t){t.classList.remove("active")}),document.querySelector(this.children[0].getAttribute("data-href")).classList.add("active")})})},setMaxDimensions:function(){this.element.style.maxHeight=window.innerHeight+"px";let t=window.innerHeight-document.querySelector("#snpy .header").clientHeight-document.querySelector("#snpy .tabs").clientHeight-document.querySelector("#snpy .footer").clientHeight,e="max-height: "+(t-40)+"px !important;";document.querySelector("#snpy .modules").style.cssText="max-height: "+(t-30)+"px !important;",document.querySelectorAll("#snpy pre code").forEach(function(t){t.style.cssText=e})},toggleTests:function(){document.querySelectorAll("#snpy .tests li.negative").forEach(function(t){t.style.cssText?t.style.cssText="":t.style.cssText="display: block !important;"});var t=!1,e=!1;if(document.querySelectorAll("#snpy .module.no-detection").forEach(function(s){s.style.cssText?(s.style.cssText="",e=!0):(s.style.cssText="display: block !important;",t=!0)}),!0===t){let s=this.getLastDetectedModule();s&&(s.style.cssText="")}!0===e&&this.markupLastDetectedModule()},createHtml:function(){return`
<div class="header">
  <button class="close" title="Closes Snoopy" type="button"></button>
  <button class="toggle-tests" title="Toggles undetected items in Overview" type="button"></button>
  <h1><a href="${e.URL}">${e.NAME} ${e.VERSION}</a></h1>
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
  ${e.CREATED}
</div>`}}).init()}();
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
    VERSION: '0.7.11',
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

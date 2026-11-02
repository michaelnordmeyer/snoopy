(function() {
  var snpy = document.getElementById('snpy');
  if (snpy) {
    snpy.classList.toggle('closed');
    return;
  }

  var cssLink = document.createElement('link');
  cssLink.setAttribute('href', 'https://corpco.michaelnordmeyer.com/snoopy/snoopy-min.css');
  cssLink.setAttribute('rel', 'stylesheet');
  document.head.appendChild(cssLink);

  var script = document.createElement('script');
  script.setAttribute('src', 'https://corpco.michaelnordmeyer.com/snoopy/snoopy-min.js');
  document.body.appendChild(script);
})();
(function() {
  var snpy = document.getElementById('snpy');
  if (snpy) {
    snpy.classList.toggle('closed');
    return;
  }

  var cssLink = document.createElement('link');
  cssLink.setAttribute('href', 'https://cdn.jsdelivr.net/gh/michaelnordmeyer/snoopy@latest/snoopy-min.css');
  cssLink.setAttribute('rel', 'stylesheet');
  document.head.appendChild(cssLink);

  var script = document.createElement('script');
  script.setAttribute('src', 'https://cdn.jsdelivr.net/gh/michaelnordmeyer/snoopy@latest/snoopy-min.js');
  document.body.appendChild(script);
})();
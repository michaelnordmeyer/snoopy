(function(){
    
    var d = document, s, e;
    
    var el = d.getElementById('snpy');
    
    if ( typeof Snoopy != 'undefined' )
    {
        Snoopy.toggle();
        return;
    }
    else if ( el )
    {
        // legacy display toggle
        el.className = /closed/.test(el.className) ? el.className.replace('closed','') : el.className + ' closed';
        return;
    }
    
    // append styles
    s = d.createElement('link');
    s.setAttribute('href','https://cdn.jsdelivr.net/gh/michaelnordmeyer/snoopy/snoopy-min.css');
    s.setAttribute('rel','stylesheet');
    s.setAttribute('type','text/css');
    d.getElementsByTagName('head')[0].appendChild(s);
    
    // append script
    e = d.createElement('script');
    e.setAttribute('src', 'https://cdn.jsdelivr.net/gh/michaelnordmeyer/snoopy/snoopy-min.css');
    d.getElementsByTagName('body')[0].appendChild(e);
    
})();
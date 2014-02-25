;(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  }
}(function ($) {

  var prefixes = ['-webkit-', ''];
  var resetCSS = {};
  var defaultTransition = 'all 0 ease 0';
  $.each(prefixes, function(idx, prefix) {
    resetCSS[prefix + 'transition'] = defaultTransition;
  })

  var defaults = {
    time: 0,
    timing: 'ease',
    delay: 0,
    property: null // String or Array here
  };

  $.fn.animatedCSS = function (styles, options) {
    styles = styles || {};
    var settings = $.extend( {}, defaults, options );
    var _p = settings.property; // for short
    if(_p) {
      settings.property = $.isArray(_p) ? _p : [_p];
    }

    var $this = $(this);

    var transitionValues = [];
    var transitionCSS = {};
    var props = settings.property || styles;
    $.each(props, function(prop) {
      transitionValues.push( [ prop, settings.time + 's',
        settings.timing, settings.delay ].join(' ') )
    });
    $.each(prefixes, function(idx, prefix) {
      transitionCSS[prefix + 'transition'] = transitionValues.join(',')
    });
    $this.css(transitionCSS).css(styles);
    // set back to default
    setTimeout(function() {
      $this.css(resetCSS);
    }, settings.time * 1000);
  };

  var animatedCSS = function () {
    $.fn.animatedCSS.apply(arguments[0],
      Array.prototype.slice.call(arguments, 1))
  };
  return animatedCSS
}));
;(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  }
}(function ($) {

  var defaultTransition = 'all 0 ease 0';

  var defaults = {
    duration: 0,
    timing: 'ease',
    delay: 0,
    property: null, // String or Array here
    prefixes: ['-webkit-', '']
  };

  $.fn.animatedCSS = function (styles, options) {
    // init setttings
    styles = styles || {};
    var settings = $.extend( {}, defaults, options );
    var _p = settings.property; // for short
    if(_p) {
      settings.property = $.isArray(_p) ? _p : [_p];
    }

    // shortcuts
    var $this = $(this);

    // variables
    var resetCSS = {};
    var transitionCSS = {};
    var props = settings.property || styles;

    var transitionValues = $.map(props, function(value, prop) {
      return [ prop, settings.duration + 's',
        settings.timing, settings.delay ].join(' ');
    }).join(',');
    console.log(transitionValues)
    $.each(settings.prefixes, function(idx, prefix) {
      resetCSS[prefix + 'transition'] = defaultTransition;
      transitionCSS[prefix + 'transition'] = transitionValues;
    });
    $this.css(transitionCSS).css(styles);
    // set back to default
    setTimeout(function() {
      $this.css(resetCSS);
    }, settings.duration * 1000);
  };

  var animatedCSS = function () {
    $.fn.animatedCSS.apply(arguments[0],
      Array.prototype.slice.call(arguments, 1))
  };
  return animatedCSS
}));
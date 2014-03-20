define([
  'jquery'
, 'underscore'
, 'backbone'
, 'magnific-popup'
, 'threes/app'
], function($, _, Backbone, magnificPopup, app) {
  var Popup = function() {
    // global set up for magnificPopup
    $(document).on('click', '.my-mfp-close', function() {
      magnificPopup.close()
    }).on('click', '.my-mfp-next', function() {
      var instance = $.magnificPopup.instance
      instance.next()
    })
  }

  function makeCallbacks (callbacks) {
    var open = callbacks.open || $.noop
    var close = callbacks.close || $.noop
    callbacks.open = function () {
      app.trigger('swiper:freeze')
      open.apply(this, arguments)
    }
    callbacks.close = function () {
      if(app.isPlaying) {
        app.trigger('swiper:unfreeze')
      }
      close.apply(this, arguments)
    }
    return callbacks
  }

  _.extend(Popup.prototype, Backbone.Events, {
    open: function(options) {
      options = _.extend({
        html: ''
      , callbacks: {}
      }, options)
      magnificPopup.open({
        items: {
          src: options.html
        , type: 'inline'
        }
      , removalDelay: 300
      , mainClass: 'mfp-fade-from-top'
      , callbacks: makeCallbacks(options.callbacks)
      })
    }
  , openGallery: function(options) {
      options = _.extend({
        items: []
      , callbacks: {}
      }, options)
      magnificPopup.open({
        items: options.items
      , type: 'inline'
      , callbacks: makeCallbacks(options.callbacks)
      , gallery:{
          enabled: true
        }
      , removalDelay: 300
      , mainClass: 'mfp-fade-from-top'
      })
    }
  })

  return new Popup()
})
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
    })
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
        , callbacks: options.callbacks
      })
    }
  , openGallery: function(options) {
      options = _.extend({
        items: []
      }, options)
      magnificPopup.open({
        items: options.items
      , type: 'inline'
      , gallery:{
          enabled: true
        }
      })
    }
  })

  return new Popup()
})
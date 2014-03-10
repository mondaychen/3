define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
], function($, _, Backbone, app) {
  var Help = function() {
    this.pages = $('.tmpl-help').map(function() {
      var html = $(this).html()
      return {
        src: html
      , type: 'inline'
      }
    }).get()
  }

  _.extend(Help.prototype, {
    show: function() {
      app.popup.openGallery({
        items: this.pages
      })
    }
  })

  return new Help()
})
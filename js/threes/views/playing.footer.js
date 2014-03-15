define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
], function($, _, Backbone, app) {

  var PlayingFooter = Backbone.View.extend({
    tagName: 'footer'
  , template: $('#tmpl-playing-footer').html()
  , initialize: function() {
      this.translateY = 0
    }
  , render: function() {
      this.$el.html(this.template)
      return this
    }
  , showWords: function(words) {
      var container = this.$el.find('.transition-container')
      var wordsContainer = $('<div class="box">' + words +'</div>')
        .appendTo(container)

      this.translateY -= this.$el.height()
      container.css({
        transform: 'translateY(' + this.translateY + 'px)'
      })
    }
  })

  return PlayingFooter
})
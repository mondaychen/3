define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
], function($, _, Backbone, app) {

  var playingHeader = Backbone.View.extend({
    tagName: 'header'
  , template: $('#tmpl-playing-header').html()
  , initialize: function(options) {
      this.number = options.number || 1
      this.translateY = 0
    }
  , render: function() {
      this.$el.html(_.template(this.template, {
        number: this.number
      , mark: this.number > 3 ? '+' : ''
      }))

      return this
    }
  , setComingNumber: function(number) {
      this.number = number
      this.render()
    }
  , showWords: function(words) {
      var container = this.$el.find('.header-container')
      var wordsContainer = $('<div class="words">' + words +'</div>')
        .appendTo(container)

      this.translateY -= this.$el.height()
      container.css({
        transform: 'translateY(' + this.translateY + 'px)'
      })
    }
  })

  return playingHeader
})
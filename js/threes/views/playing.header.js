define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
], function($, _, Backbone, app) {

  var playingHeader = Backbone.View.extend({
    tagName: 'header'
  , initialize: function(options) {
      this.number = options.number || 1
    }
  , render: function() {
      this.container = $('<div class="header-container"></div>')
        .appendTo(this.$el)
      this.main = $('<div class="main"></div>').appendTo(this.container)
      this.upComing = $('<div class="up-coming-number"></div>')
        .appendTo(this.main)
      this.setUpComing()

      this.translateY = 0

      return this
    }
  , setUpComing: function() {
      this.upComing.empty()
      this.tile = $('<div class="tile"><div class="number"></div></div>')
      this.tile.appendTo(this.upComing).addClass('num-' + this.number)
        .find('.number').html(this.number > 3 ? '+' : '')
      this.upComing.append('<div class="word">next</div>')
    }
  , setComingNumber: function(number) {
      this.number = number
      this.setUpComing()
    }
  , showWords: function(words) {
      var wordsContainer = $('<div class="words">' + words +'</div>')
        .appendTo(this.container)

      this.translateY -= this.$el.height()
      this.container.css({
        transform: 'translateY(' + this.translateY + 'px)'
      })
    }
  })

  return playingHeader
})
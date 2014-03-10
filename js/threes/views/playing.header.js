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
      this.$el.empty()
      this.upComing = $('<div class="up-coming-number"></div>')
        .appendTo(this.$el)
      this.setUpComing()

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
  })

  return playingHeader
})
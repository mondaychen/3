define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
, 'threes/views/tile'
], function($, _, Backbone, app, TileView) {

  function multiplyStr (str, times) {
    var result = ''
    for (var i = times - 1; i >= 0; i--) {
      result = result + str
    }
    return result
  }

  var PlayingView = Backbone.View.extend({
    id: "playing-view"
  , initialize: function() {
    }
  , render: function() {
      this.plate = $('<div class="plate"></div>').appendTo(this.$el)
      var bg = $('<div class="bg"></div>').appendTo(this.plate)
      bg.append(multiplyStr('<div class="bg-tile"></div>', 16))


      this.header = $('<header></header>').prependTo(this.$el)
      this.footer = $('<footer></footer>').appendTo(this.$el)

      return this
    }
  , start: function() {
      var tile1 = new TileView(this.plate, 1)
      this.plate.append(tile1.render().el)
      tile1.setPosition(1,1)
      _.delay(function() {
        tile1.setPosition(1,2)
      }, 1500)
    }
  })

  return PlayingView
})

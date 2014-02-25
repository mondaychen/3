define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
, 'threes/views/tile'
, 'threes/modules/swiper'
], function($, _, Backbone, app, TileView, Swiper) {

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
      this.tiles = []
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
      var swiper = new Swiper().wake()
      swiper.on('move', function(direction, distance) {
        _.each(this.tiles, function(tile) {
          tile.preview(direction, distance)
        })
      }, this)
      .on('swipe', function(direction, forward){

      })
      this.addTile(1)
    }
  , addTile: function(number) {
      var tile = new TileView(this.plate, number)
      this.plate.append(tile.render().el)
      tile.setPosition(1,1)
      this.tiles.push(tile)

      _.delay(function() {
        tile.setPosition(1,2)
      },1000)
    }
  })

  return PlayingView
})

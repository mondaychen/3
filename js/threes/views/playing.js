define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
, 'threes/collections/tiles'
, 'threes/modules/swiper'
], function($, _, Backbone, app, TilesCollection, Swiper) {

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
      var self = this
      var swiper = new Swiper().wake()
      swiper.on('move', function(direction, distance) {
        self.tiles.preview(direction, distance)
      }, this)
      .on('swipe', function(direction, forward){
        self.tiles.move(direction, !forward)
      }, this)
      app.on('page_change freeze', function() {
        swiper.sleep()
      })
      app.on('unfreeze', function() {
        swiper.wake()
      })
      this.addTiles()
    }
  , addTiles: function() {
      this.tiles = new TilesCollection([], {plate: this.plate})
      this.tiles.addOne(3, 1, 1)
      this.tiles.addOne(3, 1, 2)
      this.tiles.addOne(1, 2, 1)
    }
  })

  return PlayingView
})

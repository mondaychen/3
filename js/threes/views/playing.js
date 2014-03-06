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
      app.on('page_change swiper:freeze', function() {
        swiper.sleep()
      })
      app.on('swiper:unfreeze', function() {
        swiper.wake()
      })
      _.delay(function() {
        self.initTiles()
      }, 200)
    }
  , initTiles: function() {
      this.tiles = new TilesCollection([], {plate: this.plate})
      this.addNewTile()
    }
  , addNewTile: function(num) {
      var num = num || Math.ceil(Math.random() * this.getCurrentMax())
      this.tiles.addOne(num, 0, 0)
    }
  , getCurrentMax: function() {
      var max = this.tiles.max(function(model) {
        return model.get('number')
      })
      return Math.max(max, 3)
    }
  })

  return PlayingView
})

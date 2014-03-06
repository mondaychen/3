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
      this.plateSize = { row: 4, column: 4 }
    }
  , render: function() {
      this.plate = $('<div class="plate"></div>').appendTo(this.$el)
      var bg = $('<div class="bg"></div>').appendTo(this.plate)
      bg.append(multiplyStr('<div class="bg-tile"></div>'
        , this.plateSize.row * this.plateSize.column))


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
      this.tiles = new TilesCollection([], {
        plate: this.plate
      , plateSize: this.plateSize
      })
      this.addNewTile(1)
      this.addNewTile(1)
      this.addNewTile(2)
      this.addNewTile(2)
      this.addNewTile(3)
      this.addNewTile(3)
      this.addNewTile()
      this.addNewTile()
      this.addNewTile()

      var self = this
      app.on('round:finish', function(direction) {
        var lastMoved = self.tiles.matrixManager.getLastMoved()
        console.log(lastMoved)
        var model = lastMoved[_.random(lastMoved.length - 1)]
        var pos = model.getCoordinates()
        switch (direction) {
          case 'up':    pos.m = self.plateSize.row - 1; break;
          case 'right': pos.n = 0; break;
          case 'down':  pos.m = 0; break;
          case 'left':  pos.n = self.plateSize.column - 1; break;
          default: break;
        }
        self.tiles.flyInOne(self.getRandomNumber(), pos.m, pos.n, direction)
      }).on('round:ready', function() {
        app.trigger('swiper:unfreeze')
      })
    }
  , addNewTile: function(num, m, n) {
      num = num || this.getRandomNumber()
      var usefulM = m || _.random(this.plateSize.row - 1)
      var usefulN = n || _.random(this.plateSize.column - 1)
      var success = this.tiles.addOne(num, usefulM, usefulN)
      if(success) {
        return true
      }
      if(m || n) {
        return false
      }
      this.addNewTile(num)
    }
  , getRandomNumber: function() {
      // half the biggest number
      var max = this.tiles.max(function(model) {
        return model.get('number')
      }).get('number') / 2
      max = Math.max(max, 3)
      var arr = [1, 2].concat(_.range(3, max + 1, 3))
      // random in the array
      return arr[_.random(arr.length - 1)]
    }
  })

  return PlayingView
})

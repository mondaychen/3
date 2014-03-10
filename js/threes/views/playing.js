define([
  'jquery'
, 'underscore'
, 'backbone'
, 'magnific-popup'
, 'threes/app'
, 'threes/collections/tiles'
, 'threes/views/next_hinter'
], function($, _, Backbone, magnificPopup, app, TilesCollection
  , nextHinterView) {

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

      this.nextHinter = new nextHinterView({number: 1})
      this.header.append(this.nextHinter.render().el)

      return this
    }
  , start: function() {
      var self = this
      var swiper = app.swiper.wake()
      swiper.on('move', function(direction, distance) {
        self.tiles.preview(direction, distance)
      }, this)
      .on('swipe', function(direction, forward){
        self.tiles.move(direction, !forward)
      }, this)
      _.delay(function() {
        self.initTiles()
        self.initEvents()
      }, 200)
    }
  , initTiles: function() {
      this.tiles = new TilesCollection([], {
        plate: this.plate
      , plateSize: this.plateSize
      , playingHub: this
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

      this.prepareNext()
    }
  , initEvents: function() {
      var self = this
      self.on('round:finish', function(direction) {
        var lastMoved = self.tiles.matrixManager.getLastMoved()
        var model = lastMoved[_.random(lastMoved.length - 1)]
        var pos = model.getCoordinates()
        switch (direction) {
          case 'up':    pos.m = self.plateSize.row - 1; break;
          case 'right': pos.n = 0; break;
          case 'down':  pos.m = 0; break;
          case 'left':  pos.n = self.plateSize.column - 1; break;
          default: break;
        }
        self.tiles.flyInOne(self.nextNumber, pos.m, pos.n, direction)
        self.prepareNext()
      }).on('round:ready', function() {
        if(!self.tiles.anyMovable()) {
          self.trigger('game:over')
          return
        }
        app.trigger('swiper:unfreeze')
      }).on('game:over', function() {
        // clear all events on swiper
        magnificPopup.open({
          items: {
            src: '<div class="white-popup">Game Over!</div>'
          , type: 'inline'
          }
          , removalDelay: 300
          , mainClass: 'mfp-fade-from-top'
          , callbacks: {
              close: function() {
                app.trigger('game:restart')
              }
            }
        })
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
      // 1/8 the biggest number
      var max = this.tiles.max(function(model) {
        return model.get('number')
      }).get('number') / 8
      max = Math.max(max, 3)
      var current = [1, 2, 3][_.random(2)]
      if(current === 3) {
        while(current < max) {
          // 2/3 chance
          if(_.random(2) > 0) {
            break
          } else {
            current *= 2
          }
        }
      }
      return current
    }
  , prepareNext: function() {
      this.nextNumber = this.getRandomNumber()
      this.nextHinter.changeNumber(this.nextNumber)
    }
  })

  return PlayingView
})

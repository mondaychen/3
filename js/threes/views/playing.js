define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
, 'threes/collections/tiles'
, 'threes/views/playing.header'
, 'threes/views/utils/help'
, 'threes/views/utils/menu'
, 'threes/modules/random_pool'
], function($, _, Backbone, app, TilesCollection, HeaderView
  , helpView, menuView, RandomPool) {

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
      this.pool = new RandomPool(6, 3, _.bind(this._getRandomNumber, this))
      window.playing = this
    }
  , render: function() {
      this.header = new HeaderView({number: 1})
      this.$el.append(this.header.render().el)

      this.plate = $('<div class="plate"></div>').appendTo(this.$el)
      var bg = $('<div class="bg"></div>').appendTo(this.plate)
      bg.append(multiplyStr('<div class="bg-tile"></div>'
        , this.plateSize.row * this.plateSize.column))

      this.footer = $('<footer></footer>').appendTo(this.$el)

      return this
    }
  , start: function() {
      var self = this
      self.initHeader()
      self.initTiles()
      self.initEvents()
      _.delay(function() {
        self.initController()
        if(localStorage && !localStorage.played) {
          helpView.show()
          localStorage.played = "true"
        }
      }, 500)
    }
  , initHeader: function() {
      this.listenTo(this.header, 'show:help', function() {
        helpView.show()
      }).listenTo(this.header, 'show:menu', function() {
        menuView.show()
      })
    }
  , initController: function() {
      var swiper = app.swiper.wake()
      this.listenTo(swiper, 'move', function(direction, distance) {
        this.tiles.preview(direction, distance)
      }, this)
      .listenTo(swiper, 'swipe', function(direction, forward){
        this.tiles.move(direction, !forward)
      }, this)

      var keyboard = app.keyboard.wake()
      this.listenTo(keyboard, 'preview', function(direction) {
        swiper.sleep()
        var isMovable = this.tiles.previewInHalf(direction)
        if(!isMovable) {
          keyboard.trigger('cancel', direction)
          keyboard.reset()
        }
      }).listenTo(keyboard, 'confirm', function(direction) {
        this.tiles.move(direction, false)
        swiper.wake()
      }).listenTo(keyboard, 'cancel', function(direction) {
        this.tiles.move(direction, true)
        swiper.wake()
      })
    }
  , initTiles: function() {
      this.tiles = new TilesCollection([], {
        plate: this.plate
      , plateSize: this.plateSize
      , playingHub: this
      })
      this.addNewTile(1)
      this.addNewTile(2)
      this.addNewTile(3)
      _.times(6, function(n) {
        this.addNewTile()
      }, this)

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
        app.trigger('swiper:freeze')
        this.header.showWords('Out of moves!')
        this.tiles.showScore()
      }).on('game:score:done', function(totalScore) {
        // don't be to fast
        _.delay(function() {
          app.popup.open({
            html: _.template($('#tmpl-game-over').html(), {
              score: totalScore
            })
          , callbacks: {
              close: function() {
                app.trigger('game:restart')
              }
            }
          })
        }, 400)
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
      return this.pool.get()
    }
  , _getRandomNumber: function() {
      // 1/8 the biggest number
      var countOfOne = this.tiles.filter(function(model) {
        return model.get('number') === 1
      }).length
      var countOfTwo = this.tiles.filter(function(model) {
        return model.get('number') === 2
      }).length
      console.log(countOfOne, countOfTwo)
      var max = this.tiles.getMaxNumber() / 8
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
      } else if(countOfTwo - countOfOne >= 2) {
        current = 1
      } else if(countOfOne - countOfTwo >= 2) {
        current = 2
      }
      return current
    }
  , prepareNext: function() {
      this.nextNumber = this.getRandomNumber()
      this.header.setComingNumber(this.nextNumber)
    }
  })

  return PlayingView
})

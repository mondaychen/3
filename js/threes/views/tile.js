define([
  'jquery'
, 'underscore'
, 'backbone'
, 'mod/jquery.animatedCSS'
, 'threes/app'
], function($, _, Backbone, animatedCSS, app) {

  var walls = {
    up: [1, 'm']
  , right: [4, 'n']
  , down: [4, 'm']
  , left: [1, 'n']
  }

  var TileView = Backbone.View.extend({
    className: "tile"
  , initialize: function(options) {
      this.plate = options.plate
      this.bgTiles = this.plate.find('.bg-tile')

      this.model.on('change:m change:n', function() {
        this.updatePosition(true)
      }, this)
    }
  , render: function() {
      this.numberContainer = $('<div class="number"></div>' )
        .appendTo(this.$el)

      var number = this.model.get('number')
      this.$el.addClass('num-' + number)
      this.numberContainer.html(number)
      this.updatePosition(true)

      return this
    }
  , updatePosition: function(refresh) {
      this.$el.animatedCSS(this.getPosition(refresh), {
        duration: 0.2
      , timing: 'linear'
      })
    }
  , getPosition: function(refresh) {
      if(!refresh && this._position) {
        // return cached position
        return _.clone(this._position)
      }
      var eq = (this.model.get('m') - 1) * 4 + this.model.get('n') - 1
      var bgPos = this.bgTiles.eq(eq).offset()
      var offset = this.plate.offset()
      this._position = {
        top: bgPos.top - offset.top
          - parseFloat(this.plate.css('border-top-width'))
      , left: bgPos.left - offset.left
      }
      return _.clone(this._position)
    }
  , preview: function(direction, distance) {
      var position = this.getPosition()
      if(this.checkWalls(direction)) {
        return
      }
      switch (direction) {
        case 'up':
          position.top -= Math.min(this.$el.height(), distance)
          break;
        case 'right':
          position.left += Math.min(this.$el.width(), distance)
          break;
        case 'down':
          position.top -= Math.max(-this.$el.height(), distance)
          break;
        case 'left':
          position.left += Math.max(-this.$el.width(), distance)
          break;
        default:
          break;
      }
      this.$el.css(position)
    }
  , move: function(direction, canceled) {
      if(this.checkWalls(direction)) {
        return
      }
      if(canceled) {
        this.updatePosition()
        return
      }
      this.model.move(direction)
    }
  , checkWalls: function(direction) {
      // walls
      var wallValue = walls[direction][0]
      var wallName = walls[direction][1]
      return wallValue === this.model.get(wallName)
    }
  })

  return TileView
})

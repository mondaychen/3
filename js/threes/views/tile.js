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
  , initialize: function(plate, number) {
      this.plate = plate
      this.number = number || 1
      this.bgTiles = plate.find('.bg-tile')
    }
  , render: function() {
      this.numberContainer = $('<div class="number"></div>' )
        .appendTo(this.$el)
      this.setNumber(this.number)

      return this
    }
  , setNumber: function(number) {
      this.number = number
      this.$el.addClass('num-' + number)
      this.numberContainer.html(number)
    }
  , setPosition: function(m, n) {
      this.m = m || this.m
      this.n = n || this.n
      this.updatePosition(true)
    }
  , updatePosition: function(refresh) {
      this.$el.animatedCSS(this.getPosition(refresh), {
        time: 0.2
      , timing: 'linear'
      })
    }
  , getPosition: function(refresh) {
      if(!refresh && this._position) {
        // return cached position
        return _.clone(this._position)
      }
      var eq = (this.m - 1) * 4 + this.n - 1
      var position = this.bgTiles.eq(eq).offset()
      var offset = this.plate.offset()
      this._position = {
        top: position.top - offset.top
          - parseFloat(this.plate.css('border-top-width'))
      , left: position.left - offset.left
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
      switch (direction) {
        case 'up':    this.m--; break;
        case 'right': this.n++; break;
        case 'down':  this.m++; break;
        case 'left':  this.n--; break;
        default: break;
      }
      this.setPosition()
    }
  , checkWalls: function(direction) {
      // walls
      var wallValue = walls[direction][0]
      var wallName = walls[direction][1]
      return wallValue === this[wallName]
    }
  })

  return TileView
})

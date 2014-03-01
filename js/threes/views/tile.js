define([
  'jquery'
, 'underscore'
, 'backbone'
, 'mod/jquery.transition'
, 'threes/app'
], function($, _, Backbone, transition, app) {

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

      this.model.on('change:m change:n change_back', function() {
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
      this.$el.transition(this.getPosition(refresh), {
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
  , checkWalls: function(direction) {
      // walls
      var wallValue = walls[direction][0]
      var wallName = walls[direction][1]
      return wallValue === this.model.get(wallName)
    }
  })

  return TileView
})

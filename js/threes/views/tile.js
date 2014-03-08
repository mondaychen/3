define([
  'jquery'
, 'underscore'
, 'backbone'
, 'mod/jquery.transition'
, 'threes/app'
], function($, _, Backbone, transition, app) {

  var tileSize = {
    height: 159
  , width: 106
  , marginLeft: 22
  , marginTop: 10
  }

  var TileView = Backbone.View.extend({
    initialize: function(options) {
      this.plate = options.plate

      this.model.on('change:m change:n', function() {
        this.updatePosition(true)
      }, this)
      this.model.on('change_back', function() {
        this.updatePosition(false)
      }, this)
      this.model.on('change:number', function() {
        this.render()
      }, this)
      this.model.on('destroy', function() {
        this.$el.remove()
      }, this)

      _.bindAll(this, 'render', 'updatePosition')
    }
  , render: function() {
      this.el.className = 'tile'
      this.$el.empty()
      this.numberContainer = $('<div class="number"></div>' )
        .appendTo(this.$el)

      var number = this.model.get('number')
      this.$el.addClass('num-' + number)
      this.numberContainer.html(number)
      this.updatePosition(false)

      return this
    }
  , updatePosition: function(isMoving) {
      var self = this
      var duration = 0
      var pos = this.getPosition(isMoving)
      if(isMoving) {
        var currentTop = parseFloat(this.$el.css('top') || 0)
        var currentLeft = parseFloat(this.$el.css('left') || 0)
        var sum = Math.abs((currentLeft - pos.left)/this.$el.width()
          + (currentTop - pos.top)/this.$el.height())
        duration = 0.4 * sum / 2.31
      }
      this.$el.transition(this.getPosition(isMoving), {
        duration: duration
      , timing: 'linear'
      })
      if(isMoving) {
        _.delay(function() {
          self.model.trigger('move:done')
        }, duration * 1000)
      }
    }
  , getPosition: function(refresh) {
      if(!refresh && this._position) {
        // return cached position
        return _.clone(this._position)
      }
      var coord = this.model.getCoordinates()
      var marginLeft = app.ratio * tileSize.marginLeft
      var marginTop = app.ratio * tileSize.marginTop
      var width = app.ratio * tileSize.width
      var height = app.ratio * tileSize.height
      var borderTop = parseFloat(this.plate.css('border-top-width'))
      this._position = {
        top: borderTop + coord.m * height + (coord.m + 1) * marginTop
      , left: coord.n * width + (coord.n + 1) * marginLeft
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
  })

  return TileView
})

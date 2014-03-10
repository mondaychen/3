define([
  'jquery'
, 'underscore'
, 'backbone'
, 'mod/jquery.transition'
, 'threes/app'
], function($, _, Backbone, transition, app) {

  function getDigit (number) {
    var digit = 0
    while(number >= 1) {
      digit++
      number/=10
    }
    return digit
  }

  function pos2transform (pos) {
    return {
      '-webkit-transform': 'translate3d('
        + pos.left + 'px, ' + pos.top +'px, 0)'
    }
  }

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

      this._realPos = {}

      _.bindAll(this, 'render', 'updatePosition')
    }
  , render: function() {
      this.el.className = 'tile'
      this.$el.empty()
      this.numberContainer = $('<div class="number"></div>' )
        .appendTo(this.$el)

      var number = this.model.get('number')
      this.$el.addClass('num-' + number)
      this.numberContainer.html(number).addClass('digit-' + getDigit(number))
      this.updatePosition(false)

      return this
    }
  , updatePosition: function(isMoving) {
      var self = this
      var duration = 0
      var pos = this.getPosition(isMoving)
      if(isMoving) {
        var currentTop = this._realPos.top || 0
        var currentLeft = this._realPos.left || 0
        var sum = Math.abs((currentLeft - pos.left)/this.$el.width()
          + (currentTop - pos.top)/this.$el.height())
        duration = 0.4 * sum / 2.31
      }
      this.$el.transition(pos2transform(pos), {
        duration: duration
      , timing: 'linear'
      })
      this._realPos = pos
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
      var height = this.$el.height()
      var width = this.$el.width()
      switch (direction) {
        case 'up':
          position.top -= Math.min(height, distance)
          break;
        case 'right':
          position.left += Math.min(width, distance)
          break;
        case 'down':
          position.top -= Math.max(-height, distance)
          break;
        case 'left':
          position.left += Math.max(-width, distance)
          break;
        default:
          break;
      }
      this._realPos = position
      this.$el.css(pos2transform(position))
    }
  , previewInHalf: function(direction) {
      var distance = 0
      var height = this.$el.height()
      var width = this.$el.width()
      switch (direction) {
        case 'up':
          distance = height / 2
          break;
        case 'right':
          distance = - width / 2
          break;
        case 'down':
          distance = - height /2
          break;
        case 'left':
          distance = width / 2
          break;
        default:
          break;
      }

      this.preview(direction, distance)
    }
  })

  return TileView
})

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
        this.updatePosition(true, true)
      }, this)
      .on('change_back', function() {
        this.updatePosition(true, false)
      })
      .on('change:number', function() {
        this.render()
      }, this)
      .on('destroy', function() {
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
      this.updatePosition(false, false)

      return this
    }
  , moveTo: function(position, animated, callback) {
      var duration = 0
      if(animated) {
        var currentTop = this._realPos.top || 0
        var currentLeft = this._realPos.left || 0
        var sum = Math.abs((currentLeft - position.left)/this.$el.width()
          + (currentTop - position.top)/this.$el.height())
        duration = 0.4 * sum / 2.31
      }
      this.$el.transition(pos2transform(position), {
        duration: duration
      , timing: 'linear'
      , callback: callback
      })
      this._realPos = position
    }
  , updatePosition: function(animated, refresh) {
      var self = this
      var pos = this.getPosition(refresh)
      this.moveTo(pos, animated, function() {
        if(refresh) {
          self.model.trigger('move:done')
        }
      })
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
  , preview: function(direction, distance, animated) {
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
      this.moveTo(position, animated)
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
          distance = width / 2
          break;
        case 'down':
          distance = - height /2
          break;
        case 'left':
          distance = - width / 2
          break;
        default:
          break;
      }

      this.preview(direction, distance, true)
    }
  })

  return TileView
})

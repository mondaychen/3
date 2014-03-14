define([
  'jquery'
, 'underscore'
, 'backbone'
, 'bowser'
, 'mod/jquery.transition'
, 'threes/app'
], function($, _, Backbone, bowser, transition, app) {

  function getDigit (number) {
    var digit = 0
    while(number >= 1) {
      digit++
      number/=10
    }
    return digit
  }

  function pos2transform (pos) {
    var prefix = ''
    if(bowser.webkit) {
      prefix = '-webkit-'
    }
    var rtn = {}
    rtn[prefix + 'transform'] = 'translate3d('
        + pos.left + 'px, ' + pos.top +'px, 0px)'
    return rtn
  }

  var TileView = Backbone.View.extend({
    initialize: function(options) {
      this.plate = options.plate

      this.model.on('change:m change:n', function() {
        this.updatePosition(true, true)
      }, this)
      .on('change_back', function() {
        this.updatePosition(true, false)
      }, this)
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
        duration = 0.07 * sum / app.ratio
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
      var tileSize = app.getTileSize()
      var borderTop = parseFloat(this.plate.css('border-top-width'))
      this._position = {
        top: borderTop + coord.m * tileSize.height
          + (coord.m + 1) * tileSize.marginTop
      , left: coord.n * tileSize.width + (coord.n + 1) * tileSize.marginLeft
      }
      return _.clone(this._position)
    }
  , stretch: function(direction, distance) {
      var scale = [1 ,1]
      var originMap = {
        up:    ['0', '100%']
      , down:  ['0', '0']
      , left:  ['100%', '0']
      , right: ['0', '0']
      }
      if(direction === 'up' || direction === 'down') {
        scale[1] += Math.abs(distance / this.$el.height() / 50)
      } else {
        scale[0] += Math.abs(distance / this.$el.width() / 50)
      }
      // add to current transform styles
      var transform = pos2transform(this._realPos)
      _.each(transform, function(value, key) {
        transform[key] = value + ' scale(' + scale.join(',') + ')'
      })
      transform['transform-origin'] = originMap[direction].join(' ')
      this.$el.css(transform)
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
  , showScore: function() {
      var model = this.model
      var score = model.getScore()
      if(!score) {
        this.$el.addClass('gray')
      } else {
        var dom = $('<div class="score">+' + score + '</div>')
          .appendTo(this.$el)
        _.defer(function() {
          dom.addClass('show-score')
        })
        _.delay(function() {
          model.trigger('score:shown')
          // important: this delay time keeps same with css
        }, 400)
      }
    }
  , highlight: function() {
      this.$el.addClass('highlight')
    }
  , unhighlight: function() {
      this.$el.removeClass('highlight')
    }
  })

  return TileView
})

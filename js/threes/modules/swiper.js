define([
  'jquery'
, 'underscore'
, 'backbone'
], function ($, _, Backbone) {

  var hasTouch = !!('ontouchstart' in window
    || window.DocumentTouch
    && document instanceof DocumentTouch)

  var events = {
    start : hasTouch ? "touchstart" : "mousedown"
  , move : hasTouch ? "touchmove" : "mousemove"
  , end : hasTouch ? "touchend" : "mouseup"
  }

  function evt2point (e) {
    return { x: e.pageX, y: -e.pageY }
  }

  var body = $('body')

  function Swiper () {
    this.direction = null
    this.forward = false
    this.startPoint = {x: 0, y: 0}
    this.lastPoint = null

    _.bindAll(this, '_onStart', '_onMove', '_onEnd')
  }

  _.extend(Swiper.prototype, Backbone.Events, {
    wake: function() {
      body.on(events.start + '.swiper', this._onStart)
      body.on(events.end + '.swiper', this._onEnd)
      return this
    }
  , sleep: function() {
      body.off('.swiper')
      return this
    }
  , _onStart: function(e) {
      e.preventDefault()
      var self = this
      _.delay(function() {
        body.on(events.move + '.swiper', self._onMove)
      }, 100)
      this.startPoint = evt2point(e)
    }
  , _onMove: function(e) {
      e.preventDefault()
      var currentPoint = evt2point(e)
      var deltaY = currentPoint.y - this.startPoint.y
      var deltaX = currentPoint.x - this.startPoint.x
      if(!this.direction) {
        var slope = deltaY / deltaX
        if(slope < 1 && slope > -1) {
          this.direction = deltaX > 0 ? 'right' : 'left'
        } else {
          this.direction = deltaY > 0 ? 'up' : 'down'
        }
        this.forward = true
      } else if(this.lastPoint) {
        switch(this.direction) {
          case 'up':    this.forward = currentPoint.y >= this.lastPoint.y; break;
          case 'right': this.forward = currentPoint.x >= this.lastPoint.x; break;
          case 'down':  this.forward = currentPoint.y <= this.lastPoint.y; break;
          case 'left':  this.forward = currentPoint.x <= this.lastPoint.x; break;
          default: break;
        }
      }
      var distance = 0
      // lock direction
      switch(this.direction) {
        case 'up':    distance = Math.max(deltaY, 0); break;
        case 'right': distance = Math.max(deltaX, 0); break;
        case 'down':  distance = Math.min(deltaY, 0); break;
        case 'left':  distance = Math.min(deltaX, 0); break;
        default: break;
      }
      this.trigger('move', this.direction, distance)

      this.lastPoint = currentPoint
    }
  , _onEnd: function(e) {
      e.preventDefault()
      body.off(events.move + '.swiper', this._onMove)
      if(!this.direction) {
        return
      }
      this.trigger('swipe', this.direction, this.forward)
      this.direction = null
      this.forward = false
    }
  })

  return Swiper
})
define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/modules/env'
], function ($, _, Backbone, env) {

  var hasTouch = env.hasTouch()

  var events = {
    start : hasTouch ? "touchstart" : "mousedown"
  , move : hasTouch ? "touchmove" : "mousemove"
  , end : hasTouch ? "touchend" : "mouseup"
  }

  function evt2point (e) {
    var pageX = e.pageX || e.originalEvent.pageX
      || (e.originalEvent.changedTouches
        && e.originalEvent.changedTouches[0].pageX)
    var pageY = e.pageY || e.originalEvent.pageY
      || (e.originalEvent.changedTouches
        && e.originalEvent.changedTouches[0].pageY)
    return { x: pageX, y: -pageY }
  }

  var body = $('body')

  function Swiper () {
    this.reset()
    _.bindAll(this, '_onStart', '_onMove', '_onEnd')
  }

  _.extend(Swiper.prototype, Backbone.Events, {
    reset: function() {
      this.direction = null
      this.startPoint = {x: 0, y: 0}
      this.distance = 0
      clearTimeout(this._delayed)
    }
  , wake: function() {
      if(this._isAwake) {
        return this
      }
      body.on(events.start + '.swiper', this._onStart)
      body.on(events.end + '.swiper', this._onEnd)
      this._isAwake = true
      return this
    }
  , sleep: function() {
      body.off('.swiper')
      this.reset()
      this._isAwake = false
      return this
    }
  , _onStart: function(e) {
      var self = this
      this._delayed = setTimeout(function() {
        body.on(events.move + '.swiper', self._onMove)
      }, hasTouch ? 1 : 100)
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

      this.distance = distance
    }
  , _onEnd: function(e) {
      body.off(events.move + '.swiper', this._onMove)
      if(!this.direction) {
        return
      }
      this.trigger('swipe', this.direction, this.distance)
      this.direction = null
    }
  })

  return Swiper
})
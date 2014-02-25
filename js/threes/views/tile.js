define([
  'jquery'
, 'underscore'
, 'backbone'
, 'mod/jquery.animatedCSS'
, 'threes/app'
], function($, _, Backbone, animatedCSS, app) {

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
  , updatePosition: function(refresh) {
      this.$el.animatedCSS(this.getPosition(refresh), {
        time: 0.2
      , timing: 'linear'
      })
    }
  , setPosition: function(x, y) {
      this.x = x
      this.y = y
      this.updatePosition(true)
    }
  , getPosition: function(refresh) {
      if(!refresh && this._position) {
        // return cached position
        return _.clone(this._position)
      }
      var eq = (this.x - 1) * 4 + this.y - 1
      var position = this.bgTiles.eq(eq).offset()
      var offset = this.plate.offset()
      this._position = {
        top: position.top - offset.top
          - parseFloat(this.plate.css('border-top-width'))
      , left: position.left - offset.left
      }
      return _.clone(this._position)
    }
  })

  return TileView
})

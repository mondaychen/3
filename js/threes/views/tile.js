define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
], function($, _, Backbone, app) {

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
  , setPosition: function(x, y) {
      this.x = x
      this.y = y
      var eq = (x - 1) * 4 + y - 1
      var position = this.bgTiles.eq(eq).offset()
      var offset = this.plate.offset()
      this.$el.css({
        top: position.top - offset.top
          - parseFloat(this.plate.css('border-top-width'))
      , left: position.left - offset.left
      })
    }
  })

  return TileView
})

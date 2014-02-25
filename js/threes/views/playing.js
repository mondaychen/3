define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
], function($, _, Backbone, app) {

  function multiplyStr (str, times) {
    var result = ''
    for (var i = times - 1; i >= 0; i--) {
      result = result + str
    }
    return result
  }

  var PlayingView = Backbone.View.extend({
    id: "playing-view"
  , initialize: function() {
    }
  , render: function() {
      this.plate = $('<div class="plate"></div>').appendTo(this.$el)
      var bg = $('<div class="bg"></div>').appendTo(this.plate)
      bg.append(multiplyStr('<div class="bg-tile"></div>', 16))


      this.header = $('<header></header>').prependTo(this.$el)
      this.footer = $('<footer></footer>').appendTo(this.$el)

      return this
    }
  , start: function() {
      this.plate.append(this.makeTile(1))
      this.setPosition(this.plate.find('.tile:eq(0)'), 1, 1)
    }
  , makeTile: function(num){
      var tile = $('<div class="tile"></div>')
      tile.addClass('num-' + num)
      tile.append('<div class="number">' + num + '</div>' )
      return tile
    }
  , setPosition: function(tile, x, y) {
      var eq = (x - 1) * 4 + y - 1
      var targetBGTile = this.plate.find('.bg-tile').eq(eq)
      var position = targetBGTile.offset()
      var offset = this.plate.offset()
      tile.css({
        top: position.top - offset.top
          - parseFloat(this.plate.css('border-top-width'))
      , left: position.left - offset.left
      })
    }
  })

  return PlayingView
})

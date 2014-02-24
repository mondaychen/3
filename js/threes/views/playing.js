define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
], function($, _, Backbone, app) {
  var PlayingView = Backbone.View.extend({
    id: "#playing-view"
  , initialize: function() {
    }
  , render: function() {
      var plate = $('<div class="plate"></div>')
      plate.append(this.makeTile(1))
      plate.append(this.makeTile(2))
      plate.append(this.makeTile(3))
      this.$el.html(plate)
      return this
    }
  , makeTile: function(num){
      var tile = $('<div class="tile"></div>')
      tile.addClass('num-' + num)
      tile.append('<div class="number">' + num + '</div>' )
      return tile
    }
  })

  return PlayingView
})

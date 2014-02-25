define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
], function($, _, Backbone, app) {
  var PlayingView = Backbone.View.extend({
    id: "playing-view"
  , initialize: function() {
    }
  , render: function() {
      this.plate = $('<div class="plate"></div>').appendTo(this.$el)
      this.plate.append(this.makeTile(1))
      this.plate.append(this.makeTile(2))
      this.plate.append(this.makeTile(3))

      this.header = $('<header></header>').prependTo(this.$el)
      this.footer = $('<footer></footer>').appendTo(this.$el)

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

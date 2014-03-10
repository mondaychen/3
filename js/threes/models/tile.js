define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
, 'threes/views/tile'
], function($, _, Backbone, app, TileView) {

  var defaults = {
    number: 1
  , m: 1
  , n: 1
  }

  var Tile = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.set(_.extend(defaults, attrs))
      this.plate = options.plate

      var view = new TileView({
        model: this
      , plate: this.plate
      })
      this.view = view
      this.plate.append(view.render().el)
    }
  , moveTo: function(m, n) {
      this.set({m: m, n: n})
    }
  , merge: function(toBeMerged) {
      var self = this
      var num = this.get('number') + toBeMerged.get('number')
      this.moveTo(toBeMerged.get('m'), toBeMerged.get('n'))
      this.once('move:done', function() {
        toBeMerged.destroy()
        self.set('number', num)
      })
    }
  , getCoordinates: function() {
      return {
        m: this.get('m')
      , n: this.get('n')
      }
    }
  , getScore: function(number) {
      var num = number || this.get('number')
      if(num < 3) {
        return 0
      }
      var score = 3
      while((num /= 2) >= 3) {
        score *= 3
      }
      return score
    }
  })

  return Tile
})
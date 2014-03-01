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
  , merge: function(toBeMerged, direction) {
      var self = this
      var num = this.get('number') + toBeMerged.get('number')
      this.moveTo(toBeMerged.get('m'), toBeMerged.get('n'))
      this.view.once('move:done', function() {
        toBeMerged.destroy()
        self.set('number', num)
      })
    }
  })

  return Tile
})
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
  , move: function(direction, canceled) {
      if(canceled) {
        this.trigger('change_back')
        return
      }
      var m = this.get('m')
      var n = this.get('n')
      switch (direction) {
        case 'up':    m--; break;
        case 'right': n++; break;
        case 'down':  m++; break;
        case 'left':  n--; break;
        default: break;
      }
      this.set({m: m, n: n})
    }
  })

  return Tile
})
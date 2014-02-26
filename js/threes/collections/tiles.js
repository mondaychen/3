define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
, 'threes/models/tile'
], function($, _, Backbone, app, TileModel) {

  var matrixManager = function () {
    
  }

  var Tiles = Backbone.Collection.extend({
    model: TileModel
  , initialize: function(models, options) {
      this.plate = options.plate
    }
  , addOne: function(number, m, n, direction) {
      this.add({
        number: number
      , m: m
      , n: n
      }, {plate: this.plate})
    }
  })

  return Tiles
})
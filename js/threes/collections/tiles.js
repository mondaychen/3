define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
, 'threes/models/tile'
, 'threes/modules/matrix_manager'
], function($, _, Backbone, app, TileModel, MatrixManager) {

  var Tiles = Backbone.Collection.extend({
    model: TileModel
  , initialize: function(models, options) {
      var self = this
      this.plate = options.plate

      this.matrixManager = new MatrixManager(4, 4, {
        conflictTest: function(m1, m2) {
          if(!m1 || !m2) {
            return true
          }
          var n1 = m1.get('number')
          var n2 = m2.get('number')
          if(n1 + n2 === 3) {
            return true
          } else if(n1 + n2 > 3 && n1 === n2) {
            return true
          }
          return false
        }
      })
      this.matrixManager.on('model:merge', function(model, toBeMerged) {
        model.merge(toBeMerged)
      })
      this.matrixManager.on('model:moveTo', function(model, m, n) {
        model.moveTo(m, n)
      })

      this.on('add', function(model) {
        this.matrixManager.set(model, model.get('m'), model.get('n'))
      }, this)
      this.on('move:done', function() {
        // this means the animation is done
        app.trigger('swiper:unfreeze')
      })
    }
  , addOne: function(number, m, n, direction) {
      var model = new this.model({
        number: number
      , m: m
      , n: n
      }, {plate: this.plate})
      this.add(model)
    }
  , preview: function(direction, distance) {
      var movables = this.matrixManager.getMovables(direction)
      _.each(movables, function(model) {
        model.view.preview(direction, distance)
      })
    }
  , move: function(direction, canceled) {
      var movables = this.matrixManager.getMovables(direction)
      if(!movables.length) {
        return
      }
      if(canceled) {
        _.each(movables, function(model) {
          model.trigger('change_back')
        })
        return
      }
      app.trigger('swiper:freeze')
      this.matrixManager.doMove(direction)
    }
  })

  return Tiles
})
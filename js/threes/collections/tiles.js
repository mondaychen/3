define([
  'jquery'
, 'underscore'
, 'backbone'
, 'threes/app'
, 'threes/models/tile'
], function($, _, Backbone, app, TileModel) {

  var defaults = {
    conflictTest: $.noop
  }

  var MatrixManager = function(row, column, config) {
    this.row = row
    this.column = column
    this.settings = _.extend(defaults, config)
    this.matrix = []

    var emptyRow = []
    _.times(column, function(n) {
      emptyRow.push(null)
    })
    _.times(row, function(n) {
      this.matrix.push(_.clone(emptyRow))
    }, this)
  }

  _.extend(MatrixManager.prototype, Backbone.Events, {
    set: function(model, m, n, replace) {
      if(m >= this.row || n >= this.column) {
        return false
      }
      if(!replace && this.matrix[m][n]) {
        return false
      }
      this.matrix[m][n] = model
      return model
    }
  , getAt: function(m, n) {
      return this.matrix[m][n]
    }
  , getMovables: function(direction) {
      var self = this
      var matrix = this.matrix
      var conflictTest = self.settings.conflictTest
      var movables = []

      if(direction === 'up' || direction === 'down') {
        var reduceMethod = direction === 'up' ? 'reduce' : 'reduceRight'
        var firstRow = direction === 'up' ? 0 : self.row - 1
        _[reduceMethod](matrix, function(memo, row, rowIdx) {
          memo = _.clone(memo)
          if(rowIdx === firstRow) {
            return row
          }
          _.each(row, function(model, columnIdx) {
            var canMove = conflictTest(model, memo[columnIdx])
            memo[columnIdx] = model && (canMove ? null : model)
            if(model && canMove) {
              movables.push(model)
            }
          })
          return memo
        }, [])
      } else {
        var reduceMethod = direction === 'left' ? 'reduce' : 'reduceRight'
        var firstIdx = direction === 'left' ? 0 : self.column - 1
        _.each(matrix, function(row, rowIdx) {
          _[reduceMethod](row, function(memo, model, columnIdx) {
            if(columnIdx === firstIdx) {
              return model
            }
            var canMove = conflictTest(model, memo)
            if(model && canMove) {
              movables.push(model)
            }
            return canMove ? null : model
          }, null)
        })
      }
      return movables
    }
  , doMove: function(direction) {
      var self = this
      _.each(this.getMovables(direction), function(model) {
        var m = model.get('m')
        var n = model.get('n')
        self.set(null, m, n, true)

        switch (direction) {
          case 'up':    m--; break;
          case 'right': n++; break;
          case 'down':  m++; break;
          case 'left':  n--; break;
          default: break;
        }
        var toBeMerged = self.getAt(m, n)
        if(toBeMerged) {
          model.merge(toBeMerged)
        } else {
          model.moveTo(m, n)
        }
        self.set(model, m, n, true)
      })
    }
  })

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
      this.matrixManager.on('merge', function(m1, m2) {
        m1.trigger('merged', m2.get('number'))
        m2.destroy()
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
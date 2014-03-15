define([
  'jquery'
, 'underscore'
, 'backbone'
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

    this._lastMoved = []
    this.resetCache()
  }

  _.extend(MatrixManager.prototype, Backbone.Events, {
    resetCache: function() {
      this._movables = {}
    }
  , set: function(model, m, n, replace) {
      if(m >= this.row || n >= this.column) {
        return false
      }
      if(!replace && this.matrix[m][n]) {
        return false
      }
      this.matrix[m][n] = model
      this.resetCache()
      return model
    }
  , getAt: function(m, n) {
      return this.matrix[m][n]
    }
  , getAll: function() {
      return _.clone(this.matrix)
    }
  , getMovables: function(direction) {
      if(this._movables[direction]) {
        return this._movables[direction]
      }
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
      return this._movables[direction] = movables
    }
  , doMove: function(direction) {
      var self = this
      var movables = this.getMovables(direction)
      _.each(movables, function(model) {
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
          self.trigger('model:merge', model, toBeMerged)
        } else {
          self.trigger('model:moveTo', model, m, n)
        }
        self.set(model, m, n, true)
      })

      this._lastMoved = _.clone(movables)
      this.resetCache()
    }
  , getLastMoved: function() {
      return _.clone(this._lastMoved) || []
    }
  })

  return MatrixManager
})
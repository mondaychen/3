define([
  'underscore'
], function (_) {
  var Pool = function(size, divisor, generator, retryTimes) {
    this.size = size
    this.divisor = divisor
    this.generator = generator
    this.retryTimes = retryTimes || 5

    this.currentPool = []
    this.currentTrial = 0
  }

  _.extend(Pool.prototype, {
    get: function() {
      var i = this.generator()
      var count = _.filter(this.currentPool, function(num) {
        return num === i
      }).length
      if(count > this.size / this.divisor
        && this.currentTrial < this.retryTimes) {
        this.currentTrial++
        return this.get()
      }
      this.currentTrial = 0
      this.currentPool.push(i)
      if(this.currentPool.length >= this.size) {
        this.currentPool = []
      }
      return i
    }
  })

  return Pool
})
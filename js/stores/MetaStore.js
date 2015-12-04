var EventEmitter = require('events').EventEmitter
var _ = require('lodash')
var request = require('request')
var meta = null

var DataStore = _.extend({}, EventEmitter.prototype, {
  init: function () {
    var that = this
    setInterval(function go () {
      request.get('https://muncher:80/api/v0/meta',
        function (e, r, b) {
          try {
            meta = JSON.parse(b)
            that.emitChange()
          } catch(e) {}
        })
      return go
    }(), 10000)
  },
  get: function () {
    return meta
  },
  emitChange: function () {
    console.log('emitChange : metastore')
    this.emit('change')
  },
  addChangeListener: function (callback) {
    this.on('change', callback)
  },
  removeChangeListener: function (callback) {
    this.removeListener('change', callback)
  }
})

exports = module.exports = DataStore

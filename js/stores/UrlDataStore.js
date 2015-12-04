var EventEmitter = require('events').EventEmitter
var _ = require('lodash')
var request = require('request')

var tsd = null

var DataStore = _.extend({}, EventEmitter.prototype, {
  init: function () {
    var that = this
    var teams = null
    setInterval(function go () {
      ;(function () {
        request.get('https://muncher:80/api/v0/teams',
          function (e, r, b) {
            teams = JSON.parse(b)
            request.get('https://muncher:80/api/v0/tsd', function (e, r, b) {
              if (e) {
                console.error('e', e)
              } else {
                tsd = JSON.parse(b)
                tsd.teams = _.cloneDeep(teams) || {'res': [], 'enl': []}
                that.emitChange()
              }
            })
          })
      })()

      return go
    }(), 10000)
  },
  get: function (url) {
    return tsd || {}
  },
  emitChange: function () {
    console.log('emitChange : urldatastore')
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

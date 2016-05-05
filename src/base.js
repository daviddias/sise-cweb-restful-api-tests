var test = require('tape')
// var wreck = require('wreck')
var SISEDB = require('sise-db')

module.exports = function (migrations, api) {
  var db
  process.env.PORT = '10000'

  test('create sise db', function (t) {
    db = new SISEDB()
    t.ok(db, 'sise-db instantiated correctly')
    t.end()
  })

  test('import test data', function (t) {
    db.import(migrations)
    t.deepEqual(migrations, db.export())
    t.end()
  })

  test('start the API', function (t) {
    api.start(db, function (err, info) {
      t.ifErr(err)
      t.end()
    })
  })

  test('get insurance types', function (t) {
    t.end()
  })

  test('request a new quote', function (t) {
    t.end()
  })

  test('get quotes for a user', function (t) {
    t.end()
  })

  test('handle turbolence', function (t) {
    t.end()
  })

  test('service is a tad slow', function (t) {
    // make sure that get can't return something that was just posted and have to wait for 10 secs)
    t.end()
  })

  test('stop the API', function (t) {
    api.stop(function (err) {
      t.ifErr(err)
      t.end()
    })
  })
}

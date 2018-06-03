var test = require('tape')
var wreck = require('wreck')
var SISEDB = require('sise-cweb-db')

module.exports = function (migrations, api) {
  var db
  process.env.PORT = '10000'
  var url = 'http://localhost:10000'

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

  // BASIC TESTS

  test('get insurance types', function (t) {
    wreck.get(url + '/insurance', { json: true }, function (err, res, payload) {
      t.ifErr(err)
      var expected = Object.keys(migrations.insurances).map((key) => {
        return { id: key, name: migrations.insurances[key].name }
      })
      t.deepEqual(payload, expected)
      t.end()
    })
  })

  test('get the devices insurance info', function (t) {
    var key = '6b3a331b7ebd1842a6bbd56755ebbfc6'
    var expected = migrations.insurances[key]

    wreck.get(url + '/insurance/' + key, { json: true }, function (err, res, payload) {
      t.ifErr(err)
      t.deepEqual(payload, expected)
      t.end()
    })
  })

  var quoteId

  test('request a new quote', function (t) {
    wreck.post(url + '/insurance/quote', {
      payload: JSON.stringify({
        quote: {
          insurance: 'Car',
          value: 200000,
          user: {
            name: 'Jessy',
            email: 'callme@maybe.com',
            nif: '112233445'
          }
        }
      }),
      json: true
    }, function (err, res, payload) {
      t.ifErr(err)
      t.ok(payload, 'payload should not be undefined')
      if (payload) {
        quoteId = payload.id
        t.ok(payload.id)
      }
      t.end()
    })
  })

  test('get a quote (by ID)', function (t) {
    wreck.get(url + '/insurance/quote?id=' + quoteId, {
      json: true
    }, function (err, res, payload) {
      t.ifErr(err)
      t.ok(payload, 'payload should not be undefined')
      if (payload) {
        var expected = {
          insurance: 'Car',
          value: 200000
        }
        t.equal(payload.insurance, expected.insurance)
        t.equal(payload.value, expected.value)
      }
      t.end()
    })
  })

  // ADVANCED TESTS

  /*
  test.skip('handle turbolence', function (t) {
    t.end()
  })

  test.skip('service is a tad slow', function (t) {
    // make sure that get can't return something that was just posted and have to wait for 10 secs)
    t.end()
  })
  */

  test('stop the API', function (t) {
    api.stop(function (err) {
      t.ifErr(err)
      t.end()
    })
  })
}

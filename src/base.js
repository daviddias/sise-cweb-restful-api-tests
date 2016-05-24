var test = require('tape')
var wreck = require('wreck')
var SISEDB = require('sise-db')

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
      var expected = [
        { id: 'aaaa', name: 'Base' },
        { id: 'aaab', name: 'Electronic Devices' },
        { id: 'aaac', name: 'Fire Hazards' },
        { id: 'aaad', name: 'Theft' },
        { id: 'aaae', name: 'Natural Disasters' }
      ]
      t.deepEqual(payload, expected)
      t.end()
    })
  })

  test('get property times types', function (t) {
    wreck.get(url + '/property', { json: true }, function (err, res, payload) {
      t.ifErr(err)
      var expected = [
        'Apartment T0',
        'Apartment T1',
        'Apartment T2',
        'Apartment T3',
        'Apartment T4',
        'Apartment T5',
        'Apartment T6',
        'Castle',
        'Cozy bridge'
      ]
      t.deepEqual(payload, expected)
      t.end()
    })
  })

  test('get the devices insurance info', function (t) {
    wreck.get(url + '/insurance/aaab', { json: true }, function (err, res, payload) {
      t.ifErr(err)
      var expected = {
        name: 'Electronic Devices',
        description: 'Covers problems related with devices such as washing machine, fridge, etc, up to 5000 in repairs'
      }
      t.deepEqual(payload, expected)
      t.end()
    })
  })

  var quoteId

  test('request a new quote', function (t) {
    wreck.post(url + '/insurance/quote', {
      payload: JSON.stringify({
        quote: {
          insurances: [
            'Base'
          ],
          property: {
            type: 'Cozy Bridge',
            year: 1987,
            value: 200000,
            area: 100
          },
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
      quoteId = payload.quoteId
      t.ok(payload.quoteId)
      t.end()
    })
  })

  test('get quotes for a user (by NIF)', function (t) {
    wreck.get(url + '/insurance/quote?nif=112233445', {
      json: true
    }, function (err, res, payload) {
      t.ifErr(err)
      var expected = [
        {
          insurances: ['Base'],
          property: {
            type: 'Cozy Bridge',
            year: 1987,
            value: 200000,
            area: 100
          }
        }
      ]
      t.deepEqual(payload[0].insurances, expected[0].insurances)
      t.deepEqual(payload[0].property, expected[0].property)
      t.end()
    })
  })

  test('get a quote (by ID)', function (t) {
    wreck.get(url + '/insurance/quote?id=' + quoteId, {
      json: true
    }, function (err, res, payload) {
      t.ifErr(err)
      var expected = {
        insurances: [ 'Base' ],
        property: {
          area: 100,
          type: 'Cozy Bridge',
          value: 200000,
          year: 1987
        }
      }
      t.deepEqual(payload.insurances, expected.insurances)
      t.deepEqual(payload.property, expected.property)
      t.end()
    })
  })

  // ADVANCED TESTS

  /*
  test.skip('fail to get quotes of non existing user', function (t) {
    t.end()
  })

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

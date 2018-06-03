sise-cweb-restful-api-tests
===========================

[![](https://img.shields.io/badge/INESC-GSD-brightgreen.svg?style=flat-square)](http://www.gsd.inesc-id.pt/)
[![](https://img.shields.io/badge/TÉCNICO-LISBOA-blue.svg?style=flat-square)](http://tecnico.ulisboa.pt/)
[![](https://img.shields.io/badge/SISE-CWEB-brightgreen.svg?style=flat-square)](http://tecnico.ulisboa.pt/)

> Tests for your CWEB project

# Usage

Install the module in your own project as a dependency

```sh
> npm install sise-restful-api-tests
```

Then create a `test.js` file with the following

```JavaScript
// Migrations Data
var migrations = require('../node_modules/sise-db/test/migrations.json')

// Your RESTful HTTP API implementation entry point
var api = require('../src/index.js')

// This are the tests that will be run
var test = require('sise-cweb-restful-api-tests').base

// Run the tests
test(migrations, api)
```

Then, run that script by doing

```sh
> node test.js
```

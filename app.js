'use strict';

var request = require('request-promise');

var db = require('./models');
var indexCrawler = require('./crawlers/indexCrawler');
var citiesCrawler = require('./crawlers/citiesCrawler');
var stationsCrawler = require('./crawlers/stationsCrawler');

function log(msg) {
  console.log(msg);
}

function executeSequentially(promiseFactories) {
  var result = Promise.resolve();
  promiseFactories.forEach(function (promiseFactory) {
    result = result.then(promiseFactory);
  });
  return result;
}

var runCrawler = new Promise(function(resolve, reject) {
  indexCrawler()
  .then(function(results) {
    var promises = [];

    results.fuels.forEach(function (fuel) {
      results.states.forEach(function (state) {
        promises.push(citiesCrawler(results.week, fuel, state));
      });
    });

    return Promise.all(promises);
  })
  .then(function (resolves) {
    return executeSequentially(
      resolves.map(function (obj) {
        return function () { // This is a promise factory.
          Promise.all(
            obj.cities.map(
              function (city) { return stationsCrawler(obj.week, obj.fuel, city); }
            )
          );
        };
      })
    );
  })
  .catch(function (err) { log(err); });
});

db.sequelize.sync({force:  true})
  .then(function () {
    log('Connection has been established successfully. Starting.');

    return;
  })
  .then(runCrawler)
  .catch(function (err) { log(err); });

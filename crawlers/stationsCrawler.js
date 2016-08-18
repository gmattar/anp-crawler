'use strict';

var request = require('request-promise');
var cheerio = require('cheerio');

var db = require('../models');

function toFloat(val) {
  return parseFloat(val.replace(/,/g, '.')) || null;
}

function log(msg) {
  console.log(msg);
}

module.exports = function (week, fuel, city) {
  return new Promise(function (resolve, reject) {
    var options = {
      uri: 'http://www.anp.gov.br/preco/prc/Resumo_Semanal_Posto.asp',
      form: {
        cod_Semana: week.cod_Semana,
        selMunicipio: city,
        cod_combustivel: fuel.value.split('*')[0]
      },
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      transform: function (body) { return cheerio.load(body); }
    };

    return request(options)
      .then(function ($) {
        $('.table_padrao > tr').each(function () {
          var cols = $(this).children();

          if ($(this).index() >= 2 && cols.eq(1).text().trim()) {
            log('Station obtained: ' + cols.eq(1).text());

            db.models.Stations.create({
              CityId: city,
              name: cols.eq(1).text(),
              address: cols.eq(2).text(),
              area: cols.eq(3).text(),
              flag: cols.eq(4).text()
            })
            .then(function (stationRef) {
              db.models.Prices.create({
                WeekId: week.cod_Semana,
                StationId: stationRef.id,
                type: fuel.name,
                sellPrice: toFloat(cols.eq(5).text()),
                buyPrice: toFloat(cols.eq(6).text()),
                saleMode: cols.eq(5).text(),
                provider: cols.eq(6).text()
              })
              .then(function (result) {
                resolve(result);
              });
            });
          }
        });
      })
      .catch(function () { return; });
  });
};

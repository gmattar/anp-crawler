'use strict';

var request = require('request-promise');
var cheerio = require('cheerio');
var uuid = require('uuid-v4');

var db = require('../models');

function toFloat(val) {
  return parseFloat(val.replace(/,/g, '.')) || null;
}

function log(msg) {
  console.log(msg);
}

module.exports = function (week, fuel, state) {
  return new Promise(function (resolve, reject) {
    var stats = [];
    var cities = [];
    var options = {
      uri: 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Municipio.asp',
      form: {
        selEstado: state.value,
        selSemana: week.selSemana,
        cod_Semana: week.cod_Semana,
        desc_Semana: week.desc_Semana,
        selCombustivel: fuel.value
      },
      method: 'POST',
      transform: function (body) { return cheerio.load(body); }
    };

    return request(options)
      .then(function ($) {
        $('.table_padrao > tr').each(function () {
          if ($(this).index() > 2) {
            var cols = $(this).children();
            var href = cols.eq(0).children('a').attr('href');
            var doc1 = {};
            var doc2 = {};

            doc1.id = href.replace("javascript:Direciona('", '').slice(0, -3);
            doc1.name = cols.eq(0).text();
            doc1.state = state.name;

            doc2.id = uuid();
            doc2.WeekId = week.cod_Semana;
            doc2.CityId = doc1.id;
            doc2.type = fuel.name;
            doc2.consumerAveragePrice = toFloat(cols.eq(3).text());
            doc2.consumerStandardDeviation = toFloat(cols.eq(4).text());
            doc2.consumerMinPrice = toFloat(cols.eq(5).text());
            doc2.consumerMaxPrice = toFloat(cols.eq(6).text());
            doc2.consumerAverageMargin = toFloat(cols.eq(7).text());
            doc2.distributionAveragePrice = toFloat(cols.eq(8).text());
            doc2.distributionStandardDeviation = toFloat(cols.eq(9).text());
            doc2.distributionMinPrice = toFloat(cols.eq(10).text());
            doc2.distributionMaxPrice = toFloat(cols.eq(11).text());
            doc2.distributionAverageMargin = toFloat(cols.eq(12).text());

            log('City obtained: ' + doc1.name);

            stats.push(doc2);
            cities.push(doc1);
          }
        });

        return db.models.Cities.findAll({
          where: { id: { $in: cities.map(function (i) { return i.id; }) } },
          attributes: ['id']
        });
      })
      .then(function (foundCities) {
        var ids = foundCities.map(function (i) { return i.id; });

        return db.models.Cities.bulkCreate(
          cities.filter(function (city) { return ids.indexOf(city.id) < 0; })
        );
      })
      .then(function () {
        return db.models.Statistics.bulkCreate(stats);
      })
      .then(function () {
        var ids = cities.map(function (i) { return i.id; });

        return resolve({ week: week, fuel: fuel, cities: ids });
      })
      .catch(function () { return; });
  });
};

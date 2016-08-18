'use strict';

var request = require('request-promise');
var cheerio = require('cheerio');

var db = require('../models');

function getStates($) {
  var lst = [];

  $('select[name="selEstado"] option').each(function (idx, item) {
    lst.push({ name: $(item).text(), value: $(item).attr('value') });
  });

  return lst;
}

function getFuels($) {
  var lst = [];

  $('#selCombustivel option').each(function (idx, item) {
    lst.push({ name: $(item).text(), value: $(item).attr('value') });
  });

  return lst;
}

function getWeek($) {
  var dic = {};

  dic.selSemana = $('input[name="selSemana"]').val();
  dic.cod_Semana = $('input[name="cod_Semana"]').val();
  dic.desc_Semana = $('input[name="desc_Semana"]').val();

  return dic;
}

function cleanUpWeek(week) {
  var dateIni = week.desc_Semana.split(' ')[1].split('/');
  var dateEnd = week.desc_Semana.split(' ')[3].split('/');
  var dic = {};

  dic.from = new Date(dateIni[2], dateIni[1] - 1, dateIni[0]);
  dic.to = new Date(dateEnd[2], dateEnd[1] - 1, dateEnd[0]);
  dic.id = week.cod_Semana;

  return dic;
}

function log(msg) {
  console.log(msg);
}

module.exports = function () {
  return new Promise(function (resolve, reject) {
    var week = {};
    var fuels = [];
    var states = [];

    return request({
      uri: 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Index.asp',
      transform: function (body) { return cheerio.load(body); }
    })
    .then(function ($) {
      week = getWeek($);
      fuels = getFuels($);
      states = getStates($);

      // Verify if the week is already synced.
      return db.models.Weeks.findById(week.cod_Semana);
    })
    .then(function (found) {
      if (!found) {
        log('Syncing week.');

        return db.models.Weeks.create(cleanUpWeek(week));
      }
      else { reject(new Error('Week already synced.')); }
    })
    .then(function () { resolve({ week: week, fuels: fuels, states: states }); })
    .catch(function () { return; });
  });
};

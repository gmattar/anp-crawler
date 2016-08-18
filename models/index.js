'use strict';

var fs = require('fs');
var path = require('path');
var config = require('config');
var Sequelize = require('sequelize');

var db = { models: {} };
var sequelize = new Sequelize(
  config.get('db.database'),
  config.get('db.username'),
  config.get('db.password'),
  {
    host: config.get('db.host'),
    dialect: 'postgres',
    logging: false
  }
);

fs.readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));

    db.models[model.name] = model;
  });

Object.keys(db.models).forEach(function (key) {
  if ('associate' in db.models[key]) {
    db.models[key].associate(db.models);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

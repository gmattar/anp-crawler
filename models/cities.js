'use strict';

module.exports = function (sequelize, DataType) {
  var Cities = sequelize.define('Cities',
    {
      id: {
        type: DataType.STRING,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataType.STRING,
        allowNull: false
      },
      state: {
        type: DataType.STRING,
        allowNull: false
      }
    },
    {
      tableName: 'cities',
      timestamps: false,
      paranoid: false,
      classMethods: {
        associate: function (models) {
          Cities.hasMany(models.Stations);
          Cities.hasMany(models.Statistics);
        }
      }
    }
  );

  return Cities;
};

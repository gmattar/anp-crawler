'use strict';

module.exports = function (sequelize, DataType) {
  var Stations = sequelize.define('Stations',
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: DataType.STRING,
        allowNull: false
      },
      address: {
        type: DataType.STRING,
        allowNull: true
      },
      area: {
        type: DataType.STRING,
        allowNull: true
      },
      flag: {
        type: DataType.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'stations',
      timestamps: false,
      paranoid: false,
      classMethods: {
        associate: function (models) {
          Stations.hasMany(models.Prices);
          Stations.belongsTo(models.Cities);
        }
      }
    }
  );

  return Stations;
};


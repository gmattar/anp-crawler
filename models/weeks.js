'use strict';

module.exports = function (sequelize, DataType) {
  var Weeks = sequelize.define('Weeks',
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
      },
      to: {
        type: DataType.DATE,
        allowNull: false
      },
      from: {
        type: DataType.DATE,
        allowNull: false
      }
    },
    {
      tableName: 'weeks',
      timestamps: false,
      paranoid: false,
      classMethods: {
        associate: function (models) {
          Weeks.hasMany(models.Statistics);
          Weeks.hasMany(models.Prices);
        }
      }
    }
  );

  return Weeks;
};

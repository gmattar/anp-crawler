'use strict';

module.exports = function (sequelize, DataType) {
  var Prices = sequelize.define('Prices',
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      type: {
        type: DataType.STRING,
        allowNull: false
      },
      sellPrice: {
        type: DataType.DECIMAL(10, 3),
        allowNull: true
      },
      buyPrice: {
        type: DataType.DECIMAL(10, 3),
        allowNull: true
      },
      saleMode: {
        type: DataType.STRING(10),
        allowNull: true
      },
      provider: {
        type: DataType.STRING(20),
        allowNull: true
      }
    },
    {
      tableName: 'prices',
      timestamps: false,
      paranoid: false,
      classMethods: {
        associate: function (models) {
          Prices.belongsTo(models.Stations);
          Prices.belongsTo(models.Weeks);
        }
      }
    }
  );

  return Prices;
};



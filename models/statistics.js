'use strict';

module.exports = function (sequelize, DataType) {
  var Statistics = sequelize.define('Statistics',
    {
      id: {
        type: DataType.STRING,
        primaryKey: true,
        allowNull: false
      },
      type: {
        type: DataType.STRING,
        allowNull: false
      },
      consumerAveragePrice: {
        type: DataType.DECIMAL(10, 3),
        allowNull: true
      },
      consumerStandardDeviation: {
        type: DataType.DECIMAL(10, 3),
        allowNull: true
      },
      consumerMinPrice: {
        type: DataType.DECIMAL(10, 3),
        allowNull: true
      },
      consumerMaxPrice: {
        type: DataType.DECIMAL(10, 3),
        allowNull: true
      },
      consumerAverageMargin: {
        type: DataType.DECIMAL(10, 3),
        allowNull: true
      },
      distributionAveragePrice: {
        type: DataType.DECIMAL(10, 3),
        allowNull: true
      },
      distributionStandardDeviation: {
        type: DataType.DECIMAL(10, 3),
        allowNull: true
      },
      distributionMinPrice: {
        type: DataType.DECIMAL(10, 3),
        allowNull: true
      },
      distributionMaxPrice: {
        type: DataType.DECIMAL(10, 3),
        allowNull: true
      }
    },
    {
      tableName: 'statistics',
      timestamps: false,
      paranoid: false,
      classMethods: {
        associate: function (models) {
          Statistics.belongsTo(models.Cities);
          Statistics.belongsTo(models.Weeks);
        }
      }
    }
  );

  return Statistics;
};

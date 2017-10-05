

module.exports = function (sequelize, DataTypes) {

  var paymentSystem = sequelize.define('paymentSystem',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING
      },
      params: {
        type: DataTypes.JSON
      }
    },
    {
      classMethods: {
        associate: function (models) {
          paymentSystem.hasMany(models.BillingInformationCompany, { foreignKey: 'paymentSystemId' , foreignKeyConstraint: true });
        }
      },
      tableName: 'payment_system',
      timestamps: false
    }
  );

  return paymentSystem;
};


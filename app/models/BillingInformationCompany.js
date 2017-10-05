

module.exports = function (sequelize, DataTypes) {

  var BillingInformationCompany = sequelize.define('BillingInformationCompany',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      enterpriseId: {
        type: DataTypes.INTEGER,
        references: "lombard_enterprise",
        referencesKey: "id"
      },
      paymentSystemId: {
        type: DataTypes.INTEGER,
        references: "payment_system",
        referencesKey: "id"
      },
      params: {
        type: DataTypes.JSON
      }
    },
    {
      tableName: 'billing_information_enterprise', //платежные реквезиты компании
      timestamps: false
    }
  );

  return BillingInformationCompany;
};




module.exports = function (sequelize, DataTypes) {

  var LombardEnterprise = sequelize.define('LombardEnterprise',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      edrpou: {
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      }
    },
    {
      classMethods: {
        associate: function (models) {
          LombardEnterprise.hasMany(models.BillingInformationCompany, { foreignKey: 'enterpriseId' , foreignKeyConstraint: true });
          LombardEnterprise.hasMany(models.LombardPledgeContract, { foreignKey: 'enterpriseId' , foreignKeyConstraint: true });
        }
      },
      tableName: 'lombard_enterprise',
      timestamps: false
    }
  );

  return LombardEnterprise;
};


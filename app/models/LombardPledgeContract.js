var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {

  var LombardPledgeContract = sequelize.define('LombardPledgeContract',
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
      seriesOfContract: {
        type: DataTypes.STRING
      },
      numberOfContract: {
        type: DataTypes.STRING
      },
      contractId: {
        type: DataTypes.STRING,
        unique: true
      },
      pinCode: {
        type: DataTypes.STRING
      },
      paymentInEndOfTerm: {
        type: DataTypes.INTEGER,
        comment: "флаг оплаты в конце срока (1 - конце, 0 - сразу)"
      },
      fio: {
        type: DataTypes.STRING
      },
      periodName: {
        type: DataTypes.STRING,
        comment: "название периода (день, неделя, месяц, год, произвольный)"
      },
      periodPrice: {
        type: DataTypes.DECIMAL(10, 2),
        comment: "цена одного периода продления (в случае оплаты сразу paymentInEndOfTerm = 0)"
      },
      paymentAmount: {
        type: DataTypes.DECIMAL(10, 2),
        comment: "сумма к оплате (в случае оплаты в конце paymentInEndOfTerm = 1)"
      },
      numberPaymentPeriods: {
        type: DataTypes.INTEGER,
        comment: "кол-во периодов к оплате (в случае оплаты в конце paymentInEndOfTerm = 1)"
      },
      dateTimeDataLoad: {
        type: DataTypes.DATE,
        comment: "дата-время загрузки данных",
      defaultValue: sequelize.fn('NOW')
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      limitExtension: {
        type: DataTypes.INTEGER,
        comment: "ограничение продления (в периодах)"
      },
      contractAlgorithm: {
        type: DataTypes.STRING,
        comment: "название алгоритма договора"
      },
      contractBeginDate: {
        type: DataTypes.DATEONLY,
        comment: "дата начала договора"
      },
      contractEndDate: {
      type: DataTypes.DATEONLY,
      comment: "дата завершения договора"
    }
  },
    {
      classMethods: {
        associate: function (models) {
          LombardPledgeContract.hasMany(models.LombardTransaction, { foreignKey: 'contractId' , foreignKeyConstraint: true });
        },
        getSeriesOfContract: function() {
          return sequelize.query('SELECT DISTINCT "seriesOfContract" as series FROM lombard_pledge_contract WHERE "seriesOfContract" NOTNULL;', { type: sequelize.QueryTypes.SELECT});
        },
        checkContract: function(seriesOfContract, numberContract, pinCode) {
          return sequelize.query('SELECT id \
                                  FROM lombard_pledge_contract \
                                  WHERE "seriesOfContract" = ? AND "numberOfContract" = ? AND "pinCode" = ? AND "isDeleted" = FALSE', null, {raw: true, type: sequelize.QueryTypes.SELECT},
            [seriesOfContract, numberContract, pinCode]);
        },
        getContractDataById: function (id) {
          return sequelize.query('SELECT * \
                                  FROM lombard_pledge_contract \
                                  WHERE "id" = ' + id + ';', { type: sequelize.QueryTypes.SELECT});
        }
      },
      tableName: 'lombard_pledge_contract',// Ломбард Договора Залога
      timestamps: false
    }
  );

  return LombardPledgeContract;
};


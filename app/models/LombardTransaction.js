var transactionOptions = {
  operationType: {
    extension: 0
  }
};

module.exports = function (sequelize, DataTypes) {

  var LombardTransaction = sequelize.define('LombardTransaction',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      contractId: {
        type: DataTypes.STRING,
        references: "lombard_pledge_contract",
        referencesKey: "contractId"
      },
      transactionCreatedAt: {
        type: DataTypes.DATE,
        comment: "дата-время создания транзакции",
        defaultValue: sequelize.fn('NOW')
      },
      paymentAmount: {
        type: DataTypes.DECIMAL(10, 2),
        comment: "сума платежа"
      },
      numberPeriodsOfExtension: {
        type: DataTypes.INTEGER,
        comment: "кол периодов продления"
      },
      amountOfExtension: {
        type: DataTypes.DECIMAL(10, 2),
        comment: "сума продления"
      },
      operationType: {
        type: DataTypes.INTEGER,
        comment: "тип операции (продление - 0)"
      },
      transactionReference: {
        type: DataTypes.STRING
      },
      timeOfPayment: {
        type: DataTypes.DATE,
        comment: "дата-время проведения платежа"
      },
      paymentSystemType: {
        type: DataTypes.STRING,
        comment: "тип платежной системы (из справочника)"
      },
      dateOfDischarge: {
        type: DataTypes.DATEONLY,
        comment: "дата выргузки в исходную систему (ломбард)"
      },
      paymentAccount: {
        type: DataTypes.STRING,
        comment: "расчетный счет"
      },
      payerPhone: {
        type: DataTypes.STRING
      },
      payerEmail: {
        type: DataTypes.STRING
      },
      paymentReceived: {
        type: DataTypes.INTEGER,
        comment: "флаг принятия платежа"
      },
      isReceivedPaymentSend: {
        type: DataTypes.INTEGER,
        comment: "флаг отправленной квитанции о принятии платежа"
      },
      paymentComplete: {
        type: DataTypes.INTEGER,
        comment: "флаг проведения платежа"
      },
      isCompletePaymentSend: {
        type: DataTypes.INTEGER,
        comment: "флаг отправленной квитанции о проведении платежа"
      },
      extensionCode: {
        type: DataTypes.STRING,
        comment: "код продления (подтверждающий подлинность квитанции - геренируется в отделении)"
      },
      receipt: {
        type: DataTypes.BLOB
      }
      //receiptNumber: {
      //  type: DataTypes.STRING,
      //  comment: "номер квитанции"
      //},
      //city: {
      //  type: DataTypes.STRING
      //},
      //branchNumber: {
      //  type: DataTypes.STRING
      //},
      //receiptDate: {
      //  type: DataTypes.DATE,
      //  comment: "дата выписки квитанции"
      //}
    },
    {
      classMethods: {
        startPaymentTransaction: function(contractId, paymentAmount, numberPaymentPeriods, payerEmail, payerPhone) {
          return sequelize.query('INSERT INTO "lombard_transaction"("contractId", "paymentAmount", "numberPeriodsOfExtension", "operationType", "payerPhone", "payerEmail") \
          VALUES (?, ?, ?, ?, ?, ?);', null, {raw: true, type: sequelize.QueryTypes.INSERT},
            [contractId, paymentAmount, numberPaymentPeriods, transactionOptions.operationType.extension, payerPhone, payerEmail]);
        }
      },
      tableName: 'lombard_transaction',
      timestamps: false
    }
  );

  return LombardTransaction;
};


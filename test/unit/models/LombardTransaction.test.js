var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();
var db = require('../../../app/models');
var contractId;
var transactionId;
var contractOptions = {
  seriesOfContract: 'DD',
  "numberOfContract": '123123',
  "contractId": '123123',
  "pinCode": 123123,
  "paymentInEndOfTerm": 1,
  fio: '123123',
  "periodName": '123123',
  "periodPrice": 123123,
  "paymentAmount": 123123,
  "numberPaymentPeriods": 123123,
  "dateTimeDataLoad": '01-01-2000',
  "isDeleted": false,
  "contractType": '123123',
  "limitExtension": 123
};

var transactionOptions = {
  contractId: contractOptions.contractId,
  paymentAmount: 123,
  numberPeriodsOfExtension: 2,
  payerEmail: 'email@email.ru',
  payerPhone: '123123123'
};
exports.run = function () {
  describe('Lombard Transaction Model', function() {
    before(function(done){
      db.LombardPledgeContract.create(contractOptions)
        .then(function(data) {
          contractId = data.dataValues.id;
          done();
        });
    });

    it('should return series of contract', function (done) {
      db.LombardTransaction.startPaymentTransaction(transactionOptions.contractId, transactionOptions.paymentAmount, transactionOptions.numberPeriodsOfExtension, transactionOptions.payerEmail, transactionOptions.payerPhone)
        .then(function (data) {
          db.LombardTransaction.find({ where: transactionOptions})
            .then(function(data) {
              transactionId = data.dataValues.id;
              expect(data.dataValues.contractId).to.equal(transactionOptions.contractId);
              expect(data.dataValues.numberPeriodsOfExtension).to.equal(transactionOptions.numberPeriodsOfExtension);
              expect(data.dataValues.payerEmail).to.equal(transactionOptions.payerEmail);
              expect(data.dataValues.payerPhone).to.equal(transactionOptions.payerPhone);
              done();
          });

        });
    });

    after(function (done) {
      db.LombardTransaction.destroy({where: {id: transactionId}, force: true})
        .then(function () {
          db.LombardPledgeContract.destroy({where: {id: contractId}, force: true})
            .then(function () {
              done();
            });
        });
    });

  });
};

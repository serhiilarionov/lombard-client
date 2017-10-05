var chai = require('chai')
  , expect = chai.expect
  , should = chai.should()
  , db = require('../../../app/models');
var contractId;
var contractOptions = {
  seriesOfContract: 'DD',
  "numberOfContract": '123123',
  "contractId": '123123',
  "pinCode": 123123,
  "paymentInEndOfTerm": 1,
  fio: '123123',
  "periodName": '123123',
  "periodPrice": 123123,
  "paymentAmount": 123,
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
var request = require('superagent');
var url = 'http://localhost:3000';

exports.run = function () {
  describe('Manage payment controller', function() {
    before(function(done){
      db.LombardPledgeContract.create(contractOptions)
        .then(function(data) {
          contractId = data.dataValues.id;
          done();
        });
    });

    it('should return 200', function (done) {
      request
        .post(url + '/payment/start')
        .send({
          seriesOfContract: contractOptions.seriesOfContract,
          numberContract: contractOptions.numberOfContract,
          paymentAmount: transactionOptions.paymentAmount,
          payerEmail: transactionOptions.payerEmail,
          payerPhone: transactionOptions.payerPhone,
          numberPaymentPeriods: transactionOptions.numberPeriodsOfExtension,
          pinCode: contractOptions.pinCode
        })
        .end(function(error, res){
          //TODO модифицировать тест когда будет завершен контроллер WL-2
          res.status.should.be.equal(200);
          done();
        });
    });

    after(function (done) {
      db.LombardTransaction.find({ where: transactionOptions})
        .then(function(data) {
          var id = data.dataValues.id;
          db.LombardTransaction.destroy({where: {id: id}, force: true})
            .then(function () {
              db.LombardPledgeContract.destroy({where: {id: contractId}, force: true})
                .then(function () {
                  done();
                });
            });
        });
    });
  });

};

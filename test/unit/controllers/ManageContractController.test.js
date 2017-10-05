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
  "paymentAmount": 123123,
  "numberPaymentPeriods": 123123,
  "dateTimeDataLoad": '01-01-2000',
  "isDeleted": false,
  "contractType": '123123',
  "limitExtension": 123
};
var request = require('superagent');
var url = 'http://localhost:3000';

exports.run = function () {
  describe('Manage contract controller', function() {
    before(function(done){
      db.LombardPledgeContract.create(contractOptions)
        .then(function(data) {
          contractId = data.dataValues.id;
          done();
        });
    });

    it('should return series of pine code', function (done) {
      request
        .post(url + '/contract/get/series')
        .send({})
        .end(function(error, res){
          res.status.should.be.equal(200);
          expect(res.body.length).to.be.above(0);
          done();
        });
    });

    it('should check contract information and return ', function (done) {
      request
        .post(url + '/contract/check')
        .send({
          seriesOfContract: contractOptions.seriesOfContract,
          numberContract: contractOptions.numberOfContract,
          pinCode: contractOptions.pinCode
        })
        .end(function(error, res){
          res.status.should.be.equal(200);
          expect(res.body).to.include.keys('contractAlgorithm',
          'fio', 'contractType', 'limitExtension', 'numberPaymentPeriods',
            'paymentInEndOfTerm', 'periodName', 'periodPrice');

          done();
        });
    });

    after(function (done) {
      db.LombardPledgeContract.destroy({where: {id: contractId}, force: true})
        .then(function () {
          done();
        });
    });
  });
};

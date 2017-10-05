var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();
var db = require('../../../app/models');
var id;
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
exports.run = function () {
  describe('Lombard Pledge Agreement Model', function() {
    before(function(done){
      db.LombardPledgeContract.create(contractOptions)
        .then(function(data) {
          id = data.dataValues.id;
          done();
        });
    });

    it('should return series of contract', function (done) {
      db.LombardPledgeContract.getSeriesOfContract()
        .then(function (data) {
          expect(data.length).to.be.above(0);
          expect(data[0]).to.include.keys('series');
          done();
        });
    });

    it('should check contract and return id', function (done) {
      db.LombardPledgeContract.checkContract(contractOptions.seriesOfContract, contractOptions.numberOfContract, contractOptions.pinCode)
        .then(function (data) {
          expect(data.length).to.be.above(0);
          expect(data[0]).to.include.keys('id');
          done();
        });
    });

    it('should return information about contract to payer', function (done) {
      db.LombardPledgeContract.getContractDataById(id)
        .then(function (data) {
          expect(data.length).to.be.above(0);
          expect(data[0]).to.include.keys('fio', 'contractType', 'paymentInEndOfTerm',
                                          'periodName', 'periodPrice', 'paymentAmount',
                                          'numberPaymentPeriods', 'contractAlgorithm',
                                          'limitExtension');
          done();
        });
    });

    after(function (done) {
      db.LombardPledgeContract.destroy({where: {id: id}, force: true})
        .then(function () {
          done();
        });
    });

  });
};

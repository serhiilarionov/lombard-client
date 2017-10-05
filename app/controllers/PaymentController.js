var express = require('express'),
  router = express.Router(),
  db = require('../models');

var contractOptions = {
  payAtOnce: 0,
  payInEndOfTerm: 1
};
module.exports = function (app) {
  app.use('/', router);
};

router.post('/payment/start', function (req, res, next) {
  var seriesOfContract = req.param('seriesOfContract'),
    numberContract = req.param('numberContract'),
    paymentAmount = req.param('paymentAmount'),
    payerEmail = req.param('payerEmail'),
    payerPhone = req.param('payerPhone'),
    numberPaymentPeriods = req.param('numberPaymentPeriods'),
    pinCode = req.param('pinCode');
  db.LombardPledgeContract.checkContract(seriesOfContract, numberContract, pinCode)
    .then(function (data) {
      if(data.length) {
        db.LombardPledgeContract.getContractDataById(data[0].id)
          .then(function (data) {
            if(data.length) {
              var dbData = data[0];
              if(parseFloat(numberPaymentPeriods) <= dbData.limitExtension) {
                var checkAmount;
                if(dbData.paymentInEndOfTerm == contractOptions.payAtOnce) {
                  checkAmount = numberPaymentPeriods * dbData.periodPrice;
                }
                if(dbData.paymentInEndOfTerm == contractOptions.payInEndOfTerm) {
                  checkAmount = dbData.paymentAmount
                }
                if(parseFloat(paymentAmount) == checkAmount) {
                  db.LombardTransaction.startPaymentTransaction(dbData.contractId, checkAmount, numberPaymentPeriods, payerEmail, payerPhone)
                    .then(function () {
                      //TODO начать транзакцию с банком и передать ему номер транзакции и сумму платежа. WL-2
                      res.status(200).send("Start Transaction");
                    })
                    .catch(function () {
                      res.status(500).send("Server error");
                    });
                } else {
                  res.status(404).send('Incorrect amount');
                }
              } else {
                res.status(404).send('Incorrect number of periods');
              }
            } else {
              res.status(404).send('Data not found');
            }
          })
          .catch(function (err) {
            res.status(500).json('Server error');
          });
      } else {
        res.status(404).send('Data not match');
      }
    })
    .catch(function (err) {
      res.status(500).json('Server error');
    });
});

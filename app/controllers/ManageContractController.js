var express = require('express'),
  router = express.Router(),
  request = require('request'),
  db = require('../models'),
  config = require('../../config/SiteConfig.js');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/contract/series', function (req, res, next) {
  db.LombardPledgeContract.getSeriesOfContract()
    .then(function (data) {
      if(data.length) {
        res.status(200).json(data);
      } else {
        res.status(204).send();
      }
    })
    .catch(function (err) {
      res.status(500).json('Server error');
    });
});

router.get('/contract/check', function (req, res, next) {
  var series = req.query.series,
    number = req.query.number,
    pin = req.query.pin,
    captcha = req.query.c;
  if(!series || !number || !pin || !captcha) {
    var response = {
      code: 400
    };
    return res.status(400).json(response);
  } else {
    request.post('https://www.google.com/recaptcha/api/siteverify',
      {
        form: {
          secret: config.captcha.secret,
          response: captcha
        }
      },
      function(err, response, body) {
        var status = null;
        if(body.length) {
          status = JSON.parse(body);
        }
        if(err || !status.success) {
          //  Invalid captcha
          var resp = {
            code: 401
          };
          return res.json(resp, 401);
        } else {
          db.LombardPledgeContract.checkContract(series, number, pin)
            .then(function (data) {
              if(data.length) {
                db.LombardPledgeContract.getContractDataById(data[0].id)
                  .then(function (data) {
                    if(data.length) {
                      var resData = {
                        fio: data[0].fio,
                        contractType: data[0].contractType,
                        paymentInEndOfTerm: data[0].paymentInEndOfTerm,
                        periodName: data[0].periodName,
                        periodPrice: data[0].periodPrice,
                        paymentAmount: data[0].paymentAmount,
                        numberPaymentPeriods: data[0].numberPaymentPeriods,
                        contractAlgorithm: data[0].contractAlgorithm,
                        limitExtension: data[0].limitExtension,
                        contractEndDate: data[0].contractEndDate,
                        contractBeginDate: data[0].contractBeginDate
                      };
                      res.status(200).json(resData);
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
        }
      });
  }
});

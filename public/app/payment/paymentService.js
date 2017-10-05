'use strict';

angular.module('wlApp')
  .service('paymentService', ['$http', '$q', function($http, $q) {
    this.getDocumentSeries = function() {
      var deferred = $q.defer();
      $http.get('/contract/series')
        .success(function(series, status) {
          if(status == 204) {
            deferred.resolve([]);
          }
          if(status == 200) {
            deferred.resolve(series);
          }
        })
        .error(function(err) {
          console.error(err);
          deferred.reject([]);
        });
      return deferred.promise;
    };

    this.getContract = function(contract) {
      var deferred = $q.defer();
      $http(
        {
          method: 'GET',
          url: '/contract/check',
          params: {
            series: contract.series,
            number: contract.number,
            pin: contract.pinCode,
            c: contract.captcha
          }
        })
        .then(function(response) {
          deferred.resolve(response.data);
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };

    this.startPayment = function(seriesOfContract, numberContract, paymentAmount, payerEmail,
                                 payerPhone, numberPaymentPeriods, pinCode) {
      var deferred = $q.defer();
      $http(
        {
          method: 'POST',
          url: '/payment/start',
          params: {
            seriesOfContract: seriesOfContract,
            numberContract: numberContract,
            paymentAmount: paymentAmount,
            payerEmail: payerEmail,
            payerPhone: payerPhone,
            numberPaymentPeriods: numberPaymentPeriods,
            pinCode: pinCode
          }
        })
        .then(function(response) {
          deferred.resolve(response.data);
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };

  }]);
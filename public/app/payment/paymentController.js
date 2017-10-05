'use strict';

/**
 * Payment controller
 * @param $scope
 * @param series
 * @param paymentService
 * @constructor
 */
function PaymentController($scope, toaster, series, paymentService, $modal, $filter) {

  this.filter = $filter;
  this.scope = $scope;
  this.scope.secret = configFrontend.captcha.secret;
  this.toaster = toaster;
  this.modal = $modal;
  this.paymentService = paymentService;
  $scope.series = series;
  $scope.$on('$routeChangeSuccess', function(event, current) {
    if(!series.length) {
      toaster.pop('error', "", "Відсутні данні в базі");
    } else {
      $scope.contract = {
        series: series[0].series,
        number: '',
        pinCode: '',
        captcha: '',
        fio: '',
        contractType: '',
        paymentInEndOfTerm: 0,
        periodName: '',
        periodPrice: 0,
        numberPaymentPeriods: 0,
        contractAlgorithm: '',
        limitExtension: 0,
        contractBeginDate: '',
        contractEndDate: ''
      };
    }
  });
  $scope.currentStep = 1;

  //  Contract details

  $scope.payment = {
    rules: false,
    phone: '',
    email: '',
    amount: 0,
    numberOfPeriods: 0
  };
  //  Bind functions
  $scope.setResponse = angular.bind(this, this.setResponse);
  $scope.proceedNextStep = angular.bind(this, this.proceedNextStep);
  $scope.showRules = angular.bind(this, this.showRules);
  $scope.calculateAmount = angular.bind(this, this.calculateAmount);
}


PaymentController.resolve = {
  series: ['paymentService', function(paymentService) {
    return paymentService.getDocumentSeries();
  }]
};

PaymentController.prototype = {
  setResponse: function(response) {
    //  reCaptcha
    this.scope.contract.captcha = response;
  },
  proceedNextStep: function(nextStepNumber) {
    var self = this,
      contract = self.scope.contract,
      payment = self.scope.payment;
    switch (nextStepNumber) {
      case 2: {
        this.paymentService.getContract(this.scope.contract)
          .then(function(contractDetails) {
            self.scope.contract.contractType = contractDetails.contractType;
            self.scope.contract.fio = contractDetails.fio;
            self.scope.contract.paymentInEndOfTerm = contractDetails.paymentInEndOfTerm;
            self.scope.contract.periodName = contractDetails.periodName;
            self.scope.contract.periodPrice = contractDetails.periodPrice;
            self.scope.payment.amount = contractDetails.paymentAmount || contractDetails.periodPrice;
            self.scope.contract.numberPaymentPeriods = contractDetails.numberPaymentPeriods;
            self.scope.contract.contractAlgorithm = contractDetails.contractAlgorithm || "Договір застави";
            self.scope.contract.limitExtension = contractDetails.limitExtension;
            self.scope.contract.contractEndDate = self.filter('date')(contractDetails.contractEndDate, 'dd.MM.yyyy', '');
            self.scope.contract.contractBeginDate = self.filter('date')(contractDetails.contractBeginDate, 'dd.MM.yyyy', '');
            self.scope.currentStep = nextStepNumber;
            if(self.scope.contract.paymentInEndOfTerm == 1) {
              if(contract.numberPaymentPeriods > contract.limitExtension) {
                self.scope.payment.numberOfPeriods = self.scope.contract.limitExtension;
              } else {
                self.scope.payment.numberOfPeriods = self.scope.contract.numberPaymentPeriods;
              }
            } else {
              self.scope.payment.numberOfPeriods = 1;
            }
            self.toaster.pop('success', "Платіж", "Дані по договору успішно отримані");
          })
          .catch(function(err) {
            console.log(err);
            self.toaster.pop('error', "Платіж", "Помилка ідентифікації");
          });
      } break;
      case 3: {
        this.paymentService.startPayment(contract.series, contract.number, payment.amount, payment.email,
                                          payment.phone, payment.numberOfPeriods, contract.pinCode)
          .then(function() {
            //TODO WL-1 доработать после подключения платежной системы
            self.toaster.pop('success', "", "Данні успішно відправлені на сервер.");
          })
          .catch(function(err) {
            console.log(err);
            self.toaster.pop('error', "", "Пробачте виникла помилка");
          });
      }
    }


  },
  showRules: function() {
    var self = this;
    var acceptRules = self.modal.open({
      backdrop: 'static',
      templateUrl: '/app/payment/modal/rulesModal.html',
      controller: 'RulesModalCtrl'
    });
    acceptRules.result.then(function (paramFromDialog) {
      self.scope.payment.rules = paramFromDialog;
    });
  },
  calculateAmount: function() {
    var self = this;
    var numberRegExp = new RegExp('^[0-9]*$');
    if(!numberRegExp.test(self.scope.payment.numberOfPeriods)) {
      self.scope.payment.numberOfPeriods = 1;
      self.toaster.pop('error', "", "Введено неприпустиме значення");
    }
    if(self.scope.payment.numberOfPeriods > self.scope.contract.limitExtension) {
      self.scope.payment.numberOfPeriods = self.scope.contract.limitExtension;
      self.toaster.pop('info', "", "Максимальна кількість періодів продовження обмежено: " + self.scope.contract.limitExtension + " " + self.scope.contract.periodName);
    }
    if(self.scope.contract.paymentInEndOfTerm == 0) {
      self.scope.payment.amount = self.scope.payment.numberOfPeriods * self.scope.contract.periodPrice;
      self.scope.payment.amount = self.scope.payment.amount.toFixed(2);
    }
  }
};

function config($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/app/payment/payment.tpl.html',
    controller: 'PaymentController',
    resolve: PaymentController.resolve
  })
    .otherwise({
      redirectTo: '/'
    })
}

angular.module('wlApp')
  .controller('PaymentController', ['$scope', 'toaster', 'series', 'paymentService', '$modal', '$filter', PaymentController])
  .config(config);
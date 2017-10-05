'use strict';

/**
 * @ngdoc overview
 * @name wlApp
 * @description
 * # wlApp
 *
 * Main module of the application.
 */

angular
  .module('wlApp', [
    'ui.bootstrap',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'toaster',
    'ui.mask',
    'vcRecaptcha'
  ]);
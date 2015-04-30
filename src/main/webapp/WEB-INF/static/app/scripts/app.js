'use strict';

var app = angular.module('CallForPaper', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ngAnimate',
    'ui.bootstrap',
    'ngTagsInput',
    'internationalPhoneNumber',
    'bs-has',
    'pascalprecht.translate',
    'k8LanguagePicker',
    'ngTable',
    'ui-notification'
  ])
  .config(function($stateProvider, $urlRouterProvider) {
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $urlRouterProvider
    .when('/event/form', '/event/form/step1')
    .when('/event/form/', '/event/form/step1')
    .when('/event', '/event/form/step1')
    .when('/event/', '/event/form/step1')

    .when('/admin/sessions/', '/admin/sessions')
    .when('/admin/session/', '/admin/sessions')
    .when('/admin/session', '/admin/sessions')

    .when('/admin', '/admin/sessions')
    .when('/admin/', '/admin/sessions');
    $urlRouterProvider.otherwise('/event/form/step1');
    $stateProvider
      .state('admin', {
        url: '/admin',
        abstract: true,
        views : {
          '' : {
            templateUrl: 'views/admin/admin.html',
            controller: 'AdminCtrl'
          },
          '@form' : {
            templateUrl: 'views/admin/sessions.html'
          }
        },
      })
      // Session
      .state('admin.sessions', {
        url:  '/sessions',
        templateUrl: 'views/admin/sessions.html',
        controller: 'SessionsCtrl'
      })
      .state('admin.session', {
        url: '/session/:id',
        templateUrl: 'views/admin/session.html',
        controller: 'SessionCtrl'
      })

      // Form
      .state('form', {
        url: '/event/form',
        abstract: true,
        views : {
          '' : {
            templateUrl: 'views/form/form.html',
            controller: 'FormCtrl'
          },
          '@form' : {
            templateUrl: 'views/form/step1.html'
          }
        },
      })
      // nested states 
      // each of these sections will have their own view
      .state('form.step1', {
        url: '/step1',
        templateUrl: 'views/form/step1.html',
        controller: 'Step1Ctrl'
      })
      .state('form.step2', {
        url: '/step2',
        templateUrl: 'views/form/step2.html',
        controller: 'Step2Ctrl'
      })
      .state('form.step3', {
        url: '/step3',
        templateUrl: 'views/form/step3.html',
        controller: 'Step3Ctrl'
      })
      .state('form.result', {
        url: '/result',
        templateUrl: 'views/form/result.html',
        controller: 'ResultCtrl'
      })
      .state('close', {
        url: '/close',
        templateUrl: 'views/form/close.html'
      })
      .state('404', {
        url: '/404',
        templateUrl: '404.html'
      });
  })
.config(function(tagsInputConfigProvider) {
  tagsInputConfigProvider
    .setDefaults('tagsInput', {
      placeholder: '',
      minLength: 1,
      addOnEnter: true
    })
    .setDefaults('autoComplete', {
      debounceDelay: 200,
      loadOnDownArrow: true,
      loadOnEmpty: true
    })
});
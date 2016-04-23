'use strict';

angular.module('myApp', [
    'ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ui.router',
    'ngResource',
    'ngRoute',
    'ngMaterial',
    'ngMessages'])
    
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            /*
            .state('login', {
                url: '/login',
                templateUrl: 'app/login/login.html',
                controller: 'LoginCtrl'
            })
            .state('registro', {
                url: '/registro',
                templateUrl: 'app/registro/registro.html',
                controller: 'RegistroCtrl'
            })
            */
            .state('main', {
                url: '/main',
                templateUrl: 'app/main/main.html',
                controller: 'MainCtrl',
                //resolve: { authenticate: authenticate }
            });

        /*
        function authenticate($q, $state, $timeout, Authentication) {
            if (Authentication.isAuthenticated()) {
                return $q.when()
            } else {
                $timeout(function() {
                    $state.go('login')
                })
                return $q.reject()
            }
        }
        */
        
        $urlRouterProvider.otherwise('/main');
        $locationProvider.html5Mode(true).hashPrefix('#');    
    })

    .run(function($rootElement) {
        $rootElement.on('click', function(e) { e.stopPropagation(); });
    })
;



    

    
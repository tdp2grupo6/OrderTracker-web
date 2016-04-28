'use strict';

angular.module('myApp', [
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ui.router',
    'ngResource',
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'xeditable'])
    
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: 'app/main/main.html',
                controller: 'MainController'
            })
            .state('main.listadoPedidos', {
                url: '/listadoPedidos',
                templateUrl: 'app/main/listadoPedidos.tmpl.html',
                controller: 'ListadoPedidosController'
            });

        $urlRouterProvider.otherwise('/main');
        $locationProvider.html5Mode(true).hashPrefix('#');    
    })

    .run(function($rootElement) {
        $rootElement.on('click', function(e) { e.stopPropagation(); });
    })
;



    

    
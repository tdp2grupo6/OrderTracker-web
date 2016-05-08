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
    'xeditable',
    'md.data.table'])
    
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider) {
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
            })
            .state('main.agenda', {
                url: '/agenda',
                templateUrl: 'app/main/agenda.tmpl.html',
                controller: 'AgendaController'
            });

        $urlRouterProvider.otherwise('/main');
        $locationProvider.html5Mode(true).hashPrefix('#');  

        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('pink')
            .warnPalette('grey', {
              'default': '200', // by default use shade 400 from the light-blue palette for primary intentions
              'hue-1': '800', // use shade 100 for the <code>md-hue-1</code> class
            });
    })

    .run(function($rootElement) {
        $rootElement.on('click', function(e) { e.stopPropagation(); });
    })
;



    

    
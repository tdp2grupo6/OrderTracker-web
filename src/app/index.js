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
            })
            .state('main.clientes', {
                url: '/clientes',
                templateUrl: 'app/main/clientes.tmpl.html',
                controller: 'ClientesController'
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

    // dgacitua: Traducción de DatePickers
    .config(function($mdDateLocaleProvider) {
      $mdDateLocaleProvider.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      $mdDateLocaleProvider.shortMonths = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      $mdDateLocaleProvider.days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      $mdDateLocaleProvider.shortDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
      $mdDateLocaleProvider.firstDayOfWeek = 0;
      // In addition to date display, date components also need localized messages
      // for aria-labels for screen-reader users.
      $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
        return 'Semana ' + weekNumber;
      };
      $mdDateLocaleProvider.msgCalendar = 'Calendario';
      $mdDateLocaleProvider.msgOpenCalendar = 'Abrir el calendario';
    })
;






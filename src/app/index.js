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
    'md.data.table',
    'ja.qr',
    'ui.map',
    'ngFileUpload'])

    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('login', {
              url: '/login',
              templateUrl: 'app/login/login.tmpl.html',
              controller: 'LoginController'
            })
            .state('main', {
                url: '/main',
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                resolve: { authenticate: authenticate }
            })
            .state('main.listadoPedidos', {
                url: '/listadoPedidos',
                templateUrl: 'app/pedidos/listadoPedidos.tmpl.html',
                controller: 'ListadoPedidosController'
            })
            .state('main.agenda', {
                url: '/agenda',
                templateUrl: 'app/agenda/agenda.tmpl.html',
                controller: 'AgendaController'
            })
            .state('main.marcas', {
                url: '/marca',
                templateUrl: 'app/marcas/marcas.tmpl.html',
                controller: 'MarcasController'
            })
            .state('main.categorias', {
              url: '/categoria',
              templateUrl: 'app/categorias/categorias.tmpl.html',
              controller: 'CategoriasController'
            })
            .state('main.productos', {
              url: '/productos',
              templateUrl: 'app/productos/productos.tmpl.html',
              controller: 'ProductosController'
            })
            .state('main.clientes', {
                url: '/clientes',
                templateUrl: 'app/clientes/clientes.tmpl.html',
                controller: 'ClientesController'
            });

        function authenticate($q, $state, $timeout, Authentication) {
            if (Authentication.isAuthenticated()) {
                return $q.when()
            } else {
                $timeout(function() { $state.go('login') });
                return $q.reject()
            }
        }

        $urlRouterProvider.otherwise('/login');
        $locationProvider.html5Mode(true).hashPrefix('#');
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

    .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('pink')
        .warnPalette('grey', {
          'default': '200', // by default use shade 400 from the light-blue palette for primary intentions
          'hue-1': '800' // use shade 100 for the <code>md-hue-1</code> class
        });
    })

    /*
    .directive('ngFileModel', ['$parse', function ($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var model = $parse(attrs.ngFileModel);
          var modelSetter = model.assign;

          element.bind('change', function(){
            scope.$apply(function(){
              modelSetter(scope, element[0].files[0]);
            });
          });
        }
      };
    }])

    .directive('chooseFile', function() {
      return {
        link: function (scope, elem, attrs) {
          var button = elem.find('button');
          var input = angular.element(elem[0].querySelector('input#fileInput'));

          button.bind('click', function() {
            input[0].click();
          });

          input.bind('change', function(e) {
            scope.$apply(function() {
              var files = e.target.files;
              if (files[0]) {
                scope.fileName = files[0].name;
              } else {
                scope.fileName = null;
              }
            });
          });
        }
      };
    })
    */
;






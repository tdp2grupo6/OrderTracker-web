(function() {
    'use strict';

    angular
    	.module('myApp')
      .controller('ListadoPedidosController', ListadoPedidosController)
      .run(function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
      })
      .filter('unique', function() {
        return function(input, key) {
            var unique = {};
            var uniqueList = [];
            var len = (input) ? input.length : 0;
            for(var i = 0; i < len; i++){
                if(typeof unique[input[i][key]] === 'undefined'){
                    unique[input[i][key]] = "";
                    uniqueList.push(input[i]);
                }
            }
            return uniqueList;
        };
      });

      ListadoPedidosController.$inject = ['$scope', '$mdDialog', '$mdMedia', 'Pedidos', 'Services', '$filter'];

      function ListadoPedidosController($scope, $mdDialog, $mdMedia, Pedidos, Services, $filter) {

        $scope.query = {
          estado: '',
          idCliente: '',
          fechaInicio: '',
          fechaFin: '',
          pagina: 1
        };


        Pedidos.filtrarPedido($scope.query,
            function(data) {
              $scope.pedidos = data.resultados;
              $scope.totalResultados = data.totalResultados;
              angular.forEach($scope.pedidos, function(pedido) {});
            },
            function() {

            }
        );

        $scope.filter = {
          options: {
            debounce: 500
          }
        };

        $scope.buscarPedidos = function () {
          var fechaInicio = ($scope.fechaInicioFilter) ? $filter('date')($scope.fechaInicioFilter, Services.dateFormat) : '';
          var fechaFin = ($scope.fechaFinFilter) ? $filter('date')(($scope.fechaFinFilter).setDate(($scope.fechaFinFilter).getDate() + 1), Services.dateFormat) : '';

          //console.log($scope.fechaFinFilter);

          $scope.query.estado = ($scope.estadoFilter) ? $scope.estadoFilter : '';
          $scope.query.idCliente = ($scope.idClienteFilter) ? $scope.idClienteFilter : '';
          $scope.query.fechaInicio = fechaInicio;
          $scope.query.fechaFin = fechaFin;

          //console.log($scope.query);

          Pedidos.filtrarPedido($scope.query,
            function(data) {
              $scope.pedidos = data.resultados;
              $scope.totalResultados = data.totalResultados;
            },
            function() {

            }
          );
        };

        $scope.cambiarEstado = function(id) {
          console.log(id);
        }

        $scope.getPedidosFiltrado = function (pagina, limite) {
          $scope.query.pagina = pagina;

          Pedidos.filtrarPedido($scope.query,
            function(data) {
              $scope.pedidos = data.resultados;
              $scope.totalResultados = data.totalResultados;
            },
            function() {

            }
          );
        };

        $scope.removeFilter = function () {
          $scope.filter.show = false;
          $scope.query.pagina = 1;
          $scope.query.estado = '';
          $scope.query.idCliente = '';
          $scope.query.fechaInicio = '';
          $scope.query.fechaFin = '';

          if($scope.filter.form.$dirty) {
            $scope.filter.form.$setPristine();
          }

          Pedidos.filtrarPedido($scope.query,
            function(data) {
              $scope.pedidos = data.resultados;
              $scope.totalResultados = data.totalResultados;
            },
            function() {

            }
          );
        };

        $scope.estados = [{id:1,tipo:'ESTADO_NUEVO',nombre:'Nuevo'},
          {id:2,tipo:'ESTADO_CONFIRMADO',nombre:'Confirmado'},
          {id:3,tipo:'ESTADO_ENVIADO',nombre:'Enviado'},
          {id:4,tipo:'ESTADO_ACEPTADO',nombre:'Aceptado'},
          {id:5,tipo:'ESTADO_DESPACHADO',nombre:'Despachado'},
          {id:6,tipo:'ESTADO_RECHAZADO',nombre:'Rechazado'}
        ];

        $scope.mostrarDetallePedidoModal = function(ev,id) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          
          $mdDialog.show({
            templateUrl: 'app/main/detallePedido.tmpl.html',
            targetEvent: ev,
            scope: $scope.$new(),
            clickOutsideToClose:true,
            fullscreen: useFullScreen
          })
          
          .then(function(answer) {
            }, function() {
          });

          $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
          }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
          });

          Pedidos.listarPedido({ id: id },
            function(data) {
              $scope.unPedido = data;
              $scope.items = $scope.unPedido.elementos;
            },
            function() {

            }
          );  
        };
      }
})();

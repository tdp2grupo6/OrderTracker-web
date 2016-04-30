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
                if(typeof unique[input[i][key]] == "undefined"){
                    unique[input[i][key]] = "";
                    uniqueList.push(input[i]);
                }
            }
            return uniqueList;
        };
      });
       
      ListadoPedidosController.$inject = ['$scope', '$mdDialog', 'Pedidos', '$filter'];

      function ListadoPedidosController($scope, $mdDialog, Pedidos, $filter) {

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
          $scope.query.estado = ($scope.estadoFilter) ? $scope.estadoFilter : '';
          $scope.query.idCliente = ($scope.idClienteFilter) ? $scope.idClienteFilter : '';
          $scope.query.fechaInicio = ($scope.fechaInicioFilter) ? $scope.fechaInicioFilter : '';
          $scope.query.fechaFin = ($scope.fechaFinFilter) ? $scope.fechaFinFilter : '';
          
          console.log($scope.query);

          Pedidos.filtrarPedido($scope.query,
            function(data) {
              $scope.pedidos = data.resultados;
              $scope.totalResultados = data.totalResultados;
            },
            function() {

            }
          );
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

      }
})();
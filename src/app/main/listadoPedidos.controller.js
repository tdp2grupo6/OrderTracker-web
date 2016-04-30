(function() {
    'use strict';

    angular
    	.module('myApp')
      .controller('ListadoPedidosController', ListadoPedidosController)
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

      

        $scope.saveFilter = function () {
          $scope.query.filter = "'estado': 3, 'idCliente': 4, 'fechaInicio': '2016-04-18T00:00:00Z', 'fechaFin': '2016-04-25T23:59:59Z', 'pagina': 1";
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
          $scope.query.filter = '';
          
          if($scope.filter.form.$dirty) {
            $scope.filter.form.$setPristine();
          }
        };

        $scope.estados = [{id:1,tipo:'ESTADO_NUEVO',nombre:'Nuevo'},{id:2,tipo:'ESTADO_CONFIRMADO',nombre:'Confirmado'},
          {id:3,tipo:'ESTADO_ENVIADO',nombre:'Enviado'},{id:4,tipo:'ESTADO_ACEPTADO',nombre:'Aceptado'},
          {id:5,tipo:'ESTADO_DESPACHADO',nombre:'Despachado'}, {id:6,tipo:'ESTADO_RECHAZADO',nombre:'Rechazado'}];

        $scope.showEstados = function(pedido) {
          if(pedido.estado && $scope.estados.length) {
            var selected = $filter('filter')($scope.estados, {id: pedido.estado.id});
            return selected.length ? selected[0].nombre : pedido.estado.nombre;
          } else {
            return pedido.estado.nombre || 'No anda te dije';
          }
        };

      }
})();
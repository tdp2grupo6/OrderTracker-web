(function() {
    'use strict';

    angular
    	.module('myApp')
      .controller('ListadoPedidosController', ListadoPedidosController)
      .run(function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
      });;
        
      ListadoPedidosController.$inject = ['$scope', '$mdDialog', 'Pedidos', '$filter'];

      function ListadoPedidosController($scope, $mdDialog, Pedidos, $filter) {

        Pedidos.listarPedidos(null,
            function(data) {
              $scope.pedidos = data;
            },
            function() {

            }
        );

        $scope.estados = [{id:1,tipo:'ESTADO_CONFIRMADO',nombre:'Confirmado'},{id:2,tipo:'ESTADO_ENVIADO',nombre:'Enviado'}];

        $scope.showEstados = function(pedido) {
          if(pedido.estado && $scope.estados.length) {
            var selected = $filter('filter')($scope.estados, {id: pedido.estado.id});
            return selected.length ? selected[0].nombre : pedido.estado.nombre;
          } else {
            return pedido.estado.nombre || 'No anda te dije';
          }
        };

        $scope.removeProducto = function($index) {
          Pedidos.borrarPedido($index, 
            function(data) {
              $scope.pedidos = data;
            },
            function() {

            }
            );
        };

      }
})();
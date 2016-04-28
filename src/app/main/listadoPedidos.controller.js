(function() {
    'use strict';

    angular
    	.module('myApp')
      .controller('ListadoPedidosController', ListadoPedidosController);
        
      ListadoPedidosController.$inject = ['$scope', '$mdDialog', 'Pedidos'];

      function ListadoPedidosController($scope, $mdDialog, Pedidos) {

        Pedidos.listarPedidos(null,
            function(data) {
            },
            function() {
            }
        );
      }
})();
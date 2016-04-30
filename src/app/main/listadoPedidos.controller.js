(function() {
    'use strict';

    angular
    	.module('myApp')
      .controller('ListadoPedidosController', ListadoPedidosController)
      .run(function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
      });
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

        Pedidos.listarPedidos(null,
            function(data) {
              $scope.pedidos = data;
              //Se deseleccionan los items
              angular.forEach($scope.pedidos, function(itm){ itm.selected = false; });
            },
            function() {

            }
        );

        $scope.selected = [];
  
        $scope.filter = {
          options: {
            debounce: 500
          }
        };

        $scope.removeFilter = function () {
          $scope.filter.show = false;
          $scope.query.filter = '';
          
          if($scope.filter.form.$dirty) {
            $scope.filter.form.$setPristine();
          }
        };

        $scope.toggleAll = function() {
           var toggleStatus = !$scope.isAllSelected;
           angular.forEach($scope.pedidos, function(itm){ itm.selected = toggleStatus; });
        }
        
        $scope.optionToggled = function(){
          $scope.isAllSelected = $scope.pedidos.every(function(itm){ return itm.selected; })
        }

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
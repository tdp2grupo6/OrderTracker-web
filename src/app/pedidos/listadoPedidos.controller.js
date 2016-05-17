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
                    unique[input[i][key]] = '';
                    uniqueList.push(input[i]);
                }
            }
            return uniqueList;
        };
      });

      ListadoPedidosController.$inject = ['$scope', '$mdDialog', '$mdMedia', 'Pedidos', 'Clientes', 'Services', '$filter', '$mdToast'];

      function ListadoPedidosController($scope, $mdDialog, $mdMedia, Pedidos, Clientes, Services, $filter, $mdToast) {

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
              //console.log($scope.pedidos);
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
          var fechaFin = ($scope.fechaFinFilter) ? $filter('date')($scope.fechaFinFilter, Services.dateFormat) : '';

          //console.log($scope.fechaFinFilter);

          $scope.query.estado = ($scope.estadoFilter) ? $scope.estadoFilter : '';
          $scope.query.idCliente = ($scope.selectedItem1) ? $scope.selectedItem1.id : '';  //($scope.idClienteFilter) ? $scope.idClienteFilter : '';
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

        var last = {
           bottom: true,
           top: false,
           left: false,
           right: true
        };

        $scope.toastPosition = angular.extend({},last);

        function sanitizePosition() {
            var current = $scope.toastPosition;
            if ( current.bottom && last.top ) { current.top = false; }
            if ( current.top && last.bottom ) { current.bottom = false; }
            if ( current.right && last.left ) { current.left = false; }
            if ( current.left && last.right ) { current.right = false; }
            last = angular.extend({},current);
        }

        $scope.getToastPosition = function() {
            sanitizePosition();
            return Object.keys($scope.toastPosition)
            .filter(function(pos) { return $scope.toastPosition[pos]; })
            .join(' ');
        };

        $scope.cambiarEstado = function(idPedido, accion) {

          if (accion === 'A') {
            /* Debe ir en este formato el body para que lo acepte como json */
            $scope.body = '{\'estado\': ESTADO_ACEPTADO}';
            $mdToast.show($mdToast.simple().textContent('El Pedido ha sido Aceptado!').position($scope.getToastPosition()).hideDelay(3000));
          }
          else if (accion === 'D') {
            /* Debe ir en este formato el body para que lo acepte como json */
            $scope.body = '{\'estado\': ESTADO_DESPACHADO}';
            $mdToast.show($mdToast.simple().textContent('El Pedido ha sido Despachado!').position($scope.getToastPosition()).hideDelay(3000));
          }
          else if (accion === 'C') {
            /* Debe ir en este formato el body para que lo acepte como json */
            $scope.body = '{\'estado\': ESTADO_CANCELADO}';
            $mdToast.show($mdToast.simple().textContent('El Pedido ha sido Cancelado!').position($scope.getToastPosition()).hideDelay(3000));
          }

          /* Cuando se tiene un servicio con parametros y body, primero se para el parametro,
            luego el body y luego las funciones de callback. */

          Pedidos.actualizarPedido({id:idPedido}, $scope.body,
            function() {
              console.log('Cambio de Estado OK! Pedido ' + idPedido);
              $scope.getPedidosFiltrado($scope.query.pagina, $scope.query.limite);
            },
            function() {
              console.log('Cambio de Estado ERROR! Pedido ' + idPedido);
            }
          );
        };

        $scope.showFiltro = function () {
          $scope.filter.show = true;

          Clientes.listaCortaClientes(function(data) {
            $scope.listaClientes = data;
            angular.forEach($scope.listaClientes, function(cliente) {
              cliente.nombreCompleto = cliente.apellido + ', ' + cliente.nombre;
            });
            console.log($scope.listaClientes);
          });
        };

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

        $scope.estados = [
          {id:1,tipo:'ESTADO_NUEVO',nombre:'Nuevo'},
          {id:2,tipo:'ESTADO_CONFIRMADO',nombre:'Confirmado'},
          {id:3,tipo:'ESTADO_ENVIADO',nombre:'Enviado'},
          {id:4,tipo:'ESTADO_ACEPTADO',nombre:'Aceptado'},
          {id:5,tipo:'ESTADO_DESPACHADO',nombre:'Despachado'},
          {id:6,tipo:'ESTADO_CANCELADO',nombre:'Cancelado'}
        ];

        $scope.cerrar = function() {
          $mdDialog.cancel();
        };

        $scope.mostrarDetallePedidoModal = function(ev,id) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

          $mdDialog.show({
            templateUrl: 'app/pedidos/detallePedido.tmpl.html',
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

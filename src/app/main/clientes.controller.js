(function() {
    'use strict';

    angular
		.module('myApp')
    .controller('ClientesController', ClientesController)
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


      ClientesController.$inject = ['$scope', '$mdDialog', '$mdMedia','$filter', 'Services', 'Clientes'];

      function ClientesController($scope, $mdDialog, $mdMedia, $filter, Services, Clientes) {

        $scope.query = {
          idCliente: '',
          nombre: '',
          apellido: '',
          email: '',
          direccion: '',
          pagina: 1
        };

        Clientes.filtrarCliente($scope.query,
          function(data) {
            $scope.clientes = data.resultados;
            $scope.totalResultados = data.totalResultados;
            angular.forEach($scope.clientes, function(cliente) {});
          },
          function() {

          }
        );

        // TODO Funcion para editar cliente
        $scope.editarCliente = function(id) {
          console.log("TODO editar cliente " + id)
        };

        // TODO Funcion para borrar cliente
        $scope.borrarCliente = function(id) {
          console.log("TODO borrar cliente " + id)
        };

        $scope.agregarClienteModal = function(ev) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

          $mdDialog.show({
		        templateUrl: 'app/main/agregarCliente.tmpl.html',
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
        };

        $scope.mostrarDetalleClienteModal = function(ev,id) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

          $mdDialog.show({
            templateUrl: 'app/main/detalleCliente.tmpl.html',
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

          Clientes.listarCliente({ id: id },
            function(data) {
              $scope.unCliente = data;
              $scope.items = $scope.unPedido.elementos;
            },
            function() {

            }
          );
        };

        $scope.getClientesFiltrado = function (pagina, limite) {
          $scope.query.pagina = pagina;

          Clientes.filtrarCliente($scope.query,
            function(data) {
              $scope.clientes = data.resultados;
              $scope.totalResultados = data.totalResultados;
            },
            function() {

            }
          );
        };

        // dgacitua: Codigo de md-autocomplete
        Clientes.listaCortaClientes(function(data) {
          $scope.listaClientes = data;
        });

        // dgacitua: funcion para filtrar clentes
        $scope.buscarClientes = function () {
          $scope.query = {
            idCliente: $scope.filtroId? $scope.filtroId : '',
            nombre: $scope.selectedItem1? $scope.selectedItem1.nombre : '',
            apellido: $scope.selectedItem2? $scope.selectedItem2.apellido : '',
            email: $scope.selectedItem3? $scope.selectedItem3.email : '',
            direccion: $scope.selectedItem4? $scope.selectedItem4.direccion : '',
            pagina: 1
          };

          Clientes.filtrarCliente($scope.query,
            function(data) {
              //console.log($scope.query);
              //console.log(data);
              $scope.clientes = data.resultados;
              $scope.totalResultados = data.totalResultados;
            },
            function() {

            }
          );
        };

        // dgacitua: Remover filtro clientes
        $scope.removeFilter = function () {
          $scope.filter.show = false;
          $scope.query.pagina = 1;
          $scope.query.nombre = '';
          $scope.query.apellido = '';
          $scope.query.idCliente = '';
          $scope.query.email = '';
          $scope.query.direccion = '';

          if($scope.filter.form.$dirty) {
            $scope.filter.form.$setPristine();
          }

          Clientes.filtrarCliente($scope.query,
            function(data) {
              $scope.clientes = data.resultados;
              $scope.totalResultados = data.totalResultados;
            },
            function() {

            }
          );
        };
      }
})();

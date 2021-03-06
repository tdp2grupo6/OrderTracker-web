(function() {
    'use strict';

    angular
		.module('myApp')
    .controller('VendedorController', VendedorController)
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


    VendedorController.$inject = ['$scope', '$mdDialog', '$mdMedia', '$filter', 'Services', 'Vendedores', '$mdToast'];

    function VendedorController($scope, $mdDialog, $mdMedia, $filter, Services, Vendedores, $mdToast) {

        $scope.query = {
          id: '',
          nombre: '',
          apellido: '',
          username: '',
          email: '',
          telefono: '',
          pagina: 1
        };

        $scope.form = {
          username: '',
          password: '',
          email: '',
          nombre: '',
          apellido: ''
        };

        $scope.vendedoresNuevos = {};

        Vendedores.filtrarVendedores($scope.query,
          function(data) {
            $scope.vendedores = data.resultados;
            $scope.totalResultados = data.totalResultados;
            angular.forEach($scope.vendedores, function(vendedor) {});
          },
          function() {

          }
        );

        $scope.isAvailable = true;

        $scope.cerrar = function() {
          $mdDialog.cancel();
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

        $scope.mostrarDetalleVendedor = function(ev, id) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

          Vendedores.listarVendedor({ id: id },
            function(data) {
              $scope.vendedor = data;

              // Mostrar Modal
              $mdDialog.show({
                  templateUrl: 'app/vendedores/vendedorDetalle.tmpl.html',
                  targetEvent: ev,
                  scope: $scope.$new(),
                  clickOutsideToClose:true,
                  fullscreen: useFullScreen,
                  onRemoving: function() { $scope.cerrarModal() }
                })
                .then(function(answer) {
                }, function() {
                });

              $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
              }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
              });
            },
            function(error) {
              console.log("ERROR! No se puede mostrar el Vendedor " + error);
              $mdToast.show($mdToast.simple().textContent('ERROR! No se puede mostrar el Vendedor').position($scope.getToastPosition()).hideDelay(3000))
            }
          );
        };

        $scope.editarVendedorModal = function(ev,id) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

           Vendedores.listarVendedor({ id: id },
            function(data) {
              $scope.vendedor = data;

              // Mostrar Modal
              $mdDialog.show({
                  templateUrl: 'app/vendedores/editarVendedor.tmpl.html',
                  targetEvent: ev,
                  scope: $scope.$new(),
                  clickOutsideToClose:true,
                  fullscreen: useFullScreen,
                  onRemoving: function() { $scope.cerrarModal() }
                })
                .then(function(answer) {

                }, function() {
                });

              $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
              }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
              });
            },
            function(error) {
              console.log("ERROR! No se puede mostrar el Vendedor " + error);
              $mdToast.show($mdToast.simple().textContent('ERROR! No se puede mostrar el Vendedor').position($scope.getToastPosition()).hideDelay(3000))
            }
          );
        };

        $scope.transfer = function(idViejo,idNuevo) {
          var request = { vendedorViejo: {id: idViejo}, vendedorNuevo: {id: idNuevo}};
          console.log(request);

          if (idViejo !== idNuevo) {
            Vendedores.transferirClientes(request,
              function(data) {
                Vendedores.borrarVendedor({id: idViejo},
                  function(data) {
                    $mdToast.show($mdToast.simple().textContent('El Vendedor fue borrado satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000))
                  },
                  function(error) {
                    $mdToast.show($mdToast.simple().textContent('El Vendedor no pudo ser borrado').position($scope.getToastPosition()).hideDelay(3000))
                  });
              },
              function(error) {
                $mdToast.show($mdToast.simple().textContent('ERROR! No se puede hacer la transferencia').position($scope.getToastPosition()).hideDelay(3000))
              });
            $scope.cerrarModal();
          }
          else {
            $mdToast.show($mdToast.simple().textContent('ERROR! No se puede transferir al mismo cliente').position($scope.getToastPosition()).hideDelay(3000))
          }
        };

        $scope.borrarVendedor = function(ev,id) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

          Vendedores.listarVendedor({id: id},
            function(data) {
              $scope.vendedor = data;

              $mdDialog.show({
                  templateUrl: 'app/vendedores/transferirClientesVendedor.tmpl.html',
                  targetEvent: ev,
                  scope: $scope.$new(),
                  clickOutsideToClose:true,
                  fullscreen: useFullScreen,
                  onRemoving: function() { $scope.cerrarModal() }
                })
                .then(function(answer) {

                }, function() {
                });

              $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
              }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
              });
            },
            function(error) {
              $mdToast.show($mdToast.simple().textContent('ERROR! No se puede acceder a la base de datos').position($scope.getToastPosition()).hideDelay(3000))
            }
          );
        };

        $scope.agregarVendedorModal = function(ev) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

          $mdDialog.show({
            templateUrl: 'app/vendedores/agregarVendedor.tmpl.html',
            targetEvent: ev,
            scope: $scope.$new(),
            clickOutsideToClose:true,
            fullscreen: useFullScreen,
            onRemoving: function() { $scope.cerrarModal() }
          })
          .then(function(answer) {
          }, function() {
          });

          $scope.$watch(function() {
            return $mdMedia('sm') || $mdMedia('xs');
          }, function(wantsFullScreen) {
           $scope.customFullscreen = (wantsFullScreen === true);
          });

        };

        $scope.getVendedorFiltrado = function (pagina, limite) {
          $scope.query.pagina = pagina;

          Vendedores.filtrarVendedores($scope.query,
            function(data) {
              $scope.vendedores = data.resultados;
              $scope.totalResultados = data.totalResultados;
            },
            function() {

            }
          );
        };

        // Cerrar modal
        $scope.cerrarModal = function() {
          $mdDialog.cancel().then(function() {
            Vendedores.filtrarVendedores($scope.query,
              function(data) {
                $scope.vendedores = data.resultados;
                $scope.totalResultados = data.totalResultados;
              },
              function() {

              }
            );
          });
        };

        Vendedores.listaCortaVendedores(function(data) {
          $scope.listaVendedores = data;
        });

        // Funcion para filtrar vendedores
        $scope.buscarVendedores = function () {
          $scope.query = {
            nombre: $scope.selectedItem1? $scope.selectedItem1.nombre : '',
            apellido: $scope.selectedItem2? $scope.selectedItem2.apellido : '',
            username: $scope.selectedItem3? $scope.selectedItem3.username : '',
            pagina: 1
          };

          Vendedores.filtrarVendedores($scope.query,
            function(data) {
              $scope.vendedores = data.resultados;
              $scope.totalResultados = data.totalResultados;
            },
            function() {
              $mdToast.show($mdToast.simple().textContent('El Vendedor ha sido agregado Satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
            }
          );
        };

        // dgacitua: Remover filtro vendedores
        $scope.removeFilter = function () {
          $scope.filter.show = false;
          $scope.query.pagina = 1;
          $scope.query.nombre = '';
          $scope.query.apellido = '';
          $scope.query.username = '';

          if($scope.filter.form.$dirty) {
            $scope.filter.form.$setPristine();
          }

          $scope.selectedItem1 = '';
          $scope.selectedItem2 = '';
          $scope.selectedItem3 = '';

          Vendedores.filtrarVendedores($scope.query,
            function(data) {
              $scope.vendedores = data.resultados;
              $scope.totalResultados = data.totalResultados;
            },
            function() {

            }
          );
        };

        $scope.submit = function() {
           Vendedores.guardarVendedor($scope.form,
              function() {
                $mdToast.show($mdToast.simple().textContent('El Vendedor ha sido agregado Satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
                $scope.cerrarModal();
              },
              function() {
                $mdToast.show($mdToast.simple().textContent('El Vendedor no pudo ser agregado').position($scope.getToastPosition()).hideDelay(3000));
              }
            );
        };

        $scope.update = function(id) {

          $scope.request = angular.copy($scope.vendedor);

          delete $scope.request.id;
          delete $scope.request.nombreCompleto;
          delete $scope.request.clientes;

          //console.log($scope.request);

          Vendedores.actualizarVendedor({id: id},$scope.request,
              function() {
                $mdToast.show($mdToast.simple().textContent('El Vendedor ha sido actualizado Satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
                $scope.cerrarModal();
              },
              function() {
                $mdToast.show($mdToast.simple().textContent('El Vendedor no pudo ser actualizado').position($scope.getToastPosition()).hideDelay(3000));
              }
            );
        };
      }
})();

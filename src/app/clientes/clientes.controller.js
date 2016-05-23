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


      ClientesController.$inject = ['$scope', '$mdDialog', '$mdMedia', '$filter', 'Services', 'Clientes', '$mdToast'];

      function ClientesController($scope, $mdDialog, $mdMedia, $filter, Services, Clientes, $mdToast) {

        $scope.query = {
          idCliente: '',
          nombre: '',
          apellido: '',
          email: '',
          direccion: '',
          pagina: 1
        };

        $scope.form = {
          nombre: '',
          apellido: '',
          direccion: '',
          email: '',
          telefono: '',
          razonSocial: '',
          disponibilidad: ''
        };

        $scope.test = "hola";
        $scope.form = {};
        $scope.setForm = function (form) {
          $scope.form = form;
          console.log("Form Set!");
        };

        $scope.$watch('form', function() {
          console.log($scope.form);
        });

        Clientes.filtrarCliente($scope.query,
          function(data) {
            $scope.clientes = data.resultados;
            $scope.totalResultados = data.totalResultados;
            angular.forEach($scope.clientes, function(cliente) {});
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

        // dgacitua: Ver Cliente Modal
        $scope.mostrarDetalleCliente = function(ev, id) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

          Clientes.listarCliente({ id: id },
            function(data) {
              $scope.cliente = data;
              $scope.validador = data.validador;

              // Mostrar Modal
              $mdDialog.show({
                  templateUrl: 'app/clientes/clienteDetalle.tmpl.html',
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
              console.log("ERROR! No se puede mostrar el Cliente " + error);
              $mdToast.show($mdToast.simple().textContent('ERROR! No se puede mostrar el Cliente').position($scope.getToastPosition()).hideDelay(3000))
            }
          );
        };

        $scope.editarClienteModal = function(ev,id) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

          Clientes.listarCliente({ id: id },
            function(data) {
              $scope.cliente = data;
              $scope.validador = data.validador;
              
              // Mostrar Modal
              $mdDialog.show({
                  templateUrl: 'app/clientes/editarCliente.tmpl.html',
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
              console.log("ERROR! No se puede mostrar el Cliente " + error);
              $mdToast.show($mdToast.simple().textContent('ERROR! No se puede mostrar el Cliente').position($scope.getToastPosition()).hideDelay(3000))
            }
          );
        };


        $scope.borrarCliente = function(id) {
           Clientes.borrarCliente({ id: id },
            function() {
             $mdToast.show($mdToast.simple().textContent('El Cliente ha sido borrado Satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
               Clientes.filtrarCliente($scope.query,
                function(data) {
                  $scope.clientes = data.resultados;
                  $scope.totalResultados = data.totalResultados;
                  angular.forEach($scope.clientes, function(cliente) {});
                },
                function() {

                }
              );
            },
            function() {
              $mdToast.show($mdToast.simple().textContent('El Cliente no pudo ser borrado').position($scope.getToastPosition()).hideDelay(3000));
            }
          );
        };

        $scope.submit = function() {
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode( { "address": $scope.form.direccion }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
              var location = results[0].geometry.location;
              $scope.form.latitud = location.lat();
              $scope.form.longitud = location.lng();
            }

            Clientes.guardarCliente($scope.form,
              function() {
                $mdToast.show($mdToast.simple().textContent('El Cliente ha sido agregado Satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
                $scope.cerrarModal();
              },
              function() {
                $mdToast.show($mdToast.simple().textContent('El Cliente no pudo ser agregado').position($scope.getToastPosition()).hideDelay(3000));
              }
            );
          });
        };


        $scope.update = function(id) {
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode( { "address": $scope.cliente.direccion }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
              var location = results[0].geometry.location;
              $scope.cliente.latitud = location.lat();
              $scope.cliente.longitud = location.lng();
            }

            $scope.request = angular.copy($scope.cliente);

            delete $scope.request.id;
            delete $scope.request.nombreCompleto;
            delete $scope.request.estado;
            delete $scope.request.validador;
            delete $scope.request.agendaCliente;

            console.log($scope.request);

          Clientes.actualizarCliente({id: id},$scope.request,
              function() {
                $mdToast.show($mdToast.simple().textContent('El Cliente ha sido actualizado Satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
                $scope.cerrarModal();
              },
              function() {
                $mdToast.show($mdToast.simple().textContent('El Cliente no pudo ser actualizado').position($scope.getToastPosition()).hideDelay(3000));
              }
            );
          });
        };

        $scope.agregarClienteModal = function(ev) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

          $mdDialog.show({
		        templateUrl: 'app/clientes/agregarCliente.tmpl.html',
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

        // dgacitua: Cerrar modal
        $scope.cerrarModal = function() {
          $mdDialog.cancel().then(function() {
            // dgacitua: Actualizar Lista
            Clientes.filtrarCliente($scope.query,
              function(data) {
                $scope.clientes = data.resultados;
                $scope.totalResultados = data.totalResultados;
              },
              function() {

              }
            );
          });
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

(function() {
    'use strict';

    angular
		.module('myApp')
    .controller('MarcasController', MarcasController)
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

    MarcasController.$inject = ['$scope', '$mdDialog', '$mdMedia', '$filter', 'Services', 'Marcas', '$mdToast', 'UploadFile'];

    function MarcasController($scope, $mdDialog, $mdMedia, $filter, Services, Marcas, $mdToast, UploadFile) {

        $scope.backendUrl = Services.url;

        $scope.query = {
          id: '',
          nombre: '',
          imagen: '',
          pagina: 1
        };

        $scope.form = {
          nombre: ''
        };

        Marcas.filtrarMarca($scope.query,
          function(data) {
            $scope.marcas = data.resultados;
            $scope.totalResultados = data.totalResultados;
            angular.forEach($scope.marcas, function(marca) {});
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

        $scope.agregarMarcasModal = function(ev) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

          $mdDialog.show({
            templateUrl: 'app/marcas/agregarMarcas.tmpl.html',
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

        $scope.editarMarcaModal = function(ev,id) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

          Marcas.listarMarca({ id: id },
            function(data) {
              $scope.marca = data;

              // Mostrar Modal
              $mdDialog.show({
                  templateUrl: 'app/marcas/editarMarcas.tmpl.html',
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
              console.log("ERROR! No se puede mostrar la Marca " + error);
              $mdToast.show($mdToast.simple().textContent('ERROR! No se puede mostrar la Marca').position($scope.getToastPosition()).hideDelay(3000))
            }
          );
        };

        $scope.getMarcasFiltrado = function (pagina, limite) {
          $scope.query.pagina = pagina;

          Marcas.filtrarMarca($scope.query,
            function(data) {
              $scope.marcas = data.resultados;
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
           Marcas.filtrarMarca($scope.query,
              function(data) {
                $scope.marcas = data.resultados;
                $scope.totalResultados = data.totalResultados;
              },
              function() {

              }
            );
          });
        };

        $scope.submit = function(){
          var file = $scope.myFile;

          if ($scope.projectForm.file.$valid && $scope.myFile) {
            var filename = 'imagen';
            var uploadUrl = Services.url + 'imagen/subir';
            UploadFile.uploadFileToUrl(file, uploadUrl, filename)
              .success(function(data) {
                console.log(data);
                $scope.imagen = data[0];
                $scope.form.imagen = {};
                $scope.form.imagen.id = $scope.imagen.id;
                //console.log($scope.form);

                Marcas.guardarMarca($scope.form,
                  function(data) {
                    $mdToast.show($mdToast.simple().textContent('La Marca ha sido agregada satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
                  },
                  function(data) {
                    $mdToast.show($mdToast.simple().textContent('No se pudo agregar la Marca').position($scope.getToastPosition()).hideDelay(3000));
                  });
              })
              .error(function(data) {
                $mdToast.show($mdToast.simple().textContent('No se pudo agregar la Marca').position($scope.getToastPosition()).hideDelay(3000));
              });
          }
          else {
            Marcas.guardarMarca($scope.form,
              function(data) {
                $mdToast.show($mdToast.simple().textContent('La Marca ha sido agregada satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
              },
              function(data) {
                $mdToast.show($mdToast.simple().textContent('No se pudo agregar la Marca').position($scope.getToastPosition()).hideDelay(3000));
              });
          }
        };

        $scope.update = function(id){
          var file = $scope.myFile;

          if ($scope.projectForm.file.$valid && $scope.myFile) {
            var filename = 'imagen';
            var uploadUrl = Services.url + 'imagen/subir';
            UploadFile.uploadFileToUrl(file, uploadUrl, filename)
              .success(function(data) {
                //console.log(data);
                $scope.imagen = data[0];
                $scope.marca.imagen = {};
                $scope.marca.imagen.id = $scope.imagen.id;
                //console.log($scope.marca);

                Marcas.actualizarMarca({ id: id },$scope.marca,
                  function(data) {
                    $mdToast.show($mdToast.simple().textContent('La Marca ha sido actualizada satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
                  },
                  function(data) {
                    $mdToast.show($mdToast.simple().textContent('No se pudo actualizar la Marca').position($scope.getToastPosition()).hideDelay(3000));
                  });
              })
              .error(function(data) {
                $mdToast.show($mdToast.simple().textContent('No se pudo actualizar la Marca').position($scope.getToastPosition()).hideDelay(3000));
              });
          }
          else {
            Marcas.actualizarMarca({ id: id },$scope.marca,
              function(data) {
                $mdToast.show($mdToast.simple().textContent('La Marca ha sido actualizada satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
              },
              function(data) {
                $mdToast.show($mdToast.simple().textContent('No se pudo actualizar la Marca').position($scope.getToastPosition()).hideDelay(3000));
              });
          }
        };

        $scope.borrarMarca = function(id) {
          Marcas.borrarMarca({ id: id },
            function() {
              $mdToast.show($mdToast.simple().textContent('La Marca ha sido borrada Satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
              Marcas.filtrarMarca($scope.query,
                function(data) {
                  $scope.marcas = data.resultados;
                  $scope.totalResultados = data.totalResultados;
                  angular.forEach($scope.marcas, function(marca) {});
                },
                function() {

                }
              );
            },
            function() {
              $mdToast.show($mdToast.simple().textContent('La Marca no pudo ser borrada').position($scope.getToastPosition()).hideDelay(3000));
            }
          );
        };
      }
})();

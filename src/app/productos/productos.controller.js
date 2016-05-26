/**
 * Created by dgacitua on 26-05-16.
 */
(function() {
  'use strict';

  angular
    .module('myApp')
    .controller('ProductosController', ProductosController)
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

  ProductosController.$inject = ['$scope', '$mdDialog', '$mdMedia', '$filter', 'Services', 'Productos', '$mdToast', 'UploadFile'];

  function ProductosController($scope, $mdDialog, $mdMedia, $filter, Services, Productos, $mdToast, UploadFile) {

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

    Productos.filtrarProducto($scope.query,
      function(data) {
        $scope.productos = data.resultados;
        $scope.totalResultados = data.totalResultados;
        angular.forEach($scope.productos, function(producto) {});
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

    // Ver Producto Modal
    $scope.mostrarProductoModal = function(ev, id) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

      Productos.listarProductos({ id: id },
        function(data) {
          $scope.producto = data;

          // Mostrar Modal
          $mdDialog.show({
              templateUrl: 'app/productos/productoDetalle.tmpl.html',
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
          console.log("ERROR! No se puede mostrar la Producto " + error);
          $mdToast.show($mdToast.simple().textContent('ERROR! No se puede mostrar la Producto').position($scope.getToastPosition()).hideDelay(3000))
        }
      );
    };

    $scope.editarProductoModal = function(ev,id) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

      Productos.listarProductos({ id: id },
        function(data) {
          $scope.producto = data;

          // Mostrar Modal
          $mdDialog.show({
              templateUrl: 'app/productos/productoEditar.tmpl.html',
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
          console.log("ERROR! No se puede mostrar la Producto " + error);
          $mdToast.show($mdToast.simple().textContent('ERROR! No se puede mostrar la Producto').position($scope.getToastPosition()).hideDelay(3000))
        }
      );
    };


    $scope.borrarProducto = function(id) {
      Productos.borrarProducto({ id: id },
        function() {
          $mdToast.show($mdToast.simple().textContent('La Producto ha sido borrada Satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
          Productos.filtrarProducto($scope.query,
            function(data) {
              $scope.productos = data.resultados;
              $scope.totalResultados = data.totalResultados;
              angular.forEach($scope.productos, function(producto) {});
            },
            function() {

            }
          );
        },
        function() {
          $mdToast.show($mdToast.simple().textContent('La Producto no pudo ser borrada').position($scope.getToastPosition()).hideDelay(3000));
        }
      );
    };

    $scope.getProductosFiltrado = function (pagina, limite) {
      $scope.query.pagina = pagina;

      Productos.filtrarProducto($scope.query,
        function(data) {
          $scope.productos = data.resultados;
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
        Productos.filtrarProducto($scope.query,
          function(data) {
            $scope.productos = data.resultados;
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

            Productos.guardarProducto($scope.form,
              function(data) {
                $mdToast.show($mdToast.simple().textContent('La Producto ha sido agregada satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
              },
              function(data) {
                $mdToast.show($mdToast.simple().textContent('No se pudo agregar la Producto').position($scope.getToastPosition()).hideDelay(3000));
              });
          })
          .error(function(data) {
            $mdToast.show($mdToast.simple().textContent('No se pudo agregar la Producto').position($scope.getToastPosition()).hideDelay(3000));
          });
      }
      else {
        Productos.guardarProducto($scope.form,
          function(data) {
            $mdToast.show($mdToast.simple().textContent('La Producto ha sido agregada satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
          },
          function(data) {
            $mdToast.show($mdToast.simple().textContent('No se pudo agregar la Producto').position($scope.getToastPosition()).hideDelay(3000));
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
            $scope.producto.imagen = {};
            $scope.producto.imagen.id = $scope.imagen.id;
            //console.log($scope.producto);

            Productos.actualizarProducto({ id: id },$scope.producto,
              function(data) {
                $mdToast.show($mdToast.simple().textContent('La Producto ha sido actualizada satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
              },
              function(data) {
                $mdToast.show($mdToast.simple().textContent('No se pudo actualizar la Producto').position($scope.getToastPosition()).hideDelay(3000));
              });
          })
          .error(function(data) {
            $mdToast.show($mdToast.simple().textContent('No se pudo actualizar la Producto').position($scope.getToastPosition()).hideDelay(3000));
          });
      }
      else {
        Productos.actualizarProducto({ id: id },$scope.producto,
          function(data) {
            $mdToast.show($mdToast.simple().textContent('La Producto ha sido actualizada satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
          },
          function(data) {
            $mdToast.show($mdToast.simple().textContent('No se pudo actualizar la Producto').position($scope.getToastPosition()).hideDelay(3000));
          });
      }
    };
  }
})();

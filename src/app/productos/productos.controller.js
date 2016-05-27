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

  ProductosController.$inject = ['$scope', '$mdDialog', '$mdMedia', '$filter', 'Services', 'Productos', 'Marcas', 'Categorias', '$mdToast', 'UploadFile'];

  function ProductosController($scope, $mdDialog, $mdMedia, $filter, Services, Productos, Marcas, Categorias, $mdToast, UploadFile) {

    $scope.backendUrl = Services.url;

    $scope.query = {
      pagina: 1
    };

    $scope.form = {};
    $scope.marcas = {};
    $scope.categoria = {};

    $scope.estados = [
      {id:1,tipo:'SUSP',nombre:'Suspendido'},
      {id:2,tipo:'NODISP',nombre:'No disponible'},
      {id:3,tipo:'DISP',nombre:'Disponible'}
    ];

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

    $scope.agregarProductoModal = function(ev,id) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

      // Mostrar Modal
      $mdDialog.show({
          templateUrl: 'app/productos/productoAgregar.tmpl.html',
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
    };

    // Ver Producto Modal
    $scope.mostrarProductoModal = function(ev, id) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

      Productos.listarProducto({ id: id },
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
          console.log("ERROR! No se puede mostrar el Producto " + error);
          $mdToast.show($mdToast.simple().textContent('ERROR! No se puede mostrar el Producto').position($scope.getToastPosition()).hideDelay(3000))
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
          $mdToast.show($mdToast.simple().textContent('ERROR! No se puede mostrar el Producto').position($scope.getToastPosition()).hideDelay(3000))
        }
      );
    };


    $scope.borrarProducto = function(id) {
      Productos.borrarProducto({ id: id },
        function() {
          $mdToast.show($mdToast.simple().textContent('El Producto ha sido borrado Satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
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
          $mdToast.show($mdToast.simple().textContent('El Producto no pudo ser borrado').position($scope.getToastPosition()).hideDelay(3000));
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
                $mdToast.show($mdToast.simple().textContent('El Producto ha sido agregado satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
              },
              function(data) {
                $mdToast.show($mdToast.simple().textContent('No se pudo agregar el Producto').position($scope.getToastPosition()).hideDelay(3000));
              });
          })
          .error(function(data) {
            $mdToast.show($mdToast.simple().textContent('No se pudo agregar el Producto').position($scope.getToastPosition()).hideDelay(3000));
          });
      }
      else {
        Productos.guardarProducto($scope.form,
          function(data) {
            $mdToast.show($mdToast.simple().textContent('El Producto ha sido agregado satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
          },
          function(data) {
            $mdToast.show($mdToast.simple().textContent('No se pudo agregar el Producto').position($scope.getToastPosition()).hideDelay(3000));
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
                $mdToast.show($mdToast.simple().textContent('El Producto ha sido actualizado satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
              },
              function(data) {
                $mdToast.show($mdToast.simple().textContent('No se pudo actualizar el Producto').position($scope.getToastPosition()).hideDelay(3000));
              });
          })
          .error(function(data) {
            $mdToast.show($mdToast.simple().textContent('No se pudo actualizar el Producto').position($scope.getToastPosition()).hideDelay(3000));
          });
      }
      else {
        Productos.actualizarProducto({ id: id },$scope.producto,
          function(data) {
            $mdToast.show($mdToast.simple().textContent('El Producto ha sido actualizado satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
          },
          function(data) {
            $mdToast.show($mdToast.simple().textContent('No se pudo actualizar el Producto').position($scope.getToastPosition()).hideDelay(3000));
          });
      }
    };

    $scope.cargarMarcas = function () {
      Marcas.listarMarcas(function(data) {
        $scope.marcas = data;
      });
    };

    $scope.cargarCategorias = function () {
      Categorias.listarCategorias(function(data) {
        $scope.categorias = data;
      });
    };
  }
})();

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

  ProductosController.$inject = ['$scope', '$mdDialog', '$mdMedia', '$filter', 'Services', 'Productos', 'Marcas', 'Categorias', '$mdToast', 'UploadFile', '$q','Descuentos'];

  function ProductosController($scope, $mdDialog, $mdMedia, $filter, Services, Productos, Marcas, Categorias, $mdToast, UploadFile, $q, Descuentos) {

    $scope.backendUrl = Services.url;

    $scope.query = {
      pagina: 1,
      estado: '',
      nombre: '',
      marca: '',
      categoria: ''
    };

    $scope.form = {};
    $scope.marcas = {};
    $scope.categorias = {};
    $scope.descuentos = {};
    $scope.descuentosArray = [];

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

    Categorias.listarCategorias(function(data) {
      $scope.categorias = data;
    });

    Marcas.listarMarcas(function(data) {
      $scope.marcas = data
    });

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

      /*
      Marcas.listarMarcas(function(data) {
        $scope.marcas = data;
      });

      Categorias.listarCategorias(function(data) {
      $scope.categorias = data;
      });

      */

      //var p1 = $scope.cargarMarcas();
      //var p2 = $scope.cargarCategorias();
      var p3 = $scope.cargarProducto(id);
      /*
      Productos.listarProducto({ id: id },
        function(data) {
          $scope.producto = data;
      */
      $q.all([p3]).then(function(data) {
          //console.log($scope.producto);



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

      //var p1 = $scope.cargarMarcas();
      //var p2 = $scope.cargarCategorias();
      var p3 = $scope.cargarProducto(id);

      $q.all([p3]).then(function(data) {
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
          console.log("ERROR! No se puede mostrar el Producto " + error);
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

      $scope.form.marca = { id: $scope.marcaTemp.id };
      $scope.form.categorias = [ { id: $scope.categoriaTemp.id } ];

      if ($scope.projectForm.file.$valid && $scope.myFile) {
        var filename = 'imagen';
        var uploadUrl = Services.url + 'imagen/subir';
        UploadFile.uploadFileToUrl(file, uploadUrl, filename)
          .success(function(data) {
            console.log(data);
            $scope.imagen = data[0];

            $scope.form.imagen = {};
            $scope.form.imagen.id = $scope.imagen.id;

            console.log($scope.form);

            Productos.guardarProducto($scope.form,
              function(data) {
                console.log(data);
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
        console.log($scope.form);

        Productos.guardarProducto($scope.form,
          function(data) {
            console.log(data);
            $mdToast.show($mdToast.simple().textContent('El Producto ha sido agregado satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
          },
          function(data) {
            $mdToast.show($mdToast.simple().textContent('No se pudo agregar el Producto').position($scope.getToastPosition()).hideDelay(3000));
          });
      }
    };

    $scope.submitDescuento = function(){

      for ( var i=0 ; i < $scope.descuentosArray.length; i++) {

      }
    };

    

    $scope.update = function(id){
      var file = $scope.myFile;

      $scope.producto.marca = { id: $scope.producto.marcaTemp.id };
      $scope.producto.categorias = [ { id: $scope.producto.categoriaTemp.id } ];
      $scope.producto.estado = $scope.producto.estadoTemp.tipo;

      if ($scope.projectForm.file.$valid && $scope.myFile) {
        var filename = 'imagen';
        var uploadUrl = Services.url + 'imagen/subir';
        UploadFile.uploadFileToUrl(file, uploadUrl, filename)
          .success(function(data) {
            $scope.imagen = data[0];

            $scope.producto.imagen = {};
            $scope.producto.imagen.id = $scope.imagen.id;

            console.log($scope.producto);

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
        console.log($scope.producto);

        Productos.actualizarProducto({ id: id },$scope.producto,
          function(data) {
            $mdToast.show($mdToast.simple().textContent('El Producto ha sido actualizado satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
          },
          function(data) {
            $mdToast.show($mdToast.simple().textContent('No se pudo actualizar el Producto').position($scope.getToastPosition()).hideDelay(3000));
          });
      }
    };

    $scope.filtrarProductos = function() {
      $scope.query.categoria = $scope.filter.form.filtroCategoria? $scope.filter.form.filtroCategoria.nombre : '';
      $scope.query.estado = $scope.filter.form.filtroEstado? $scope.filter.form.filtroEstado.id : '';
      $scope.query.nombre = $scope.filter.form.filtroNombre? $scope.filter.form.filtroNombre : '';
      $scope.query.marca = $scope.filter.form.filtroMarca? $scope.filter.form.filtroMarca.nombre : '';
      $scope.query.pagina = 1;

      console.log($scope.query);

      Productos.filtrarProducto($scope.query,
        function(data) {
          $scope.productos = data.resultados;
          $scope.totalResultados = data.totalResultados;
        },
        function() {

        }
      );
    };

    $scope.removerFiltro = function() {
      $scope.filter.show = false;
      $scope.query.categoria = '';
      $scope.query.estado = '';
      $scope.query.nombre = '';
      $scope.query.marca = '';
      $scope.query.pagina = 1;

      if($scope.filter.form.$dirty) {
        $scope.filter.form.$setPristine();
      }

      $scope.filter.form.filtroCategoria = '';
      $scope.filter.form.filtroNombre = '';
      $scope.filter.form.filtroEstado = '';
      $scope.filter.form.filtroMarca = '';

      Productos.filtrarProducto($scope.query,
        function(data) {
          $scope.productos = data.resultados;
          $scope.totalResultados = data.totalResultados;
        },
        function() {

        }
      );
    };

    $scope.cargarMarcaActual = function (id) {
      var defered = $q.defer();
      var promise = defered.promise;

      Marcas.listarMarca({id: id}, function(data) {
          $scope.producto.marca = data;
          defered.resolve(data);
        },
        function(err) {
          defered.reject(err);
        });

      return promise;
    };

    $scope.cargarMarcas = function () {
      var defered = $q.defer();
      var promise = defered.promise;

      Marcas.listarMarcas(function(data) {
        $scope.marcas = data;
        defered.resolve(data);
      },
      function(err) {
        defered.reject(err);
      });

      return promise;
    };

    $scope.cargarCategorias = function () {
      var defered = $q.defer();
      var promise = defered.promise;

      Categorias.listarCategorias(function(data) {
        $scope.categorias = data;
        defered.resolve(data);
      },
      function(err) {
        defered.reject(err);
      });

      return promise;
    };

    $scope.cargarProducto = function (id) {
      var defered = $q.defer();
      var promise = defered.promise;

      Productos.listarProducto({id: id},
        function(data) {
          $scope.producto = data;
          $scope.descuentos = data.descuentos;
          if ($scope.marcas) {
            var aux = $scope.producto.marca? $scope.producto.marca : 'No existe';
            $scope.producto.marcaTemp = angular.copy($filter('filter')($scope.marcas, function(d) {return d.nombre === aux;})[0]);
            //console.log($scope.producto.marcaTemp);
          }

          if ($scope.categorias) {
            var aux = $scope.producto.categorias[0]? $scope.producto.categorias[0].nombre : 'No existe';
            $scope.producto.categoriaTemp = angular.copy($filter('filter')($scope.categorias, function(d) {return d.nombre === aux;})[0]);
            //console.log($scope.producto.categoriaTemp);
          }

          if ($scope.estados) {
            $scope.producto.estadoTemp = angular.copy($filter('filter')($scope.estados, function (d) {return d.nombre === $scope.producto.estado.nombre;})[0]);
          }

          defered.resolve(data);
        },
        function(err) {
          defered.reject(err);
        });

      return promise;
    };
  }
})();

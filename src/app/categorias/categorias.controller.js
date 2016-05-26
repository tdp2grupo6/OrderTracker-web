/**
 * Created by dgacitua on 25-05-16.
 */
(function() {
  'use strict';

  angular
    .module('myApp')
    .controller('CategoriasController', CategoriasController)
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

  CategoriasController.$inject = ['$scope', '$mdDialog', '$mdMedia', '$filter', 'Services', 'Categorias', '$mdToast'];

  function CategoriasController($scope, $mdDialog, $mdMedia, $filter, Services, Categorias, $mdToast) {

    $scope.query = {
      pagina: 1,
      order: ''
    };

    $scope.form = {
      nombre: '',
      descripcion: ''
    };

    Categorias.filtrarCategoria($scope.query,
      function(data) {
        $scope.categorias = data.resultados;
        $scope.totalResultados = data.totalResultados;
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

    $scope.agregarCategoriaModal = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

      // Mostrar Modal
      $mdDialog.show({
          templateUrl: 'app/categorias/agregarCategoria.tmpl.html',
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

    $scope.editarCategoriaModal = function(ev,id) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

      Categorias.listarCategoria({ id: id },
        function(data) {
          $scope.categoria = data;

          // Mostrar Modal
          $mdDialog.show({
              templateUrl: 'app/categorias/editarCategoria.tmpl.html',
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
          console.log("ERROR! No se puede mostrar la Categoria " + error);
          $mdToast.show($mdToast.simple().textContent('ERROR! No se puede mostrar la Categoria').position($scope.getToastPosition()).hideDelay(3000))
        }
      );
    };


    $scope.borrarCategoria = function(id) {
      Categorias.borrarCategoria({ id: id },
        function() {
          $mdToast.show($mdToast.simple().textContent('La Categoria ha sido borrada Satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
          Categorias.filtrarCategoria($scope.query,
            function(data) {
              $scope.categorias = data.resultados;
              $scope.totalResultados = data.totalResultados;
            },
            function() {

            }
          );
        },
        function() {
          $mdToast.show($mdToast.simple().textContent('La Categoria no pudo ser borrada').position($scope.getToastPosition()).hideDelay(3000));
        }
      );
    };

    $scope.getCategoriasFiltrado = function (pagina, limite) {
      $scope.query.pagina = pagina;

      Categorias.filtrarCategoria($scope.query,
        function(data) {
          $scope.categorias = data.resultados;
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
        Categorias.filtrarCategoria($scope.query,
          function(data) {
            $scope.categorias = data.resultados;
            $scope.totalResultados = data.totalResultados;
          },
          function() {

          }
        );
      });
    };

    $scope.submit = function() {
      Categorias.guardarCategoria($scope.categoria,
        function() {
          $mdToast.show($mdToast.simple().textContent('La Categoria ha sido creada satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
          $scope.cerrarModal();
        },
        function() {
          $mdToast.show($mdToast.simple().textContent('La Categoria no pudo ser creada').position($scope.getToastPosition()).hideDelay(3000));
        }
      );
    };


    $scope.update = function(id) {
      $scope.request = angular.copy($scope.categoria);
      console.log($scope.request);

      Categorias.actualizarCategoria({id: id},$scope.request,
        function() {
          $mdToast.show($mdToast.simple().textContent('La Categoria ha sido actualizada satisfactoriamente').position($scope.getToastPosition()).hideDelay(3000));
          $scope.cerrarModal();
        },
        function() {
          $mdToast.show($mdToast.simple().textContent('La Categoria no pudo ser actualizada').position($scope.getToastPosition()).hideDelay(3000));
        }
      );
    };
  }
})();

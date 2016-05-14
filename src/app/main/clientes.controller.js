(function() {
    'use strict';

    angular
		.module('myApp')
     	.controller('ClientesController', ClientesController);


      ClientesController.$inject = ['$scope', '$mdDialog', '$mdMedia','$filter', 'Clientes', 'Services'];

      function ClientesController($scope, $mdDialog, $mdMedia, $filter, Services, Clientes) {


      	$scope.query = {
          estado: '',
          id: '',
          fechaInicio: '',
          fechaFin: '',
          pagina: 1
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
      }
})();
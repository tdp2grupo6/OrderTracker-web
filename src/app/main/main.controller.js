(function() {
		'use strict';

		angular
			.module('myApp')
			.controller('MainController', MainController);

			MainController.$inject = ['$scope', '$mdDialog', '$mdMedia'];

			function MainController($scope, $mdDialog, $mdMedia) {
				$scope.contentUrl = '';

				$scope.sections = [
		          {id:1,tipo:'ESTADO_NUEVO',nombre:'Nuevo'},
		          {id:2,tipo:'ESTADO_CONFIRMADO',nombre:'Confirmado'},
		          {id:3,tipo:'ESTADO_ENVIADO',nombre:'Enviado'},
		          {id:4,tipo:'ESTADO_ACEPTADO',nombre:'Aceptado'},
		          {id:5,tipo:'ESTADO_DESPACHADO',nombre:'Despachado'},
		          {id:6,tipo:'ESTADO_CANCELADO',nombre:'Cancelado'}
		        ];

	      		$scope.sidenavOpen = true;

		      	$scope.openMenu = function() {
		      		$scope.sidenavOpen = true;
		      	}

		      	$scope.closeMenu = function() {
		      		$scope.sidenavOpen = false;
		      	}

	/*    	$scope.showBusquedaPacienteModal = function(ev) {
					var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
					$mdDialog.show({
						//templateUrl: 'app/main/busquedaPaciente.tmpl.html',
						targetEvent: ev,
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
				};*/
			}
})();

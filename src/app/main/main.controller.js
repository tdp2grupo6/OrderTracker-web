(function() {
		'use strict';

		angular
			.module('myApp')
			.controller('MainController', MainController);

			MainController.$inject = ['$scope', '$mdDialog', '$mdMedia'];

			function MainController($scope, $mdDialog, $mdMedia) {
				$scope.contentUrl = '';

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

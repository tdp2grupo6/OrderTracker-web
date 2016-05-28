(function() {
		'use strict';

		angular
			.module('myApp')
			.controller('MainController', MainController);

			MainController.$inject = ['$scope', '$mdDialog', '$mdMedia', '$cookies', '$location', 'Authentication'];

			function MainController($scope, $mdDialog, $mdMedia, $cookies, $location, Authentication) {
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
        };

        $scope.closeMenu = function() {
          $scope.sidenavOpen = false;
        };

        $scope.logout = function() {
          $cookies.remove('username');
          $cookies.remove('tokenType');
          $cookies.remove('expiration');
          $cookies.remove('accessToken');
          $cookies.remove('refreshToken');
          Authentication.setAuthenticated(false);
          $location.url('/login');
        };
			}
})();

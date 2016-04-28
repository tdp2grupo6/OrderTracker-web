(function() {
		'use strict';

		angular
			.module('myApp')
			.controller('MainController', MainController);
				
			MainController.$inject = ['$scope', '$mdDialog', '$mdMedia'];

			function MainController($scope, $mdDialog, $mdMedia) {
				$scope.contentUrl = '';

			}
})();

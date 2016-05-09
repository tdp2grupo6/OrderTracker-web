(function() {
    'use strict';

    angular
		.module('myApp')
     	.controller('ClientesController', ClientesController);


      ClientesController.$inject = ['$scope', '$mdDialog', '$mdMedia'];

      function ClientesController($scope, $mdDialog, $mdMedia) {
      }
})();
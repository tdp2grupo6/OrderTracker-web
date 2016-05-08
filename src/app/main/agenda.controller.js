(function() {
    'use strict';

    angular
		.module('myApp')
     	.controller('AgendaController', AgendaController);


      AgendaController.$inject = ['$scope', '$mdDialog', '$mdMedia'];

      function AgendaController($scope, $mdDialog, $mdMedia) {
      }
})();

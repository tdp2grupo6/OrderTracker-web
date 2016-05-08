(function() {
	'use strict';

	angular
		.module('myApp')
		.factory('Agenda', Agenda);

		Agenda.$inject = ['$resource', 'Services', '$http'];

		function Agenda($resource, Services, $http) {

		  	return $resource(Services.url + 'agenda', {},
	        {
	          listarPedidos: {
	            method: 'GET',
	            isArray: true,
	            headers: {
	              'Content-Type': 'application/json'
	            }
	          }
          }
          );
        }
})();
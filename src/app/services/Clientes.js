(function() {
	'use strict';

	angular
		.module('myApp')
		.factory('Clientes', Clientes);

		Clientes.$inject = ['$resource', 'Services'];

		function Clientes($resource, Services) {

		  	return $resource(Services.url + 'clientes', {},
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

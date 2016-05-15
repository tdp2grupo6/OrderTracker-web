(function() {
	'use strict';

	angular
		.module('myApp')
		.factory('Agenda', Agenda);

		Agenda.$inject = ['$resource', 'Services'];

		function Agenda($resource, Services) {

		  	return $resource(Services.url + 'agenda', {},
	        {
	          listarVendedores: {
	            method: 'GET',
            	url: Services.url + 'vendedor',
	            isArray: true,
	            headers: {
	              'Content-Type': 'application/json'
	            }
	          },

	          listarClientes: {
	            method: 'GET',
            	url: Services.url + 'cliente',
	            isArray: true,
	            headers: {
	              'Content-Type': 'application/json'
	            }
	          },

	          filtrarClientes: {
	            method: 'POST',
            	url: Services.url + 'cliente/filtro',
	            headers: {
	              'Content-Type': 'application/json'
	            }
	          },

	          cargarAgendaVendedor: {
	            method: 'GET',
            	url: Services.url + 'agenda/admin-semana/:idVendedor',
				params: {idVendedor: '@idVendedor'},
	            headers: {
	              'Content-Type': 'application/json'
	            }
	          }
          }
          );
        }
})();
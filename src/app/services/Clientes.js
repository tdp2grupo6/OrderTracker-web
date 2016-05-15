(function() {
	'use strict';

	angular
		.module('myApp')
		.factory('Clientes', Clientes);

		Clientes.$inject = ['$resource', 'Services'];

		function Clientes($resource, Services) {

		  	return $resource(Services.url + 'cliente', {},
	        {
	          listarClientes: {
	            method: 'GET',
	            isArray: true,
	            headers: {
	              'Content-Type': 'application/json'
	            }
	          },

	          guardarCliente: {
            	method: 'POST',
            	headers: {
              		'Content-Type': 'application/json'
            	}
          	  },

          	  actualizarCliente: {
            	method: 'PUT',
            	url: Services.url + 'cliente/:id',
            	params: {id: '@id'},
            	headers: {
              		'Content-Type': 'application/json'
            	}
          	  },

          	  borrarCliente: {
            	method: 'DELETE',
            	url: Services.url + 'cliente/:id',
				params: {id: '@id'},
            	headers: {
              		'Content-Type': 'application/json'
            	}
          	  },

          	  listarCliente: {
            	method: 'GET',
            	url: Services.url + 'cliente/:id',
            	params: {id: '@id'},
            	headers: {
              		'Content-Type': 'application/json'
            	}
			  },

              filtrarCliente: {
            	method: 'POST',
            	url: Services.url + 'cliente/filtro',
            	headers: {
              		'Content-Type': 'application/json'
            	}
          	  }
          	}
          );
        }
})();

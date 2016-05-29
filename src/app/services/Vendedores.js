(function() {
	'use strict';

	angular
		.module('myApp')
		.factory('Vendedores', Vendedores);

		Vendedores.$inject = ['$resource', 'Services'];

		function Vendedores($resource, Services) {
      return $resource(Services.url + 'vendedor', {},
        {
          listarVendedores: {
            method: 'GET',
            isArray: true,
            headers: {
              'Content-Type': 'application/json'
            }
          },

          guardarVendedor: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          },

          actualizarVendedor: {
            method: 'PUT',
            url: Services.url + 'vendedor/:id',
            params: {id: '@id'},
            headers: {
              'Content-Type': 'application/json'
            }
          },

          borrarVendedor: {
            method: 'DELETE',
            url: Services.url + 'vendedor/:id',
						params: {id: '@id'},
            headers: {
              'Content-Type': 'application/json'
            }
          },

          listarVendedor: {
            method: 'GET',
            url: Services.url + 'vendedor/:id',
            params: {id: '@id'},
            headers: {
              'Content-Type': 'application/json'
            }

          },

          filtrarVendedores: {
            method: 'POST',
            url: Services.url + 'vendedor/filtro',
            headers: {
              'Content-Type': 'application/json'
            }
          },

          listaCortaVendedores: {
            method: 'GET',
            isArray: true,
            url: Services.url + 'vendedor/lista-corta',
            headers: {
              'Content-Type': 'application/json'
            }
          },

          transferirClientes: {
            method: 'POST',
            isArray: true,
            url: Services.url + 'vendedor/transferir-clientes',
            headers: {
              'Content-Type': 'application/json'
            } 
          }
        }
      );
    }
})();



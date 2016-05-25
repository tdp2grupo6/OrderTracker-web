(function() {
	'use strict';

	angular
		.module('myApp')
		.factory('Marcas', Marcas);

		Marcas.$inject = ['$resource', 'Services'];

		function Marcas($resource, Services) {
      return $resource(Services.url + 'marca', {},
        {
          listarMarcas: {
            method: 'GET',
            isArray: true,
            headers: {
              'Content-Type': 'application/json'
            }
          },

          guardarMarca: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          },

          actualizarMarca: {
            method: 'PUT',
            url: Services.url + 'marca/:id',
            params: {id: '@id'},
            headers: {
              'Content-Type': 'application/json'
            }
          },

          borrarMarca: {
            method: 'DELETE',
            url: Services.url + 'marca/:id',
						params: {id: '@id'},
            headers: {
              'Content-Type': 'application/json'
            }
          },

          listarMarca: {
            method: 'GET',
            url: Services.url + 'marca/:id',
            params: {id: '@id'},
            headers: {
              'Content-Type': 'application/json'
            }

          },

          filtrarMarca: {
            method: 'POST',
            url: Services.url + 'marca/filtro',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        }
      );
    }
})();



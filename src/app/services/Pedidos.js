(function() {
	'use strict';

	angular
		.module('myApp')
		.factory('Pedidos', Pedidos);

		Pedidos.$inject = ['$resource', 'Services', '$http'];

		function Pedidos($resource, Services) {
      /*
       this.listarPedidos = function() {
       var path = Services.url + "pedido";
       var query = $http.get(path);

       return query.then(function(res) {
       return res;
       });
       };

       this.listarPedidos = function(id) {
       var path = Services.url + "pedido/" + id;
       var query = $http.get(path);

       return query.then(function(res) {
       return res;
       });
       };

       this.filtrarPedido = function(parms) {
       var path = Services.url + "pedido/filtro";
       var query = $http.post(path, parms);

       return query.then(function(res) {
       return res;
       });
       };
       */
      return $resource(Services.url + 'pedido', {},
        {
          listarPedidos: {
            method: 'GET',
            isArray: true,
            headers: {
              'Content-Type': 'application/json'
            }
          },

          guardarPedido: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          },

          actualizarPedido: {
            method: 'PUT',
            url: Services.url + 'pedido/:id',
            params: {id: '@id'},
            headers: {
              'Content-Type': 'application/json'
            }
          },

          borrarPedido: {
            method: 'DELETE',
            url: Services.url + 'pedido/:id',
						params: {id: '@id'},
            headers: {
              'Content-Type': 'application/json'
            }
          },

          listarPedido: {
            method: 'GET',
            url: Services.url + 'pedido/:id',
            params: {id: '@id'},
            headers: {
              'Content-Type': 'application/json'
            }

          },

          filtrarPedido: {
            method: 'POST',
            url: Services.url + 'pedido/filtro',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        }
      );
    }
})();



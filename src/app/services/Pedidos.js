(function() {
	'use strict';

	angular
		.module('myApp')
		.factory('Pedidos', Pedidos);

		Pedidos.$inject = ['$resource', 'Services'];

		function Pedidos($resource, Services) {
			return $resource(Services.url + 'pedidos', {},
				{
					listarTodosPedidos: {
						method: 'GET',
						isArray: true,
						headers : {
							'Content-Type': 'application/json'
						}
					},

					guardarPedido: {
						method: 'POST',
						headers : {
							'Content-Type': 'application/json'
						}
					},

					actualizarPedido: {
						method: 'PUT',
						url: Services.url + 'pedidos/:id',
						headers: {
							'Content-Type': 'application/json'	
						}
					},

					borrarPedido: {
						method: 'DELETE',
						url: Services.url + 'pedidos/:id',
						headers: {
							'Content-Type': 'application/json'	
						}
					},

					listarPedido: {
						method: 'GET',
						url: Services.url + 'pedidos/:id',
						headers : {
							'Content-Type': 'application/json'
						}

					}
				}
			);
		}
})();



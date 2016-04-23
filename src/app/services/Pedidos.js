///pedido/buscar-categoria/$id

(function() {
	'use strict';

	angular
		.module('myApp')
		.controller('Pedidos', Pedidos);

		Pedidos.$inject = ['$resource', 'Services'];

		function Pedidos($resource, Services) {

			var interfaz = {

				serviceCall : $resource(Services.url + 'pedidos', {},
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
				})
			}

			return interfaz;
		}
})();



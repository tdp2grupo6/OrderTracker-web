/**
 * Created by dgacitua on 26-05-16.
 */
(function() {
  'use strict';

  angular
    .module('myApp')
    .factory('Productos', Productos);

  Productos.$inject = ['$resource', 'Services'];

  function Productos($resource, Services) {
    return $resource(Services.url + 'producto', {},
      {
        listarProductos: {
          method: 'GET',
          isArray: true,
          headers: {
            'Content-Type': 'application/json'
          }
        },

        guardarProducto: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },

        actualizarProducto: {
          method: 'PUT',
          url: Services.url + 'producto/:id',
          params: {id: '@id'},
          headers: {
            'Content-Type': 'application/json'
          }
        },

        borrarProducto: {
          method: 'DELETE',
          url: Services.url + 'producto/:id',
          params: {id: '@id'},
          headers: {
            'Content-Type': 'application/json'
          }
        },

        listarProducto: {
          method: 'GET',
          url: Services.url + 'producto/:id',
          params: {id: '@id'},
          headers: {
            'Content-Type': 'application/json'
          }

        },

        filtrarProducto: {
          method: 'POST',
          url: Services.url + 'producto/filtro',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      }
    );
  }
})();

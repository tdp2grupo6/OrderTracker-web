/**
 * Created by dgacitua on 25-05-16.
 */
(function() {
  'use strict';

  angular
    .module('myApp')
    .factory('Categorias', Categorias);

  Categorias.$inject = ['$resource', 'Services'];

  function Categorias($resource, Services) {
    return $resource(Services.url + 'categoria', {},
      {
        listarCategorias: {
          method: 'GET',
          isArray: true,
          headers: {
            'Content-Type': 'application/json'
          }
        },

        guardarCategoria: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },

        actualizarCategoria: {
          method: 'PUT',
          url: Services.url + 'categoria/:id',
          params: {id: '@id'},
          headers: {
            'Content-Type': 'application/json'
          }
        },

        borrarCategoria: {
          method: 'DELETE',
          url: Services.url + 'categoria/:id',
          params: {id: '@id'},
          headers: {
            'Content-Type': 'application/json'
          }
        },

        listarCategoria: {
          method: 'GET',
          url: Services.url + 'categoria/:id',
          params: {id: '@id'},
          headers: {
            'Content-Type': 'application/json'
          }

        },

        filtrarCategoria: {
          method: 'POST',
          url: Services.url + 'categoria/filtro',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      }
    );
  }
})();

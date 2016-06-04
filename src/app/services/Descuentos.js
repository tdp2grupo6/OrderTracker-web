/**
 * Created by mroitman on 04-06-16.
 */
(function() {
  'use strict';

  angular
    .module('myApp')
    .factory('Descuentos', Descuentos);

  Descuentos.$inject = ['$resource', 'Services'];

  function Descuentos($resource, Services) {
    return $resource(Services.url + 'descuento', {},
      {
        listarDescuentos: {
          method: 'GET',
          isArray: true,
          headers: {
            'Content-Type': 'application/json'
          }
        },

        guardarDescuento: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },

        actualizarDescuento: {
          method: 'PUT',
          url: Services.url + 'descuento/:id',
          params: {id: '@id'},
          headers: {
            'Content-Type': 'application/json'
          }
        },

        borrarDescuento: {
          method: 'DELETE',
          url: Services.url + 'descuento/:id',
          params: {id: '@id'},
          headers: {
            'Content-Type': 'application/json'
          }
        },

        filtrarDescuento: {
          method: 'POST',
          url: Services.url + 'descuento/filtro',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      }
    );
  }
})();

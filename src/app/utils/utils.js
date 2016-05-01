/**
 * Created by dgacitua on 30-04-16.
 */
(function() {
  'use strict';

  function dateFormat(date) {
    var format = "yyyy-MM-dd'T'HH:mm:ssZ";
    return $filter('date')(date, format);
  }

})();

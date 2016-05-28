(function() {
	'use strict';

	angular
		.module('myApp')
		.factory('Services', Services);

	Services.$inject = [];

	function Services() {
      var localUrl = 'http://localhost:8080/OrderTracker/';
      var remoteUrl = 'http://ordertracker-tdp2grupo6.rhcloud.com/';

    	return {
          url: localUrl,
          dateFormat: 'yyyy-MM-dd"T"HH:mm:ssZ'
    	};
	}
})();


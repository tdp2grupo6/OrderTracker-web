(function() {
	'use strict';

	angular
		.module('myApp')
		.factory('Services', Services);

	Services.$inject = [];

	function Services() {
    	return {
        	url: 'http://ordertracker-tdp2grupo6.rhcloud.com/',
          dateFormat: 'yyyy-MM-dd"T"HH:mm:ssZ'
    	};
	}
})();


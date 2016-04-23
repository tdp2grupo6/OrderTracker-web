(function() {
	'use strict';

	angular
		.module('myApp')
		.factory('Services', Services); 
			
	Services.$inject = [];

	function Services () {
    	return {
        	url: 'http://ordertrackerweb-tdp2grupo6.rhcloud.com/',
    	};
	}
})();


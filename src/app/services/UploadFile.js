(function() {
	'use strict';

	angular
		.module('myApp')
		.service('UploadFile', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl){
                var fd = new FormData();
                fd.append('file', file);
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function(data){
                    return data;
                })
                .error(function(){});
            }	
        }]);
})();



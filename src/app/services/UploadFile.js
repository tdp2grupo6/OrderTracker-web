(function() {
	'use strict';

	angular
		.module('myApp')
    .service('UploadFile', ['$http', function ($http) {
      this.uploadFileToUrl = function(file, uploadUrl, filename){
        var fd = new FormData();
        fd.append('file', file);
        fd.append('filename', filename);
        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
          })
          .success(function(data){
            //console.log(data);
            return data;
          })
          .error(function(data){
            //console.log(data);
            return data;
          });
      };
    }])
})();



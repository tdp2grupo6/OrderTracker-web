module.exports = {
	getRutaBackend: function () {
		if(process.env.OPENSHIFT_APP_NAME) {
  			return "http://ordertracker-tdp2grupo6.rhcloud.com/"
		}
		else {			
  			return "http://localhost:8080/"
		}
	}
};
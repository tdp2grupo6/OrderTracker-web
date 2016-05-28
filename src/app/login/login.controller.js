/**
 * Created by dgacitua on 28-05-16.
 */
(function() {
  'use strict';

  angular
    .module('myApp')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$cookies', '$location', 'Authentication'];

  function LoginController($scope, $cookies, $location, Authentication) {
    $scope.form = {
      username: '',
      password: '',
      app: 'Web'
    };

    $scope.error = '';

    $scope.activated = false;

    $scope.submit = function() {
      if ($scope.form.username.length !== 0 && $scope.form.password.length !== 0) {
        $scope.error = '';
        $scope.activated = true;
        Authentication.serviceCall.authenticate($scope.form,
          function(data) {
            if (data.roles.indexOf('ROLE_ADMIN') !== -1) {
              $cookies.put('username', data.username);
              $cookies.put('tokenType', data.token_type);
              $cookies.put('expiration', data.expires_in);
              $cookies.put('accessToken', data.access_token);
              $cookies.put('refreshToken', data.refresh_token);
              Authentication.setAuthenticated(true);
              $location.url('/main');
            }
            else {
              $scope.activated = false;
              $scope.error = 'No se tienen los permisos adecuados';
              console.log($scope.error);
            }
          },
          function() {
            $scope.activated = false;
            $scope.error = 'Usuario o contraseña incorrecta';
            console.log($scope.error);
          }
        );
      }
    };

    $scope.logout = function() {
      $cookies.remove('username');
      $cookies.remove('tokenType');
      $cookies.remove('expiration');
      $cookies.remove('accessToken');
      $cookies.remove('refreshToken');
      Authentication.setAuthenticated(false);
      $location.url('/login');
    }
  }
})();

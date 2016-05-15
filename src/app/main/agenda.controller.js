(function() {
    'use strict';

    angular
		.module('myApp')
     	.controller('AgendaController', AgendaController);


      AgendaController.$inject = ['$scope', '$mdDialog', '$mdMedia', 'Agenda'];

      function AgendaController($scope, $mdDialog, $mdMedia, Agenda) {

    	$scope.date = new Date();
      		
  		$scope.vendedorSeleccionado = false;

    	$scope.semana = [{id:0, nombre:'DOMINGO'},
    	{id:1, nombre:'LUNES'},
    	{id:2, nombre:'MARTES'},
    	{id:3, nombre:'MIÉRCOLES'},
    	{id:4, nombre:'JUEVES'},
    	{id:5, nombre:'VIERNES'},
    	{id:6, nombre:'SÁBADO'}];

      	Agenda.listarVendedores(
      		function(data) {
      			$scope.vendedores = data;
      		}
  		);

      	$scope.clienteFiltro = {
      		idCliente: 0, 
      		nombre: '', 
      		apellido: '', 
      		email: '', 
      		direccion: '', 
      		pagina: 1
      	};

  		$scope.seleccionarCliente = function() {
			$scope.clienteFiltro.idCliente = $scope.idClienteFilter;
			
	      	Agenda.filtrarClientes($scope.clienteFiltro,
	      		function(data) {
	      			$scope.disponibilidadCliente = (data.resultados[0].disponibilidad === '') ? 'Sin especificar' : data.resultados[0].disponibilidad;
	      			$scope.direccionCliente = data.resultados[0].direccion;
	      		}
	  		);
  		}

  		$scope.removeFilter = function () {
          	
          	$scope.filter.show = false;

			if($scope.filter.form.$dirty) {
				$scope.filter.form.$setPristine();
			}

      		$scope.vendedorSeleccionado = false;
  		}

      	$scope.buscarVendedor = function() {

	      	Agenda.listarClientes(
	      		function(data) {
	      			$scope.clientes = data;
	      		}
	  		);

      		$scope.vendedorSeleccionado = true;
			
			var idVendedor = {idVendedor:$scope.vendedorFilter};
      		Agenda.cargarAgendaVendedor(idVendedor,
      			function(data) {
  					
  					$scope.semanaVendedor = [data.agenda[0].listaClientes,
  						data.agenda[1].listaClientes,
  						data.agenda[2].listaClientes,
  						data.agenda[3].listaClientes,
  						data.agenda[4].listaClientes,
  						data.agenda[5].listaClientes,
  						data.agenda[6].listaClientes
					];
					//Variable tramposa para tener una fila en la grilla
					$scope.contador = [1];
      			},
	            function(error) {
	            	console.log(error);
	            }
			);
      	}

      	$scope.agregarCliente = function() {
      		var dia = $scope.diaSemana;
      		var cliente = $scope.idClienteFilter;
      		$scope.semanaVendedor[dia].push(cliente);
      	}

      }
})();

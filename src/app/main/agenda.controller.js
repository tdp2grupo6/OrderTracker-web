(function() {
    'use strict';

    angular
		.module('myApp')
     	.controller('AgendaController', AgendaController);


      AgendaController.$inject = ['$scope', '$mdDialog', '$mdMedia', 'Agenda', '$filter'];

      function AgendaController($scope, $mdDialog, $mdMedia, Agenda, $filter) {

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
	      			$scope.clientesNombres = [];
	      			angular.forEach(data, function(cliente) {
	      				$scope.clientesNombres.push({id: cliente.id, nombre: cliente.nombreCompleto});
	      			});
	      		}
	  		);

      		$scope.vendedorSeleccionado = true;
			
			var idVendedor = {idVendedor:$scope.vendedorFilter};
      		Agenda.cargarAgendaVendedor(idVendedor,
      			function(data) {
  					//Se arma la semana del vendedor con el codigo de dia y los id de clientes asociados
  					$scope.semanaVendedor = [
  						{codigoDia: data.agenda[0].codigoDia, clientes : data.agenda[0].listaClientes},
  						{codigoDia: data.agenda[1].codigoDia, clientes : data.agenda[1].listaClientes},
  						{codigoDia: data.agenda[2].codigoDia, clientes : data.agenda[2].listaClientes},
  						{codigoDia: data.agenda[3].codigoDia, clientes : data.agenda[3].listaClientes},
  						{codigoDia: data.agenda[4].codigoDia, clientes : data.agenda[4].listaClientes},
  						{codigoDia: data.agenda[5].codigoDia, clientes : data.agenda[5].listaClientes},
  						{codigoDia: data.agenda[6].codigoDia, clientes : data.agenda[6].listaClientes}
					];

					//Para cada dia, se trae el nombre del cliente para mostrarlo en la grilla
					var i = 0;

					//Domingo
					var agendaDomingo = $filter('filter')($scope.semanaVendedor, { codigoDia: 0})[0].clientes;
					$scope.agendaDomingo = [];
					for (i = 0; i < agendaDomingo.length; i++) {
						var cliente = $filter('filter')($scope.clientesNombres, { id: agendaDomingo[i]})[0].nombre;
						$scope.agendaDomingo.push(cliente);
					}

					//Lunes
					var agendaLunes = $filter('filter')($scope.semanaVendedor, { codigoDia: 1})[0].clientes;
					$scope.agendaLunes = [];
					for (i = 0; i < agendaLunes.length; i++) {
						var cliente = $filter('filter')($scope.clientesNombres, { id: agendaLunes[i]})[0].nombre;
						$scope.agendaLunes.push(cliente);
					}

					//Martes
					var agendaMartes = $filter('filter')($scope.semanaVendedor, { codigoDia: 2})[0].clientes;
					$scope.agendaMartes = [];
					for (i = 0; i < agendaMartes.length; i++) {
						var cliente = $filter('filter')($scope.clientesNombres, { id: agendaMartes[i]})[0].nombre;
						$scope.agendaMartes.push(cliente);
					}

					//Miercoles
					var agendaMiercoles = $filter('filter')($scope.semanaVendedor, { codigoDia: 3})[0].clientes;
					$scope.agendaMiercoles = [];
					for (i = 0; i < agendaMiercoles.length; i++) {
						var cliente = $filter('filter')($scope.clientesNombres, { id: agendaMiercoles[i]})[0].nombre;
						$scope.agendaMiercoles.push(cliente);
					}

					//Jueves
					var agendaJueves = $filter('filter')($scope.semanaVendedor, { codigoDia: 4})[0].clientes;
					$scope.agendaJueves = [];
					for (i = 0; i < agendaJueves.length; i++) {
						var cliente = $filter('filter')($scope.clientesNombres, { id: agendaJueves[i]})[0].nombre;
						$scope.agendaJueves.push(cliente);
					}

					//Viernes
					var agendaViernes = $filter('filter')($scope.semanaVendedor, { codigoDia: 5})[0].clientes;
					$scope.agendaViernes = [];
					for (i = 0; i < agendaViernes.length; i++) {
						var cliente = $filter('filter')($scope.clientesNombres, { id: agendaViernes[i]})[0].nombre;
						$scope.agendaViernes.push(cliente);
					}

					//Sabado
					var agendaSabado = $filter('filter')($scope.semanaVendedor, { codigoDia: 6})[0].clientes;
					$scope.agendaSabado = [];
					for (i = 0; i < agendaSabado.length; i++) {
						var cliente = $filter('filter')($scope.clientesNombres, { id: agendaSabado[i]})[0].nombre;
						$scope.agendaSabado.push(cliente);
					}

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
      		var cliente = parseInt($scope.idClienteFilter);
      		var listaPorDia = $filter('filter')($scope.semanaVendedor, { codigoDia: dia})[0].clientes;
      		listaPorDia.push(cliente);
      		

      		var clientesUnicos = $scope.agendaDomingo;
      		clientesUnicos.concat($scope.agendaLunes, $scope.agendaMartes, $scope.agendaMiercoles, 
      			$scope.agendaJueves, $scope.agendaViernes, $scope.agendaSabado);
      		console.log(clientesUnicos);
      	}

      }
})();

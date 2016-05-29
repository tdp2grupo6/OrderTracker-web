(function() {
    'use strict';

    angular
		.module('myApp')
     	.controller('AgendaController', AgendaController);


      AgendaController.$inject = ['$scope', '$filter', '$mdDialog', '$mdMedia', '$mdToast', 'Agenda'];

      function AgendaController($scope, $filter, $mdDialog, $mdMedia, $mdToast, Agenda) {

    	$scope.date = new Date();

    	$scope.requireMatch = true;

  		$scope.vendedorSeleccionado = false;

    	$scope.semana = [{id:0, nombre:'DOMINGO'},
    	{id:1, nombre:'LUNES'},
    	{id:2, nombre:'MARTES'},
    	{id:3, nombre:'MIÉRCOLES'},
    	{id:4, nombre:'JUEVES'},
    	{id:5, nombre:'VIERNES'},
    	{id:6, nombre:'SÁBADO'}];

        var last = {
           bottom: true,
           top: false,
           left: false,
           right: true
        };

        $scope.toastPosition = angular.extend({},last);

        function sanitizePosition() {
            var current = $scope.toastPosition;
            if ( current.bottom && last.top ) current.top = false;
            if ( current.top && last.bottom ) current.bottom = false;
            if ( current.right && last.left ) current.left = false;
            if ( current.left && last.right ) current.right = false;
            last = angular.extend({},current);
        }

        $scope.getToastPosition = function() {
            sanitizePosition();
            return Object.keys($scope.toastPosition)
            .filter(function(pos) { return $scope.toastPosition[pos]; })
            .join(' ');
        };

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
	      		},
	      		function(error) {
	      			avisar('No se puede obtener los clientes en este momento.');
	      		}
	  		);
  		};

  		$scope.removeFilter = function () {

          	$scope.filter.show = false;

          if($scope.filter.form.$dirty) {
            $scope.filter.form.$setPristine();
          }

      		$scope.vendedorSeleccionado = false;
  		};

  		function agregarClienteUnico(clienteId) {
        //Se guardan los clientes unicos
        if ($scope.clientesUnicos.length === 0) {
          $scope.clientesUnicos.push(clienteId);
        }
        else if ($scope.clientesUnicos.indexOf(clienteId) === -1) {
          $scope.clientesUnicos.push(clienteId);
        }
  		}

  		$scope.buscarCliente = function(text) {
  			var clientes = ($filter('filter')($scope.clientesNombres, { nombre: text}));
  			var r = [];
  			angular.forEach(clientes, function(cliente) {r.push(cliente.nombre);});
  			return r;
  		};

      	$scope.buscarVendedor = function() {

	      	Agenda.listarClientes(
	      		function(data) {
	      			$scope.clientes = data;
	      			$scope.clientesNombres = [];
	      			angular.forEach(data, function(cliente) {
	      				$scope.clientesNombres.push({id: cliente.id, nombre: cliente.nombreCompleto, estado: cliente.estado});
	      			});
	      		},
	      		function(error) {
	      			avisar('No se puede obtener los clientes en este momento.');
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
					var clienteId;
					$scope.clientesUnicos = [];
					
					//Domingo
					var agendaDomingo = ($filter('filter')($scope.semanaVendedor, { codigoDia: 0}))[0].clientes;
					$scope.agendaDomingo = [];
					for (i = 0; i < agendaDomingo.length; i++) {
						clienteId = agendaDomingo[i];
						var cliente = ($filter('filter')($scope.clientesNombres, { id: clienteId}));
						if (cliente) {
							$scope.agendaDomingo.push({nombre: cliente[0].nombre, color: cliente[0].estado.tipo.toLowerCase()});
						}

						//Se agrega a la lista de clientes unicos por id
						agregarClienteUnico(clienteId);
					}

					//Lunes
					var agendaLunes = ($filter('filter')($scope.semanaVendedor, { codigoDia: 1}))[0].clientes;
					$scope.agendaLunes = [];
					for (i = 0; i < agendaLunes.length; i++) {
						clienteId = agendaLunes[i];
						var cliente = ($filter('filter')($scope.clientesNombres, { id: clienteId}));
						if (cliente)
							$scope.agendaLunes.push({nombre: cliente[0].nombre, color: cliente[0].estado.tipo.toLowerCase()});

						//Se agrega a la lista de clientes unicos por id
						agregarClienteUnico(clienteId);
					}
					console.log($scope.agendaLunes);

					//Martes
					var agendaMartes = ($filter('filter')($scope.semanaVendedor, { codigoDia: 2}))[0].clientes;
					$scope.agendaMartes = [];
					for (i = 0; i < agendaMartes.length; i++) {
						clienteId = agendaMartes[i];
						var cliente = ($filter('filter')($scope.clientesNombres, { id: clienteId}));
						if (cliente)
							$scope.agendaMartes.push({nombre: cliente[0].nombre, color: cliente[0].estado.tipo.toLowerCase()});

						//Se agrega a la lista de clientes unicos por id
						agregarClienteUnico(clienteId);
					}

					//Miercoles
					var agendaMiercoles = ($filter('filter')($scope.semanaVendedor, { codigoDia: 3}))[0].clientes;
					$scope.agendaMiercoles = [];
					for (i = 0; i < agendaMiercoles.length; i++) {
						clienteId = agendaMiercoles[i];
						var cliente = ($filter('filter')($scope.clientesNombres, { id: clienteId}));
						if (cliente)
							$scope.agendaMiercoles.push({nombre: cliente[0].nombre, color: cliente[0].estado.tipo.toLowerCase()});

						//Se agrega a la lista de clientes unicos por id
						agregarClienteUnico(clienteId);
					}

					//Jueves
					var agendaJueves = ($filter('filter')($scope.semanaVendedor, { codigoDia: 4}))[0].clientes;
					$scope.agendaJueves = [];
					for (i = 0; i < agendaJueves.length; i++) {
						clienteId = agendaJueves[i];
						var cliente = ($filter('filter')($scope.clientesNombres, { id: clienteId}));
						if (cliente)
							$scope.agendaJueves.push({nombre: cliente[0].nombre, color: cliente[0].estado.tipo.toLowerCase()});

						//Se agrega a la lista de clientes unicos por id
						agregarClienteUnico(clienteId);
					}

					//Viernes
					var agendaViernes = ($filter('filter')($scope.semanaVendedor, { codigoDia: 5}))[0].clientes;
					$scope.agendaViernes = [];
					for (i = 0; i < agendaViernes.length; i++) {
						clienteId = agendaViernes[i];
						var cliente = ($filter('filter')($scope.clientesNombres, { id: clienteId}));
						if (cliente)
							$scope.agendaViernes.push({nombre: cliente[0].nombre, color: cliente[0].estado.tipo.toLowerCase()});

						//Se agrega a la lista de clientes unicos por id
						agregarClienteUnico(clienteId);
					}

					//Sabado
					var agendaSabado = ($filter('filter')($scope.semanaVendedor, { codigoDia: 6}))[0].clientes;
					$scope.agendaSabado = [];
					for (i = 0; i < agendaSabado.length; i++) {
						clienteId = agendaSabado[i];
						var cliente = ($filter('filter')($scope.clientesNombres, { id: clienteId}));
						if (cliente)
							$scope.agendaSabado.push({nombre: cliente[0].nombre, color: cliente[0].estado.tipo.toLowerCase()});

						//Se agrega a la lista de clientes unicos por id
						agregarClienteUnico(clienteId);
					}

					//Variable tramposa para tener una fila en la grilla
					$scope.contador = [1];
      			},
      			function(error) {
      				avisar('No se puede obtener la agenda del vendedor en este momento.');
      			}
			);
      	};

      	function enviarAgenda(agendaEditada) {
      		Agenda.enviarAgenda(agendaEditada,
      			function(ok) {
      				avisar('Agenda editada con éxito');
      			},
      			function(error) {
      				avisar('Error editando agenda');
      			}
  			);
      	}

      	$scope.agregarCliente = function() {
      		var dia;
      		var idCliente;

			var agendaDomingo = ($filter('filter')($scope.semanaVendedor, { codigoDia: 0}))[0].clientes;
			var agendaLunes = ($filter('filter')($scope.semanaVendedor, { codigoDia: 1}))[0].clientes;
			var agendaMartes = ($filter('filter')($scope.semanaVendedor, { codigoDia: 2}))[0].clientes;
			var agendaMiercoles = ($filter('filter')($scope.semanaVendedor, { codigoDia: 3}))[0].clientes;
			var agendaJueves = ($filter('filter')($scope.semanaVendedor, { codigoDia: 4}))[0].clientes;
			var agendaViernes = ($filter('filter')($scope.semanaVendedor, { codigoDia: 5}))[0].clientes;
			var agendaSabado = ($filter('filter')($scope.semanaVendedor, { codigoDia: 6}))[0].clientes;

			dia = parseInt($scope.diaSemana);
			idCliente = parseInt($scope.idClienteFilter);

      		var listaPorDia = ($filter('filter')($scope.semanaVendedor, { codigoDia: dia}))[0].clientes;

      		//Se busca si el cliente no esta en el dia que se quiere agregar
      		if (listaPorDia.indexOf(idCliente) === -1) {
	      		listaPorDia.push(idCliente);

	      		var cliente = ($filter('filter')($scope.clientesNombres, { id: idCliente}));
	      		if (dia === 0) {
					$scope.agendaDomingo.push({nombre: cliente[0].nombre, color: cliente[0].estado.tipo.toLowerCase()});
				}
				else if (dia === 1) {
					$scope.agendaLunes.push({nombre: cliente[0].nombre, color: cliente[0].estado.tipo.toLowerCase()});
				}
				else if (dia === 2) {
					$scope.agendaMartes.push({nombre: cliente[0].nombre, color: cliente[0].estado.tipo.toLowerCase()});
				}
				else if (dia === 3) {
					$scope.agendaMiercoles.push({nombre: cliente[0].nombre, color: cliente[0].estado.tipo.toLowerCase()});
				}
				else if (dia === 4) {
					$scope.agendaJueves.push({nombre: cliente[0].nombre, color: cliente[0].estado.tipo.toLowerCase()});
				}
				else if (dia === 5) {
					$scope.agendaViernes.push({nombre: cliente[0].nombre, color: cliente[0].estado.tipo.toLowerCase()});
				}
				else if (dia === 6) {
					$scope.agendaSabado.push({nombre: cliente[0].nombre, color: cliente[0].estado.tipo.toLowerCase()});
				}

	      		if ($scope.clientesUnicos.indexOf(idCliente) === -1) {
	              $scope.clientesUnicos.push(idCliente);
	            }
	            console.log($scope.clientesUnicos);
	            console.log(idCliente);

		    }
      		else {
      			avisar('El cliente ya se encuentra en la agenda del vendedor para el día seleccionado.');
      		}

	        var agendaPorDia = [{codigoDia: 0, listaClientes: agendaDomingo},
	          {codigoDia: 1, listaClientes: agendaLunes},
	          {codigoDia: 2, listaClientes: agendaMartes},
	          {codigoDia: 3, listaClientes: agendaMiercoles},
	          {codigoDia: 4, listaClientes: agendaJueves},
	          {codigoDia: 5, listaClientes: agendaViernes},
	          {codigoDia: 6, listaClientes: agendaSabado}
	        ];

      		var agendaEditada = {idVendedor: $scope.vendedorFilter,
      			clientes: $scope.clientesUnicos,
      			agenda: agendaPorDia
      		};
      		console.log(agendaEditada);
      		enviarAgenda(agendaEditada);
      	};

      	$scope.eliminarCliente = function(clienteChip, dia) {

      		var clienteNombre = clienteChip.nombre;
      		var idCliente = ($filter('filter')($scope.clientesNombres, { nombre: clienteNombre}))[0].id;
      		var idxDom, idxLun, idxMar, idxMie, idxJue, idxVie, idxSab;

			var agendaDomingo = ($filter('filter')($scope.semanaVendedor, { codigoDia: 0}))[0].clientes;
			var agendaLunes = ($filter('filter')($scope.semanaVendedor, { codigoDia: 1}))[0].clientes;
			var agendaMartes = ($filter('filter')($scope.semanaVendedor, { codigoDia: 2}))[0].clientes;
			var agendaMiercoles = ($filter('filter')($scope.semanaVendedor, { codigoDia: 3}))[0].clientes;
			var agendaJueves = ($filter('filter')($scope.semanaVendedor, { codigoDia: 4}))[0].clientes;
			var agendaViernes = ($filter('filter')($scope.semanaVendedor, { codigoDia: 5}))[0].clientes;
			var agendaSabado = ($filter('filter')($scope.semanaVendedor, { codigoDia: 6}))[0].clientes;

  			idxDom = agendaDomingo.indexOf(idCliente);
  			idxLun = agendaLunes.indexOf(idCliente);
  			idxMar = agendaMartes.indexOf(idCliente);
  			idxMie = agendaMiercoles.indexOf(idCliente);
  			idxJue = agendaJueves.indexOf(idCliente);
  			idxVie = agendaViernes.indexOf(idCliente);
  			idxSab = agendaSabado.indexOf(idCliente);

	  		if (dia === 0) {
	  			agendaDomingo.splice(idxDom, 1);
	  		}
	  		else if (dia === 1) {
	  			agendaLunes.splice(idxLun, 1);
	  		}
	  		else if (dia === 2) {
	  			agendaMartes.splice(idxMar, 1);
	  		}
	  		else if (dia === 3) {
	  			agendaMiercoles.splice(idxMie, 1);
	  		}
	  		else if (dia === 4) {
	  			agendaJueves.splice(idxJue, 1);
	  		}
	  		else if (dia === 5) {
	  			agendaViernes.splice(idxVie, 1);
	  		}
	  		else if (dia === 6) {
	  			agendaSabado.splice(idxSab, 1);
	  		}

      		var agendaPorDia = [{codigoDia: 0, listaClientes: agendaDomingo},
				{codigoDia: 1, listaClientes: agendaLunes},
				{codigoDia: 2, listaClientes: agendaMartes},
				{codigoDia: 3, listaClientes: agendaMiercoles},
				{codigoDia: 4, listaClientes: agendaJueves},
				{codigoDia: 5, listaClientes: agendaViernes},
				{codigoDia: 6, listaClientes: agendaSabado}
      		];

      		if (idxDom + idxLun + idxMar + idxMie + idxJue + idxVie + idxSab === -6) {
      			var idx = $scope.clientesUnicos.indexOf(idCliente);
      			$scope.clientesUnicos.splice(idx, 1);
      		}

      		var agendaEditada = {idVendedor: parseInt($scope.vendedorFilter),
      			clientes: $scope.clientesUnicos,
      			agenda: agendaPorDia
      		};

      		enviarAgenda(agendaEditada);

      	}

      	function avisar(msj) {
            $mdToast.show($mdToast.simple().textContent(msj).position($scope.getToastPosition()).hideDelay(3000));
      	}

      }
})();

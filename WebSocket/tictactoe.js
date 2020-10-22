var turno = "x";
var cantidadOpciones = 3;
var Juego = "tictactoe";

var ws;

function init() {

      // Conexion del socket al host
      ws = new WebSocket("ws://localhost:9001/");

      // Set event handlers.
      ws.onopen = function() {
        //
      };
      
      ws.onmessage = function(e) {

        if(e.data.length == 2){
          $(".pieza").each(function(index) {
          elid = $(this).attr('id');
          if (elid == e.data){
            $(this).val(turno);
          }
        });
        var pieza = document.getElementById(e.data);
        pieza.disabled = true;

        comparar();
//Validar el estado del juego
        turno = (turno == "o") ? "x" : "o";
        
        $('#turnoDisplay').val(turno);
        }
        if(e.data.length == 1){
          $('#turnoo').val(e.data);
        }
        if(e.data.length > 2){
          Reiniciar();
        }
      };
      
      ws.onclose = function() {
        //
      };

      ws.onerror = function(e) {
        console.log(e)
      };

}


CrearComponentesJuego();

$(".pieza").click(function() {
  ws.send(this.id + turno);
});

function comparar() {
  for (i = 1; i <= cantidadOpciones; i++) {
    for (j = 1; j <= cantidadOpciones; j++) {
      fila = i;
      columna = j;
      contadorTotalFilas = 1;
      contadorTotalcolumnas = 1;
      contadorDiagonal = 1;
      contadorDiagonalInversa = 1;
      contadorTurnos = 0;
      $(".pieza").each(function(index) {
        elid = $(this).attr('id');
        if ((elid.charAt(0) == fila) && ($(this).val() == turno)) {
          contadorTotalFilas++;
          if (contadorTotalFilas == (cantidadOpciones + 1)) {
            campeon();
          }
        }

        if ((elid.charAt(1) == columna) && ($(this).val() == turno)) {
          contadorTotalcolumnas++;
          if (contadorTotalcolumnas == (cantidadOpciones + 1)) {
            campeon();
          }
        }
        if ((elid.charAt(1) == elid.charAt(0)) && ($(this).val() == turno)) {
          contadorDiagonal++;
          if (contadorDiagonal == (cantidadOpciones + 1)) {
            campeon();
          }
        }
        valorTotaldiagonal = parseInt(elid.charAt(1)) + parseInt(elid.charAt(0));
        if (((valorTotaldiagonal) == (cantidadOpciones + 1)) && ($(this).val() == turno)) {
          contadorDiagonalInversa++;
          if (contadorDiagonalInversa == (cantidadOpciones + 1)) {
            campeon();
          }
        }
        if ($(this).val() != "-") {
          contadorTurnos++;
          if (contadorTurnos == (cantidadOpciones * cantidadOpciones)) {
            TerminarJuego();
          }
        }
        if (contadorTurnos == 9) {
          TerminarJuego();
        }

      });
    }
  }
}

function TerminarJuego() {
  $("#alertMensaje").html("Juego terminado");
  $(".alert").show('slow');
  $("#iniciar").removeClass("disabled");
  $(".pieza").each(function(index) {
    $(this).attr('disabled', true);
  }); //
}
function Reiniciar1(){
  ws.send("reiniciar");
}

function Reiniciar() {
  $(".alert").hide('slow');
  contadorTotalFilas = 1;
  contadorTotalcolumnas = 1;
  contadorDiagonal = 1;
  contadorDiagonalInversa = 1;
  contadorTurnos = 0;
  $(".pieza").each(function(index) {
    $(this).val('-');
    $(this).attr('disabled', false)
  }); //
  $("#iniciar").addClass("disabled");
}

function campeon() {
  $("#alertMensaje").html('Ganador <strong><input class="ganador btn btn-primary btn-lg" type="button" value="' + turno + '"></strong>');
  $(".alert").show('slow');
  $("#iniciar").removeClass("disabled");
  $(".pieza").each(function(index) {
    $(this).attr('disabled', true);
  });
}

function cerrarAlert() {
  ws.send("reiniciar");
  $(".alert").hide('slow');
  $("#iniciar").removeClass("disabled");
}

function CrearComponentesJuego() {
  
  
  $("#" + Juego).append('<div class="alert alert-dismissible alert-warning collapse"><button type="button" class="close" onclick="cerrarAlert()">×</button><div id="alertMensaje"></div></div>');

  for (i = 1; i <= cantidadOpciones; i++) {
    for (j = 1; j <= cantidadOpciones; j++) {
      $("#" + Juego).append("<input class='pieza btn btn-primary btn-lg' type='button' value='-' id='" + i + j + "'/>");
    }
    $("#" + Juego).append("<hr style='red'  margin: 7px;'/>");
  }
  $("#" + Juego).append('<br/>');
 
  $("#" + Juego).append('<span class="text-danger"><strong>Turno actual:</strong> <input class="btn btn-warning" id="turnoDisplay" type="button" value="x" disabled="true"></span>');
  $("#" + Juego).append('<br/>');
  $("#" + Juego).append('<span class=" well"><strong>Eres: </strong> <input class="btn btn-warning" id="turnoo" type="button" value="-" disabled="true"></span>');
  $("#" + Juego).append('<br/>');
  $("#" + Juego).append('<br/>');
  $("#" + Juego).append('<input type="button" id="iniciar" onclick="Reiniciar1()" value="Reiniciar" class="btn btn-danger btn-lg    disabled"/>');

}
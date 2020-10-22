from websocket_server import WebsocketServer
jugadores = []
turno_actual = "x"

#Defincion de una nueva conexion cliente

def new_client(client, server):
	print("Nueva conexión: %d" % client['id'])
	if len(jugadores) < 2:
		if len(jugadores) == 0:
			jugadores.append((client['id'],"x"))
			server.send_message(client, "x")
		elif jugadores[0][1] == "x":
			jugadores.append((client['id'],"o"))
			server.send_message(client, "o")
		else :
			jugadores.append((client['id'],"x"))
			server.send_message(client, "x")
		print("Jugará!")

	print (jugadores)

#Estado del juego 

def client_left(client, server):
	print("%d se desconectó" % client['id'])
	if (client['id'], "x") in jugadores:
		jugadores.remove(((client['id'], "x")))
	if (client['id'], "o") in jugadores:
		jugadores.remove(((client['id'], "o")))
	print(jugadores)

#Mensaje entre cliente servidor
def message_received(client, server, message):
	if len(message) == 3:
		a = (client['id'],message[2:])
		if a in jugadores:
			server.send_message_to_all("%s" % (message[:2]))
			print("Jugador (%d): %s" % (client['id'], message[:2]))
	if len(message) > 3:
		server.send_message_to_all("reiniciar")
		

#Definicion del puerto y funciones 

PORT=9001
server = WebsocketServer(PORT)
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()

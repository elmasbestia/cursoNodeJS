// Taller de Node JS
// Estructura típica de un Servicio al Estilo de Rafa

/*
	¿Cómo se ejecuta un servicio?
	1. Se declaran e inicializan las variables y funciones globales
	2. Se ejecuta la CONEXIÓN
	3. Se espera una de las RUTAS
	4. Se ejecutan los MIDDLEWARE
	5. Se ejecuta el CALLBACK asociado a esa ruta
	6. Vuelta a 3.
*/

/*
	Elementos:
		1. Declaraciones
			Definición de las variables globales
		2. Funciones
			Definición de las funciones globales
		3. Middleware
			Middleware es un concepto de Express:
			Estas funciones serán llamadas en secuencia a cada ciclo del Servicio
			Middleware típico:
			1. Conversiones
			2. Localización de parámetros
			3. Manejo de Errores
			4. Bitácora de ejecución
		4. Rutas
			Cada RUTA es un mensaje al Servicio:
			Agrega el X de código idX	PUT	url?idX=...
			Borra  el Y de código codY	DELETE	url?codY=...
			Dame la lista de todos los Z	GET	url/Z
		5. Conexión
			Establece el proceso que va a "escuchar" en el puerto determinado, esperando las RUTAS
*/

// D E C L A R A C I O N E S
// @express es la librería que permite manejar Node JS con comodidad
// @app es el objeto que permite manejar las RUTAS
const express       = require("express");
const app           = express();

// MORGAN es una librería que lleva la bitácora de mensajes al servicio y su resultado
const logger        = require('morgan');
// ERRORHANDLER maneja los errores que ocurran al ejecutar el ciclo
const errorhandler  = require('errorhandler');
// BODY-PARSER convierte de objeto interno a JSON y viceversa
const bodyParser    = require('body-parser');
// PATH permite construir direcciones de directorios 
const path          = require('path');
// CORS maneja la política de 
// intercambio de recursos de origen cruzado o CORS (Cross-origin resource sharing)
const cors          = require("cors");

// DOTENV lee el archivo .env y permite acceder los parámetros en él inscritos a través del objeto process.env
require('dotenv').config();


// F U N C I O N E S
const identifica = () => {
	let cont = 0;
	return (id) => {
		console.log("Identifica Id: "+id);
		return ++cont +" elemento de Id Nro.: " +id;
	}
}

const id = identifica(); 

function doble(numero) {
	return numero*2;
}

function triple(numero) {
	return numero*3;
}

// M I D D L E W A R E
app.use(logger('dev'));
app.use(errorhandler());
app.use(bodyParser.json());
app.use(cors());

//app.use(express.static('./'));

app.param("numero", (req, res, next) => {
    let _numero = req.params.numero;
    
    console.log("PASÓ POR param numero")

    if(isNaN(_numero)) {
	let msj = `¡${_numero} no es un número!`;
        console.log(msj);
        res.status(404).send(msj)
    } else {
        req.numero = _numero;
        next();
    }
});

// R U T A S

app.get('/', (req, res) => {
   res.send("¡Hola, Mundo!");
});

app.get("/doble/:numero", (req,res) => {
	console.log("DOBLE")
	let respuesta = { respuesta: "El doble de " +req.numero +" es: " +doble(req.numero)};
	res.send(respuesta);
});

app.get("/triple/:numero", (req,res) => {
	console.log("TRIPLE")
	let _triple = triple(req.params.numero);
	if(isNaN(_triple)) res.status(404).send("TRIPLE: " +req.numero+" no es un número")
	res.send("El triple de " +req.numero +" es: " +_triple);
});

app.get("/id/:numero", (req,res) => {
	res.send(id(req.numero));
});

// C O N E X I Ó N

app.listen(process.env.puerto);
console.log("Taller Node JS - Segundo Ejemplo Activo en el puerto " +process.env.puerto);

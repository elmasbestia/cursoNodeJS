"use strict";

/* Base de Datos Electorales
 * Centros		Centros de Votación
 * DPT			División Político-Territorial
 * Registro		Datos de los votantes
 */

const cors = require('cors');
const app = require('express')(); // vb

const bodyParser = require('body-parser'); // vb
const logger = require('morgan');
const errorhandler = require('errorhandler');
const path = require("path");
require('dotenv').config(); // vb

const BD = require('pg').Client; // vb
                                          // Funciones
function creaLstPrms(n) {
    let retorno = "";
    for(let i = 1; i <= n; i++) { retorno += "$" + i +", " }
    return retorno;
}

function codigo(x) {
    function fmt2(num = 0) {return num > 9 ? String(num) : "0" + num}
    
    return fmt2(x.Edo) + fmt2(x.Mun) + fmt2(x.Pq);
}

function lee(sql, res) {
    const bd = new BD();

    bd.connect()
    .then(() => {
        return bd.query(sql);
    })
    .then((results) => {
        console.log(results.rows.length, "registros");
        res.send({ resultado: results.rows });
    })
    .catch((err) => {
		console.log(sql);
    	console.log(err);
    	res.send({}); // mstError(msj('Something bad happened',err.severity,err.error)));
    });
}

function acomodaDPT(datos){
	/* Formalizar la DPT en Niveles
        Cambiar: { Edo, Mun, Pq }
        Por    : { EDO: "", Municipios: [ { Municipio: "Libertador", Parroquias: [ { Pq: 0, Parroquia: "" }, ...] }, ...] }
    */
    let dpt = [];
    let xEdo = -1, xMun = -1;
    datos.sort((a,b) => codigo(a) > codigo(b) ? 1 : -1)
        .map(x => {
            if((xEdo === -1) || (dpt[xEdo].Edo != x.Edo)) {
                dpt.push({ Edo: x.Edo, EDO: x.ESTADO, Municipios: []});
                ++xEdo;
                xMun = -1;
            }
            if((xMun === -1) || (dpt[xEdo].Municipios[xMun].Mun != x.Mun)) {
                dpt[xEdo].Municipios.push({ Mun: x.Mun, Municipio: x.MUNICIPIO, Parroquias: [] });
                ++xMun;
            }
            dpt[xEdo].Municipios[xMun].Parroquias.push({ Pq: x.Pq, Parroquia: x.PARROQUIA});
        });
    return dpt;
}

function leeDPT(codigo, req, res, next) {
	// Lee la DPT con ese código
	let condicion = "";
    const bd = new BD();
    let sql = "";
    
    bd.connect()
    .then(() => {
        if(codigo) {
            condicion = 'WHERE "Edo" = ' +codigo.Edo;
            if(codigo.Mun) condicion += ' AND "Mun" = ' +codigo.Mun;
            if(codigo.Pq ) condicion += ' AND "Pq"  = ' +codigo.Pq;
        }
        sql = 'SELECT * FROM "DPT" ' + condicion +' Order by "Edo", "Mun", "Pq";';
        return bd.query(sql);
    })
    .then((results) => {
        req.dpt = acomodaDPT(results.rows);
        if(next) next();
        else res.send(req.dpt);
    })
    .catch((err) => {
        console.log(sql);
    	console.log(err);
    	req.dpt = {}; // mstError(msj('Something bad happened',err.severity,err.error)));
    	res.status(404);
    	next();
    });
}

app.param('dpt', (req, res, next) => {
	let valor = req.params.dpt;

	let codigo = { 	Edo: valor.substring(1,2),
					Mun: valor.length > 2 ? valor.substring(3,4) : 0,
					Pq : valor.length > 4 ? valor.substring(5,6) : 0
	};
    // Lee la DPT con ese código
	leeDPT(codigo, req, res, next);
});

										// MIDLEWARE
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(errorhandler());
app.use(cors());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});

                                        // RUTAS
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'Electorales.html'));
});

app.get('/dpt', (req, res) => {
    leeDPT(null, req, res);
});

app.get('/dpt/:dpt', (req, res) => {
    console.log("Envío:", req.dpt)
	res.send(req.dpt);
});
	  
app.post('/dpt', (req, res, next) => {
	// Grab data from http request
    const bd = new BD();
});

app.get('/centro/:centro', (req, res) => {
    const bd = new BD();

    bd.connect()
    .then(() => {
        return bd.query('SELECT * FROM "Centros" WHERE "Centro" = ' + req.params.centro);
    })
    .then((results) => {
        if(results.rows.length === 0) res.status(404);
        res.send({ Centro: results.rows[0] });
    })
    .catch((err) => {
    	console.log(err);
    	res.send({}); // mstError(msj('Something bad happened',err.severity,err.error)));
    });
});

app.post('/centro', (req, res) => {
	// Grab data from http request

    console.log(req);
/*
    const bd = new BD();
	const data = {text: req.body.text, complete: false};

	bd.connect()
	.then(() => bd.query('INSERT INTO "Centro" values(' + creaLstPrms() +')',	[data.text, data.complete])
	).catch((err) => {
        console.log(err);
		return res.status(500).json({success: false, data: err});
	});
*/
});
app.get('/centros/:criterio', (req, res) => {
});

app.get('/votante/:cedula', (req,res) => {
    const bd = new BD();
	let cedula = req.params.cedula;
	
    bd.connect()
    .then(() => {
        return bd.query('SELECT * FROM "Registro" WHERE "Cedula" = ' + cedula);
    })
    .then((results) => {
        res.send({ Votantes: results.rows });
    })
    .catch((err) => {
    	console.log(err);
    	res.send({}); // mstError(msj('Something bad happened',err.severity,err.error)));
    });
});

app.post('/votante', (req, res) => {
});

app.get('/votantes/:criterio', (req,res) => {
});

app.get('/edos', (req,res) => {
    lee('SELECT * FROM estados',res);
});

app.get('/edo/cant', (req, res) => {
    lee('SELECT * FROM "cantXEdo"',res);
});

app.get('/edo/centros', (req, res) => {
    lee('SELECT * FROM "centrosXEdo"',res);
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}.`);
});
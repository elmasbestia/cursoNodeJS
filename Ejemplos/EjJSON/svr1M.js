// 1M
// Servidor de Datos
// Rafa Gómez https://rafagomez.neocities.org

"use strict";

const express       = require('express');
const app           = express();
const logger        = require('morgan');
const errorhandler  = require('errorhandler');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const path          = require('path');
const fs            = require("fs");

const directorio    = "./BD/";

const BD = {
    clases:         require("./BD/clases.json"),
    categorias:     require("./BD/categorias.json"),
    entes:          require("./BD/entes.json"),
    participantes:  require("./BD/participantes.json"),
    llegada:        require('./BD/llegada.json'),
}

let _usr = {};

const txtGenero = ["Masc", "Fem"]
const smbGenero = [
    String.fromCharCode(0x2640),
    String.fromCharCode(0x2642)
]

const rogFmt = {
    Moneda: new Intl.NumberFormat('VES', {
        style: 'decimal',
        minimumFractionDigits: 2
    }).format,
    Ent: new Intl.NumberFormat('VES', {
        style: 'decimal',
        minimumFractionDigits: 0
    }).format,
    Pc: new Intl.NumberFormat('VES', {
        style: 'percent',
        minimumFractionDigits: 2
    }).format
}

var impr;

function getCategoria(cat) {
    if(cat) return BD.categorias[cat].Categoria;
}

function getClase(clase) {
    if(clase) return BD.clases[clase].Clase;
}

function getEnte(ente) {
    if(!isNan(ente)) return BD.entes.find(x => x.id == ente).Ente;
}

function condecorados(orden) {
    return BD.participantes.filter(x => x.Categoria == 1).sort(strCompara(orden));
}

function lstParticipantes() {
    return BD.participantes.map(x => ({
        id: x.id,
        Nombre: x.Nombre,
        Cedula: x.Cedula,
        Categoria: getCategoria(x.Categoria),
        Clase: getClase(x.Clase),
        Ente: getEnte(x.Ente),
        Telefono: x.Telefono,
        Genero: smbGenero[x.Genero],
        Años: x.Años
    }));
}

function yaLlego(Id) {
    return BD.llegada.find(x => x.Participante === Id);
}

function auto(tabla) {
  return tabla.length;
}

function guarda(req, res) {  // Guarda la llegada
    fs.writeFile('./BD/llegada.json', JSON.stringify(BD.llegada), (err) =>{
        if(err) res.send({guardo: false, err: err}); // .status(404)
        res.status(200).send({guardo: true});
    });
}

function autentica() { // autenticación del Usuario
    _usr = {
        usr:  "Usuario de Prueba",
        rol:  "Super",
        ente: "Trabajo",
        fino: true
    }
	return true;
}

function filtra(query,datos) {
    let que, retorno;
    if(query) que = Object.keys(query)[0];
    if (que) {
        console.log("Busca", query)
        let valor = query[que];
	if(["nombre","descripcion"].includes(que.toLowerCase())) {
	    let chq = new RegExp(valor,"i")
            retorno = datos.filter(x => chq.test(x[que]));
        } else retorno = datos.filter(x => x[que] == valor );
    } else retorno = datos;

    return retorno;
}

function desarma(lista) {
    // Crea un arreglo a partir de:
    // 1. Una lista de palabras separada por coma y un espacio en una cadena de caracteres: "A, B, C"
    // 2. Un objeto: { A: ..., B: ..., C: ... }
    // 3. Si @param valores es Un arreglo, devuelve la referencia correspondiente

    let retorno = [];
    if(lista) {
        if(lista instanceof Array) retorno = lista;
        else if(typeof lista === "string") retorno = lista.split(", ");
        else retorno = Object.keys(lista);
    }
    return retorno;
}

function strCompara(campo,descendente){
    // Función que compara dos objetos sobre la base de uno o varios de sus elementos
    var menor = -1, mayor = 1;
    var que = campo;
    const comp1 = (a,b) => (def(a[que]) < def(b[que])) ? menor : (def(a[que]) > def(b[que])) ? mayor : 0;
    let _campos = desarma(que);
    function comp(a,b,campos) {
      let i = 0;
        let retorno;
      do {
        que = campos[i];
        retorno = comp1(a,b);
      } while (++i < campos.length && !retorno);
      return retorno;
    }
    function def(x) { return x || "" }
    if (descendente) {
        menor = 1;
        mayor = -1;
    }
    if (_campos.length === 1) return comp1;
    else return (a,b) => comp(a,b,_campos);
}

function lista(que) {
	let lista = [];
	let valor, cant = 0;
    
    function tabla(que) {
        return BD[que.toLowerCase()+"s"]
    }
            
    condecorados(que).forEach(x => {
        if (valor != x[que]) {
            lista.push({valor: valor, cant: cant});
            valor = x[que];
            cant = 0;
        }
        cant++;
    });
    lista.push({valor: valor, cant: cant});
    if(lista[0].cant === 0) lista.shift();
    else lista[0].texto = "(Indefinido)";

    tabla(que).forEach( reg => {
        let _reg = lista.find(x => x.valor === reg.id);
        if(_reg) _reg.texto = reg[que];
        else lista.push({valor: reg.id, texto: reg[que]}) 
    });

    return lista.sort(strCompara("texto"));
}

function fichaEnte(ente) {
    const _ficha = BD.entes.find(isNaN(ente) ? x => x.Ente === ente : x => x.id == ente);

    const _postulados = filtra({Ente: _ficha.id},condecorados("Nombre"));
    return { ficha: _ficha, chivos: _ficha.chivos, postulados: _postulados };
}

                                    // MIDLEWARE

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(errorhandler());
app.use(cors());

app.use((req, res, next) => {
	// Autenticación
	if (autentica()) next();
});

app.use(express.static('.'));

                                // R U T A S
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname,'index.html'));
});

app.get('/Acreditacion', (req, res) => {
   res.sendFile(path.join(__dirname,'acreditacion.html'));
});

app.get('/Postulaciones', (req, res) => {
   res.sendFile(path.join(__dirname,'Ente.html?ente='+_usr.ente));
});

app.get("/postulados", (req, res) => {
    res.send(filtra(req.query,condecorados("Nombre")));
});

app.get("/fichaEnte/:idEnte", (req, res) => {
    res.send(fichaEnte(req.params.idEnte));
});

app.get('/completo', (req, res) => {
    res.send(filtra(req.query,lstParticipantes()));
});

app.get("/lista", (req, res) => {
    let que = Object.keys(req.query)[0];
    res.send(lista(que));
});

app.get("/condecorados", (req, res) => {
    res.send(filtra(req.query,condecorados("Nombre")));
});

app.get("/participante", (req, res) => {
   res.send(filtra(req.query,BD.participantes)); 
});

app.get('/Tablas', (req, res) => {
    res.send(fs.readdirSync(path.join(__dirname,directorio)));
});

app.get('/Tabla/:nbTab', (req, res) => {
    res.send(filtra(req.query,BD[req.params.nbTab]));
});

app.get('/reportes', (req, res) => {
   res.sendFile(path.join(__dirname,'/Reporte.html'));
});

app.get('/reporte/:nbReporte', (req,res) => {
   res.send(datReporte(req.params.nbReporte));
});

//              L L E G A D A
app.get('/Llegada', (req,res) => {
    res.send(BD.llegada);
});

app.post('/Llegada', (req,res) => {
    // Revosar que no haya sido registrado ese participante
    let _llegada = req.body;

    if(yaLlego(_llegada.Participante)) res.send({err: "¡Ya está registrado!"});
    else {
        _llegada.id = auto(BD.llegada);

        BD.llegada.unshift(_llegada);
        res.send(BD.llegada);
    }
});

app.get('/guardar', (req, res) => {
    guarda(req, res);
});

//              I M P R E S I Ó N

function lstReportes () {
    return require("./Lib/1M_Reportes.json");
}

app.get("/lstReportes", (req, res) => {
    res.send(lstReportes());
});

app.put("/imprime", (req,res) => {
    imprime(req.body,res);
});

function imprime(texto,res) {
    let hora = new Date();
    let nbRep = "1M_"+hora.getTime();

    if(!impr) {
       impr = require("./Lib/rogImpr.json");
       impr.pdf = require('html-pdf');
    }

    impr.pdf.create(
        impr.cabecera+texto+impr.pie,
        impr.prms
    ).toFile('./"+nbRepo+".pdf', (err, salida) => {
        if (err){
            console.log(err);
        } else {
            console.log(salida);
            res.send(salida.fileName())
        }
    });
}

//              I N I C I O

console.log("1M Activo en el puerto 3001");
app.listen(3001);


/*
 * H o o k s
bookSchema.pre('save', function(next) {
    //prepare for saving
    //upload PDF
    return next()
})
On the other hand, before removing, we need to make sure there are no pending purchase orders for this book:

bookSchema.pre('remove', function(next) {
    //prepare for removing
    return next(e)
})
*/
/*
    {"id": "136",
    "Nombre": "BRAVO ROJAS, YURBY NOHEMI",
    "Cedula": "",
    "Telefono": "",
    "Categoria": "1",
    "Genero": "1",
    "Años": "0",
    "Clase": "1",
    "Ente": "0",
    "Especial": "Falso",
    "Cargo": "",
    "Orden": "",
    "SubGrupo": "",
    "ViejoId": ""}
*/

function datReporte(reporte) {
  let retorno = [];

  switch (reporte) {
    case "Alfa":
        retorno = traduce(condecorados("Nombre"));
        break;
    case "x Ente":
        retorno = traduce(condecorados("Ente, Nombre"));
        break;
    case "x Clase":
        retorno = traduce(condecorados("Clase, Nombre"));
        break;
    case "Resolucion":
        retorno = traduce(condecorados("Clase, Nombre"));
        break;
    case "Categorias":
        retorno = BD.categorias;
        break;
    case "Clases":
        retorno = BD.clases;
        break;
    case "Entes":
        retorno = BD.entes;
        break;
    case "Acompañantes":
        retorno = traduce(filtra({Categoria: "2"},BD.participantes)).sort(strCompara("Nombre"));
        break;
    case "por Categoría":
        retorno = lstParticipantes().sort(strCompara("Categoria, Nombre"));
        break;
    case "Clases x Ente":
        retorno = Cuadro(datos,"Clase, Ente");
        break;
    case "Prueba":
        retorno = traduce(BD.participantes.slice(0,10));
        break;
      default:
        retorno = lstParticipantes().sort(strCompara("Nombre"));
  }
  return retorno;
}

function traduce(datos) {
    let _traduceCampo = traduceCampos();
    return datos.map(linea => {
        let z = {};
        for(let campo in linea) z[campo] = _traduceCampo[campo] ? _traduceCampo[campo](linea[campo]) : linea[campo];
        return z;
    });
}

function traduceCampos() {
    return {
        Categoria: (valor) => getCategoria(valor),
        Clase: (valor) =>  getClase(valor),
        Ente: (valor) => getEnte(valor),
        Genero: (valor) => smbGenero[valor],
        Cedula: (valor) => fmtEnt.format(valor),
        Telefono: (valor) => pica(valor,3,3,4)
    }
}

function pica(texto,...segm) {
    var retorno = "";
    let pos = 0;
    let lSegm = segm.reduce((total,n) => total +n,0);
    while(texto.length < lSegm) texto = " "+texto;
    segm.reduce((pos,cant) => {
        retorno += texto.slice(pos,pos+cant) +" ";
        return pos += cant;
    },0)
    return retorno;
}

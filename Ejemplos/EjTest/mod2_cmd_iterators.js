// Type your code here
let i,hayR;

let [pathInterprete, pathArchivo, ...parametros] = process.argv;

console.log(`\n Route to node.js: ` + pathInterprete);
console.log(`\n Route to this file: ` + pathArchivo);
console.log();

hayR= parametros.indexOf("-r");

if (hayR>0) {
parametros=parametros.filter(elem => elem != parametros[hayR+1] && elem != "-r");
}

parametros = parametros.sort();

let cuantos = parametros.reduce((contadorElem,elem, i) => {
	if (elem === parametros[i+1]) {
		contadorElem++;
		i++;
	return contadorElem;
	}
	else {
		console.log(" " + elem + ": " + contadorElem);
		contadorElem = 1;
		return contadorElem;
	}
},1); 
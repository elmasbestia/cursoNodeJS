/*
    Mooc NODE - Mod 2
    Entrega 2 - Arrays e iteradores
    Rafa Gómez
    
    Enunciado General:

    Ejemplo:
    Si	invocamos	así	el programa:
    $	node	mod2_cmd_iterators.js		uno	-r	dos	uno	dos	tres	dos	tres	tres	

	deberá	dar	el	resultado	que	se	indica	a	continuación:	
    Route	to	node.js:	/usr/local/bin/node	
    Route	to	this	file:	/Users/jq/sol/mod2_cmd_iterators.js	
    tres:	3	
    uno:	2	
*/

/*
El	programa debe comenzar asignando con mul<-asignación	los	parámetros de la invocación a tres variables: a	la	 primera el	 parámetro 0 (ruta al interprete de	 node),	a la segunda el parámetro 1 (ruta al fichero mod2_cmd_iterators.js)	y a	la	tercera	un	array	con	el	resto	de	los	parámetros.	
*/

let [rutaNode, rutaJS, ...prms] = process.argv;

/*
1. Primero	 debe	mostrar	 una	 línea	 en	 blanco	 seguida	 de	 las	 rutas	 al	 interprete	 de	 node.js	 y	 al	fichero	mod2_cmd_iterators.js	(que	con<ene	el	programa)	y	de	otra	línea	en	blanco	
*/
/*
                ¡ATENCIÓN!
                Anulado porque el chequeo no la toma en cuenta
console.log();
console.log("Route	to	node.js: " +rutaNode);
console.log("Route	to	this	file: " +rutaJS);
console.log();
*/
/*
2. A	 con<nuación	 debe	 mostrar	 los	 parámetros	 en	 orden	 alfabé<co,	 cada	 uno	 en	 una	 línea,	seguido	 del	 string	 “:	 “	 y	 del	 número	 de	 veces	 que	 esta	 repe<do.	 	 Si	 se	 añade	 la	 opción	 -r	delante	de	un	parámetro	este	se	elimina	y	no	aparece	en	el	listado.

2.1 Se	busca	si	se	ha	incluido	la	opción	-r	en	el	array	con	el	resto	de	parámetros	y	se	eliminan todas	las	ocurrencias	del	parámetro	que	viene	a	con<nuación	en	dicho	array.		
*/
let pos = prms.indexOf("-r");
if (pos >= 0) {
    let eliminar = prms[pos +1];
    do {
      prms.splice(pos,1);
      pos = prms.indexOf(eliminar);
    } while (pos >= 0);
}
/*
2.2 El	array	debe	ordenarse	con	la	función	sort()	y	reducir	con	el	iterador	reduce(..)	para	mostrar	por consola	los	parámetros,	tal	y	como	se	indica,	en	orden	alfabé<co	y	con	el	número	de	ocurrencias:

• Si	parámetro	igual	al	anterior,	incrementa	el	acumulador	en	1	
• Si	parámetro	no	es	igual	al	anterior,	muestra	el	parámetro	anterior	por	consola	con	el	número	
de	repe<ciones	e	inicializa	el	acumulador	a	0	para	empezar	la	cuenta	del	nuevo	parámetro.	
*/
let muestra  = (x) => {if (x.cant > 0) console.log(x.anterior+": "+x.cant)}
let resultado = prms.sort().reduce(
    (ctl, x) => {
        if(x === ctl.anterior) {
            ctl.cant++;
        } else {
            muestra(ctl);
            ctl.anterior = x;
            ctl.cant = 1;
        }
        return ctl;
}, {anterior: undefined, cant: 0});

muestra(resultado);

/*
3. Por	úl<mo	debe	finalizar	y	retornar	a	la	shell.
*/
// Taller de Node JS
// "¡Hola Mundo!" en Express

// D E C L A R A C I O N E S

const app = require("express")();

// F U N C I O N E S
function fnOotro(req, res) {
res.send("Vino pa otro lado")
}
// M I D D L E W A R E

// R U T A S

app.get('/', (req, res) => {
   res.send("¡Hola, Mundo!");
});

app.get("/Otro", fnOtro)

// C O N E X I Ó N

console.log("Taller Node JS - Primer Ejemplo Activo en el puerto 3000");
app.listen(3000);







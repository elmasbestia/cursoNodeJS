<?php session_start(); ?>
<!DOCTYPE HTML>
<html>
<head>
    <title>Prueba de Librería rogRegistro</title>
    <style>
        label {
            font-style: oblique;
            font-weight: bold;
            width: 120px;
            float: left;
        }
        fieldset {
            border: 0;
        }
        .error {color: #FF0000;}
        .rogBtn {
            background-color: #0047b3;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            margin: 3px 2px;
            cursor: pointer;
        }
        .rogBtn:hover {
            font-weight: bold;
        }
        .buscable {
            color: lightcyan;
            background-color: black;
            background-image: url('searchicon.png');
            background-position: 10px 10px;
            background-repeat: no-repeat;
            padding-left: 40px;
        }
    /* Tablas */
        table {
            border-collapse: collapse;
            width: 100%;
        }

        th, td {
            text-align: left;
            padding: 8px;
        }

        tr:nth-child(even){background-color: #f2f2f2}

        th {
            background-color: #0047b3;
            color: white;
        }
    </style>
</head>
<body>

<?php
    
    require("../rogLib/rogErr.php");
    require("../rogLib/rogRegistro.php");

    // Validadoras
    $nroValido = function($x) {
        if($x > 9) { return "¡El numero debe ser menor que 10!";}
    };
    $fechaValida = function($x) {
        if($x > time()) { return "¡La fecha no puede ser posterior a Hoy!";}
    };
    
//    unset($_SESSION["Harto"]);
//if (isset($_SESSION["Harto"])) {
//    $rs = unserialize($_SESSION["Harto"]);
//} else {

    echo "Creo rs<br/>";
    $rs = new rogRegistro();
    
    $rs->nuevoCampo("nombre", "NOMBRE Y APELLIDO", "text", true,
            "/^[a-zA-Z ]*$/");
        $rs->nuevoCampo("correo", "", "email", true, "correo");
        $rs->nuevoCampo("genero", "", "radio", true,
            array("Fem" => "Fem", "Masc" => "Masc"), "", "género");
        $rs->nuevoCampo("comentario", "", "memo");
        $rs->nuevoCampo("SitioWeb", "", "url", false, "url", "", "Sitio web");
        $rs->nuevoCampo("Estado","DC","combo",false, array("Distrito Capital" => "DC", "Miranda" => "MI", "Vargas" => "VA"));
        $rs->nuevocampo("Fecha", time(),"date",true, "", $fechaValida);
        $rs->nuevocampo("Monto",0,"number",false);
        $rs->nuevocampo("Numero","-1","number",true, "", $nroValido);

    // $_SESSION["Harto"] = serialize($rs);
//}
    echo "Son: ", $rs->nCampos(), " campos<br/>";
    
echo "Validar<br/>";
if ($_SERVER["REQUEST_METHOD"] == "POST") { $rs->valida(); }

echo "Formular<br/>";
echo $rs->formulario("Formulario con Validación");

echo "Evalua: <br/>";
// Si leyo la lectura esta completa
    if ($rs->leyo()) {
        echo "Lectura exitosa<br/>";
        $rs->registra();
    } else {
        echo "La Lectura fallo<br/>";
        echo $rs->muestra();
    }
    
?>
</body>
</html>
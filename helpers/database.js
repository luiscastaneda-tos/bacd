const db = require("../configs/database")

//Obtiene los nombres parecidos en la base de datos
async function getNombres(nombre) {
    try {

        let sql_query =
            `select NombreViajero from vw_Reservas_AI where NombreViajero LIKE ? group by NombreViajero;`

        //Obtenemos los resultados de la query
        let rows = await db.query(sql_query, [`%${nombre}%`]);

        //Obtenemos solamente los nombres y mandamos los resultados como un json
        let results = rows.map((element) => element.NombreViajero)

        return JSON.stringify(results)

    } catch (error) {
        console.error("Ha ocurrido un error: ", error)
    }
}

// Verificar si hay empalme
function fechasSeEmpalman(check_in, check_out, fechaExistente) {
    return check_in < new Date(fechaExistente[1]) && check_out > new Date(fechaExistente[0])
}

// Separa por 'T' y toma la primera parte
const obtenerFechaSinTiempo = (fecha) => {
    return fecha.toISOString().split("T")[0];
};

//Checa si es una extension o una reserva
function checkExtension(check_in, check_out) {
    return obtenerFechaSinTiempo(check_in) == obtenerFechaSinTiempo(check_out)
}

//Obtiene la información de las fechas y hoteles y checa los empalmes regresando la información de los empalmes
async function checkEmpalme(nombre, check_in, check_out) {
    try {
        let sql_query =
            `select host as hotel, check_in, check_out, NombreViajero, destino from vw_Reservas_AI 
            where NombreViajero LIKE ? and estatus = "confirmada" order by check_in desc;`

        let rows = await db.query(sql_query, [`%${nombre}%`]);

        //Guardamos las fechas de check_in y check_out como objetos tipo fechas
        let check_in_date = new Date(check_in)
        let check_out_date = new Date(check_out)

        //Revisamos si se empalman las fechas y si se empalman guarda los datos de esa reservación y se envian en JSON
        let result = []
        rows.forEach(element => {
            if (!fechasSeEmpalman(check_in_date, check_out_date, [element.check_in, element.check_out])) return
            if (checkExtension(check_in_date, element.check_out)) {
                result.push({
                    ...element,
                    revisado: "Parece que es una extensión ¿Es el mismo hotel?"
                })
            } else {
                result.push({
                    ...element,
                    revisado: "Es empalme"
                })
            }
        })

        return JSON.stringify(result)

    } catch (error) {
        console.error("Ha ocurrido un error: ", error)
    }
}

//Obtiene el historial de los hoteles en los que ha estado la persona
async function historialHoteles(nombre) {
    try {

        let sql_query = `select host as hotel, destino, NombreViajero, check_out as ultimoVezQueViajo 
        from vw_Reservas_AI where NombreViajero LIKE ? and estatus = "confirmada" group by host order by check_in desc;`

        let rows = await db.query(sql_query, [`%${nombre}%`])

        return JSON.stringify(rows)

    } catch (error) {
        console.log(error)
    }
}

//Genera el reporte en la base de datos adecuada para OpenAI
async function generarReporte({ query }) {
    try {

        let rows = await db.query(query)

        return JSON.stringify(rows)

    } catch (error) {
        return JSON.stringify(error)
    }
}

//Genera reportes en formato de objeto
async function getDataDB({ query }) {
    try {
        let rows = await db.query(query)
        return rows
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getNombres,
    checkEmpalme,
    historialHoteles,
    generarReporte,
    getDataDB,
}
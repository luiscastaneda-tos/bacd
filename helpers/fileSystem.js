const fs = require("fs");

async function getCiudadesYEstados() {

    return JSON.stringify(await new Promise((resolve, reject) => {
        fs.readFile('PoliticasViajeKONE.csv', 'utf8', (err, data) => {
            
            if (err) reject("Error al leer el archivo csv Politicas de viaje Kone")

            let matriz = data.split("\n").map((row) => row.split(","))

            let estado = ""
            let resultados = matriz.map((row, index) => {
                if (row[2] != "") estado = row[2]
                return {
                    row: index+1,
                    estado: estado,
                    ciudad: row[3]
                }
            })

            resolve(resultados)
        })
    }))
}

async function getRowPoliticas(row) {

    return JSON.stringify(await new Promise((resolve, reject) => {
        
        fs.readFile('PoliticasViajeKONE.csv', 'utf8', (err, data) => {

            if (err) reject("Error al leer el archivo csv Politicas de viaje Kone")

            let matriz = data.split("\n").map((row) => row.split(","))
            resolve(matriz[row-1])
        })

    }))

}

module.exports = {
    getCiudadesYEstados,
    getRowPoliticas
}
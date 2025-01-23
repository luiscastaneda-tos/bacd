function cifrar(texto) {
    return texto.replaceAll("%", "!!!")
}

function descifrar(texto) {
    return texto.replaceAll("!!!", "%")
}

async function getQueryParams({ columns, query }) {

    const jsonStr = JSON.stringify({ query, columns });

    return cifrar(jsonStr)
}

async function createCupon({ hotel, direccion, checkin, checkout, noches, noktos, desayuno, notas, precio = 0 }) {
    let cupon = {
        hotel,
        direccion,
        checkin,
        checkout,
        noches,
        noktos,
        desayuno,
        notas,
        precio: (precio == 0 ? (noktos * 145) : (precio / 1.16)),
        impuestos: (precio == 0 ? (noktos * 168.2) : precio)
    }
    return "\n" + JSON.stringify({ cupon }) + "\n"
}

function fixNumber(numero) {
    let stringNumber = numero.toFixed(2).split("")
    let index = stringNumber.indexOf(".")
    if (index < 4) {
        return stringNumber.join("")
    } else {
        stringNumber.splice(index - 3, 0, ",")
        return stringNumber.join("")
    }
}

async function createCuponVuelo({ tipoVuelo, vuelos = [], opcion, imagenUrl, infoPaquete, noktos }) {
    let dataCupon = {
        tipoVuelo,
        vuelos,
        opcion,
        imagenUrl,
        tarifa: infoPaquete,
        noktos,
        impuestos: fixNumber(noktos * 168.2)
    }
    return "\n" + JSON.stringify({ dataCupon }) + "\n"
}

module.exports = {
    cifrar,
    descifrar,
    getQueryParams,
    createCupon,
    createCuponVuelo
}
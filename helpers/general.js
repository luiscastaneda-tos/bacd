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

module.exports = {
    cifrar,
    descifrar,
    getQueryParams
}
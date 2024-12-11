const fetch = require("node-fetch");
const { obtenerAcces } = require("../configs/zoho.js")

async function createATicket({informacion_viajantes, tabla, hoteles, check_in, check_out, destino, viajero, observaciones}) {
    let ticket_info = {
        "subject": "TICKET PRUEBA",
        "description": `${informacion_viajantes}<br><br><br><br>${tabla}`,
        "departmentId": "603403000018558029",
        "contactId": "603403000000819002",
        "priority": "High",
        "status": "Open",
        cf: {
            cf_hoteles: hoteles,
            cf_check_in: check_in,
            cf_check_out: check_out,
            cf_destino: destino,
            cf_viajero_s: viajero,
            cf_viajeros: viajero,
            cf_observaciones: observaciones,
            cf_numero_de_cliente: 0
        },
    }

    try {

        let access_token = await obtenerAcces()

        let response = await fetch('https://desk.zoho.com/api/v1/tickets', {
            method: 'POST',
            headers: {
                'Authorization': `Zoho-oauthtoken ${access_token}`
            },
            body: JSON.stringify(ticket_info)
        })

        let data = await response.json()

        return JSON.stringify(data)

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    createATicket
}
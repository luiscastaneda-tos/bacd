const fetch = require("node-fetch");
const { obtenerAcces } = require("../configs/zoho")
let departmentId = 603403000018558029

async function createATicket({ informacion_viajantes, tabla, hoteles, check_in, check_out, destino, viajero, observaciones }) {
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

async function getTicketData({ ticketId }) {
  let accessToken = await obtenerAcces();
  const url = `https://desk.zoho.com/api/v1/tickets/${ticketId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log(response)
      throw new Error(`Error: ${response.statusText}`);
    }

    const ticketData = await response.json();
    const respuesta = {
      resolution: ticketData.resolution,
      checkin: ticketData.cf.cf_check_in ? ticketData.cf.cf_check_in : ticketData.customFields["CHECK IN"],
      checkout: ticketData.cf.cf_check_out ? ticketData.cf.cf_check_out : ticketData.customFields["CHECK OUT"],
      noches: ticketData.cf.cf_noches ? ticketData.cf.cf_noches : ticketData.customFields["Noches"]
    };

    return JSON.stringify(respuesta)

  } catch (error) {
    console.error('Error al obtener el ticket:', error);
    return JSON.stringify({ error: error.message });
  }
}

async function getTicketDataVuelo({ ticketId }) {
  let accessToken = await obtenerAcces();
  const url = `https://desk.zoho.com/api/v1/tickets/${ticketId}/conversations`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log(response)
      throw new Error(`Error: ${response.statusText}`);
    }

    const ticketData = await response.json();

    const publics = ticketData.data.filter((item) => item.isPublic)

    console.log(publics)

    const result = {
      content: publics[0].content.replaceAll("&amp;", "&")
    }

    return JSON.stringify(result)

  } catch (error) {
    console.error('Error al obtener el ticket:', error);
    return JSON.stringify({ error: error.message });
  }
}
module.exports = {
  createATicket,
  getTicketData,
  getTicketDataVuelo
}
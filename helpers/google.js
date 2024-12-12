const { getDataDB } = require("./database")
const { connectGoogleApi, spreadsheetId } = require("../configs/google")

async function clearReport(range) {

  const { sheets } = connectGoogleApi()

  try {

    const response = await sheets.spreadsheets.values.clear({
      spreadsheetId, range
    })

    return response

  } catch (error) {
    console.error(error)
  }
}

async function appendDataToSpreedNoches({ query_mes, query_name, query_hotel, range_date, socio }) {
  try {

    await clearReport(`noches!A10:Z`)
    await clearReport(`noches!E3:G6`)

    let nombre_empresa = `select razon_social as empresa from vw_Reservas_AI where numero_socio = ${socio} group by razon_social;`
    
    let data_empresa = await getDataDB({ query: nombre_empresa })

    let { empresa } = data_empresa[0]

    await addToSheet({ range: `noches!E3:G5`, values: [[empresa], [`Numero de socio: ${socio}`], [range_date]] })

    /***********************************************/
    let data = await getDataDB({ query: query_mes })

    let headers = ["Mes", "Noches", "Noktos", "Total"]

    let updates = data.map(
      (objeto) => {

        return headers.map(
          (header) => {

            if (header == "Mes") return (objeto[header] ? objeto[header].toUpperCase() : "No data")
            if (header == "Total") return (objeto["Noktos"] ? objeto["Noktos"] * 168.2 : "No data")
            return (objeto[header] ? objeto[header] : "No data")

          })

      }
    )

    await addToSheet({ range: `noches!A10`, values: updates, raw: false })

    /********************************************************/
    let data_hotel = await getDataDB({ query: query_hotel })

    let headers_hotel = ["Hotel", "Noches", "Noktos", "subtotal", "IVA", "Total"]

    let updates_hotel = data_hotel.map(
      (objeto) => {

        return headers_hotel.map(
          (header) => {

            if (header == "Hotel") return (objeto[header] ? objeto[header].toUpperCase() : "No data")
            if (header == "Total") return (objeto["Noktos"] ? objeto["Noktos"] * 168.2 : "No data")
            if (header == "subtotal") return (objeto["Noktos"] ? objeto["Noktos"] * 145 : "No data")
            if (header == "IVA") return (objeto["Noktos"] ? objeto["Noktos"] * 145 * .16 : "No data")
            return (objeto[header] ? objeto[header] : "No data")

          })

      }
    )

    await addToSheet({ range: `noches!E10`, values: updates_hotel, raw: false })

    /********************************************************/
    let data_nombres = await getDataDB({ query: query_name })

    let headers_nombre = ["Viajero", "Noches", "Noktos", "Total"]

    let updates_nombre = data_nombres.map(
      (objeto) => {

        return headers_nombre.map(
          (header) => {

            if (header == "Viajero") return (objeto[header] ? objeto[header].toUpperCase() : "No data")
            if (header == "Total") return (objeto["Noktos"] ? objeto["Noktos"] * 168.2 : "No data")

            return (objeto[header] ? objeto[header] : "No data")

          })

      }
    )

    await addToSheet({ range: `noches!K10`, values: updates_nombre, raw: false })

    return JSON.stringify({ok:true})
  } catch (error) {
    console.log(error)
    return JSON.stringify({ok:false, message: "Error al agregar la data a la plantilla"})
  }
}

async function appendDataToSpreed({ query, range_date, socio }) {
  try {

    let nombre_empresa = `select razon_social as empresa from vw_Reservas_AI where numero_socio = ${socio} group by razon_social;`

    await clearReport(`Estado de cuenta!A11:Z`)
    await clearReport(`Estado de cuenta!H3:L3`)
    await clearReport(`Estado de cuenta!A7:A8`)

    let data = await getDataDB({ query })
    let data_empresa = await getDataDB({ query: nombre_empresa })

    let { empresa } = data_empresa[0]

    let headers = ["Viajero", "Host", "Codigo_reservacion_host", "Habitacion", "Checkin", "Checkout", "Noches", "Noktos", "Etapa", "Fecha_facturacion", "INV", "Estatus", "Total sin impuestos", "IVA", "Total"]
    let updates = data.map((objeto) => {
      return headers.map((header) => {
        if (header == "IVA") {
          return (objeto["Noktos"] ? objeto["Noktos"] * 145 * .16 : "No data")
        }
        if (header == "Checkout") {
          return (objeto[header] ? new Intl.DateTimeFormat('en-GB').format(new Date(objeto[header])) : "No data")
        }
        if (header == "Checkin") {
          return (objeto[header] ? new Intl.DateTimeFormat('en-GB').format(new Date(objeto[header])) : "No data")
        }
        if (header == "Total") {
          return (objeto["Noktos"] ? objeto["Noktos"] * 168.2 : "No data")
        }
        if (header == "Total sin impuestos") {
          return (objeto["Noktos"] ? objeto["Noktos"] * 145 : "No data")
        }
        return (objeto[header] ? objeto[header].toString().toUpperCase() : "No data")
      })
    })

    await addToSheet({ range: `Estado de cuenta!A11`, values: updates })
    await addToSheet({ range: `Estado de cuenta!H3:L3`, values: [[range_date]] })
    await addToSheet({ range: "Estado de cuenta!A7:A8", values: [[`Numero de socio: ${socio}`], [empresa]] })

    return JSON.stringify({ ok: true })

  }
  catch (error) {
    console.log(error)
    return JSON.stringify({ok: false})
  }
}

async function addToSheet({ range, values, raw = true }) {

  const { sheets } = connectGoogleApi()

  try {

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      resource: { values },
      valueInputOption: raw ? "RAW" : "USER_ENTERED"
    })

    return response

  } catch (error) {
    console.error(error)
    return JSON.stringify({ ok: false, error })
  }
}

module.exports = {
  clearReport,
  appendDataToSpreed,
  appendDataToSpreedNoches
}

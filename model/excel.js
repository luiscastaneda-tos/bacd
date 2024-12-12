const { getDataDB } = require("../helpers/database");
const { descifrar } = require("../helpers/general");
const ExcelJS = require('exceljs');

async function crearExcel(req, res) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    const encodedData = req.query.data;
    const decodedData = descifrar(decodeURIComponent(encodedData))

    let { query, columns } = JSON.parse(decodedData)

    let rows = await getDataDB({ query })

    let data = rows.map(
        (element) => {
            return {
                ...element,
                Checkin: (element.Checkin ? new Intl.DateTimeFormat('en-GB').format(new Date(element.Checkin)).toString() : null),
                Checkout: (element.Checkout ? new Intl.DateTimeFormat('en-GB').format(new Date(element.Checkout)).toString() : null),
                checkin: (element.checkin ? new Intl.DateTimeFormat('en-GB').format(new Date(element.checkin)).toString() : null),
                checkout: (element.checkout ? new Intl.DateTimeFormat('en-GB').format(new Date(element.checkout)).toString() : null)
            }
        })

    worksheet.columns = columns;


    data.forEach(element => {
        worksheet.addRow(element);
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=reporteNoktos.xlsx');

    await workbook.xlsx.write(res);
    
    res.end();
}

module.exports = {
    crearExcel,
}
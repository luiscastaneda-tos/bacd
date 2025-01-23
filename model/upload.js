const { busquedaBinaria, isUpdate } = require("../helpers/upload");
const db = require("../configs/database");

async function upload(body) {
    try {
        const datos = body;
        const data = await db.query("SELECT * FROM empleados_kone order by NoEmpleado asc");
        const dataToAdd = []
        const dataToUpdate = []
        const responseUser = {
            message: 'Datos procesados correctamente',
        }

        datos.forEach((objeto) => {
            const { Workers = null, NoEmpleado = null, CentroCosto = null, viajeroSAN = null, EmpleadoOrigen = null, Posicion = null, EmailWorker = null, ManagerID = null, ManagerUsuario = null, ManagerMail = null, CentroCostoName = null, BusinessUnit = null, Renglon = null, user_id = null } = objeto
            const index = busquedaBinaria(data, NoEmpleado)
            if (index === null) {
                dataToAdd.push([Workers, NoEmpleado, CentroCosto, viajeroSAN, EmpleadoOrigen, Posicion, EmailWorker, ManagerID, ManagerUsuario, ManagerMail, CentroCostoName, BusinessUnit, Renglon, user_id])
                return { ...objeto, action: "ADD" }
            }
            if (isUpdate(data[index], objeto)) {
                dataToUpdate.push([Workers, CentroCosto, viajeroSAN, EmpleadoOrigen, Posicion, EmailWorker, ManagerID, ManagerUsuario, ManagerMail, CentroCostoName, BusinessUnit, Renglon, user_id, NoEmpleado])
                return { ...objeto, action: "UPDATE" }
            }
        })

        let queryToAdd = `INSERT INTO empleados_kone (Workers, NoEmpleado, CentroCosto, ViajeroSAN, EmpleadoOrigen, Posicion, EmailWorker, ManagerID, ManagerUsuario, ManagerMail, CentroCostoName, BusinessUnit, Renglon, user_id) VALUES `
        dataToAdd.forEach((objeto, index) => {
            queryToAdd += (index == dataToAdd.length - 1 ? "(?,?,?,?,?,?,?,?,?,?,?,?,?,?);" : "(?,?,?,?,?,?,?,?,?,?,?,?,?,?),\n")
        })

        if (dataToAdd.length != 0) {
            let responseToAdd = await db.query(queryToAdd, dataToAdd.flat())
            responseUser.infoAdd = responseToAdd.info
            responseUser.affectedRowsAdd = responseToAdd.affectedRows
            responseUser.dataToAdd = dataToAdd
        }

        let infoUpdate = []
        let queryToUpdate = `UPDATE empleados_kone SET Workers = ?, CentroCosto = ?, ViajeroSAN = ?, EmpleadoOrigen = ?, Posicion = ?, EmailWorker = ?, ManagerID = ?, ManagerUsuario = ?, ManagerMail = ?, CentroCostoName = ?, BusinessUnit = ?, Renglon = ?, user_id = ? WHERE NoEmpleado = ?;`
        for (let i = 0; i < dataToUpdate.length; i++) {
            let objeto = dataToUpdate[i]
            let responseToUpdate = await db.query(queryToUpdate, objeto)
            infoUpdate.push(responseToUpdate.info)
        }
        responseUser.infoUpdate = infoUpdate

        console.log(dataToAdd)
        console.log(dataToUpdate)

        return responseUser
    } catch (error) {
        console.log(error)
        return { message: 'Error al procesar los datos', error: true };
    }
}


module.exports = { upload }
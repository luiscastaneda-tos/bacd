function busquedaBinaria(lista, elemento) {
    let n = Math.floor(lista.length / 2);

    if(lista.length === 0) return null

    if (lista.length > 1) {
        if (lista[n].NoEmpleado == elemento) {
            return n;
        } else if (elemento < lista[n].NoEmpleado) {
            let sublista = lista.slice(0, n);
            return busquedaBinaria(sublista, elemento);
        } else {
            let sublista = lista.slice(n);
            let resultado = busquedaBinaria(sublista, elemento);
            if (resultado !== null) {
                return resultado + n;
            } else {
                return null;
            }
        }
    } else {
        if (lista[0].NoEmpleado == elemento) {
            return 0;
        } else {
            return null;
        }
    }
}

function isUpdate(current, update) {
    return current.Workers != update.Workers ||
        current.CentroCosto != update.CentroCosto ||
        current.ViajeroSAN != update.viajeroSAN ||
        current.EmpleadoOrigen != update.EmpleadoOrigen ||
        current.Posicion != update.Posicion ||
        current.EmailWorker != update.EmailWorker ||
        current.ManagerID != update.ManagerID ||
        current.ManagerUsuario != update.ManagerUsuario ||
        current.ManagerMail != update.ManagerMail ||
        current.CentroCostoName != update.CentroCostoName ||
        current.BusinessUnit != update.BusinessUnit ||
        current.Renglon != update.Renglon ||
        current.user_id != update.user_id
}

module.exports = { busquedaBinaria, isUpdate }
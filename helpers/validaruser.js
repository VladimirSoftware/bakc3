const validarUser = (req) => {

    const validaciones = [];

    if (!req.body.nombre){
        validaciones.push('nombre es requerido');
    }
    if (!req.body.email){
        validaciones.push('email es requerido');
    }
    if (!req.body.estado){
        validaciones.push('estado es requerido');
    }
    

    return validaciones;
}

module.exports = {
    validarUser,
}
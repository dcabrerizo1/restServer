const Role = require('../models/role');
const User = require('../models/usuario');

// Verificar si el rol es válido
const validRole = async (role = '') => {
    const rolExist = await Role.findOne({role})
    if(!rolExist){
        throw new Error(`El rol ${role} no es válido`)
    }
}

// Verificar si el correo existe
const validEmail = async (mail = '') => {
    const existeEmail = await User.findOne({mail})
    if(existeEmail){
        throw new Error(`El email ${mail} ya se encuentra registrado`)
    }
}

// Verificar si el ID usuario existe
const validId = async (id) => {
    const existeId = await User.findById(id)
    if(!existeId){
        throw new Error(`El ID ${id} no existe`)
    }
}


module.exports = {
    validRole,
    validEmail,
    validId
}
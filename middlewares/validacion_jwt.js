const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/usuario');

const validateJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token')

    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        // Verificar que el token es válido
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        // Añadimos a la request actual el uid del token
        // req.uid = uid;

        // Añadimos a la request actual el usuario que lanza la acción mediante su UID
        const user_uid = await User.findById(uid)
        
        // Verificar si el usuario UID existe
        if(!user_uid){
            return res.status(401).json({
                msg: 'Token no válido - el usuario no existe'
            })
        }

        // Verificar si el usuario UID tiene el state TRUE
        if(!user_uid.state){
            return res.status(401).json({
                msg: 'Token no válido - usuario eliminado'
            })
        }

        // Enviamos por request el usuario que lanza la acción validado
        req.user_uid = user_uid

        // Continua el proceso
        next();

    } catch (error) {
        
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
        
    }

    
    
}





module.exports = {
    validateJWT
}
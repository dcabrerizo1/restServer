const {response} = require('express')
const User = require('../models/usuario')
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generateJWT');

const login = async(req, res = response) => {

    const {mail, pass} = req.body;

    try{
        
        // Verificar si el email existe
        const user = await User.findOne({mail})
        if( (!user) ){
            return res.status(400).json({
                msg: 'El usuario o la contraseña son incorrectos - correo'
            })
        }

        // Verificar si el usuario se encuentra activo
        if( !user.state ){
            return res.status(400).json({
                msg: 'El usuario o la contraseña son incorrectos - state'
            })
        }

        // Verificar la contraseña del usuario
        const valid_pass = bcryptjs.compareSync(pass, user.pass);
        if( !valid_pass ){
            return res.status(400).json({
                msg: 'El usuario o la contraseña son incorrectos - pass'
            })
        }

        // Generar JWT
        const token = await generateJWT( user.id )

        res.json({
            msg: 'Login OK',
            user,
            token
        })

    } catch (error){
        console.log(error);
        return res.status(500).json({
            msg: 'Habla con el administrador'
        })
    }
    
}

module.exports = {
    login
}
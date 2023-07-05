const {response} = require('express')
const User = require('../models/usuario')
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generateJWT');
const {google_verify} = require('../helpers/google-verify')

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

const googleSignin = async(req, res = response) => {
    
    const {id_token} = req.body

    try {
        
        // Obtenemos los datos que nos interesan del usuario verificando el token
        const {name, img, mail} = await google_verify(id_token)

        // Ahora comprobamos si el correo del usuario que ha iniciado sesión existe en BD
        let user = await User.findOne({mail})

        // Crear el usuario si no existe en BD
        if(!user){
            
            // Datos del nuevo usuario
            const new_user = {
                name, mail, pass: '.', img, google: true
            }

            // Creamos el usuario
            user = new User( new_user );
            await user.save();
        }

        // Comprobamos en DB si el usuario está borrado
        if(!user.state){
            return res.status(401).json({
                msg: 'Hable con el administrador, el usuario se encuentra bloqueado'
            })
        }

        // Generar JWT
        const token = await generateJWT( user.id )

        res.json({
            user,
            token
        })

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se ha podido verificar'
        })
    }
}

module.exports = {
    login, googleSignin
}
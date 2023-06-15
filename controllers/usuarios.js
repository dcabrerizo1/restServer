const { response, request } = require('express')
const bcryptjs = require('bcryptjs');
const User = require('../models/usuario');

const usuariosGet = async (req, res = response) => {
    
    const { limit = 5, from = 0 } = req.query; // Variables recibidas por GET
    const query = {state:true}; // Condiciones para la búsqueda de usuarios
/*    
    // Obtener usuarios
    const users = await User.find(query) // Ponemos las condiciones definidas
        .limit(Number(limit)) // Fijamos un límite de usuarios que queremos obtener
        .skip(Number(from)) // Fijamos a partir de qué usuario queremos obtener (por orden, desde el número indicado)
    
    // Contar usuarios encontrados
    const total = await User.countDocuments(query)
*/
    // Para evitar lentitud, mandamos las dos peticiones comentadas arriba a la vez
    const [usuarios, total] = await Promise.all([ // En la constante ponemos el nombre de las variables resultantes para cada petición por orden
        User.find(query)
            .limit(Number(limit))
            .skip(Number(from)),
        User.countDocuments(query)
    ])

    // Respuesta JSON
    res.json({
        "Total usuarios": total,
        usuarios
    })
}

const usuariosPost = async (req = request, res = response) => {   

    // Recuperar valores del post y crear un array con ellos
    const { name, mail, pass, role } = req.body;
    const usuario = new User( { name, mail, role } );
    
    // Encriptar la password
    const salt = bcryptjs.genSaltSync(10);
    usuario.pass = bcryptjs.hashSync(pass, salt);

    // Guardar datos en DB
    await usuario.save();

    // Respuesta JSON
    res.json({
        usuario,
        //nombre, edad
    })
}

const usuariosPut = async (req, res = response) => {
    
    const { id } = req.params;
    const { pass, google, mail, _id, ...data } = req.body;

    // Validar en la BD
    if( pass ){
        const salt = bcryptjs.genSaltSync(10);
        data.pass = bcryptjs.hashSync(pass, salt);
    }

    const user = await User.findByIdAndUpdate( id, data )

    // Respuesta JSON
    res.json({
        user
    })
}

const usuariosPatch = (req, res = response) => {
    // Respuesta JSON
    res.json({
        msg: 'Patch API - controlador'
    })
}

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;

    // Borrar físicamente
    // const user = await User.findByIdAndDelete( id )

    // Borrar cambiando el estado del usuario
    const user = await User.findByIdAndUpdate( id, {state: false})

    // Respuesta JSON
    res.json({
        user
    })
}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}
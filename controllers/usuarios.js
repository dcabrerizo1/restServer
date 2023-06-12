const { response } = require('express')


const usuariosGet = (req, res = response) => {
    const { id, name, edad = 20 } = req.query;
    // Respuesta JSON
    res.json({
        msg: 'Get API - controlador',
        id, name, edad
    })
}

const usuariosPost = (req, res = response) => {
    const { nombre, edad } = req.body;
    // Respuesta JSON
    res.json({
        msg: 'Post API - controlador',
        nombre, edad
    })
}

const usuariosPut = (req, res = response) => {
    const id = req.params.id;
    // Respuesta JSON
    res.json({
        msg: 'Put API - controlador',
        id
    })
}

const usuariosPatch = (req, res = response) => {
    // Respuesta JSON
    res.json({
        msg: 'Patch API - controlador'
    })
}

const usuariosDelete = (req, res = response) => {
    const id = req.params.id;
    // Respuesta JSON
    res.json({
        msg: 'Delete API - controlador',
        id
    })
}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}
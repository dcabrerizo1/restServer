const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server{

    constructor() {
        
        this.app = express()
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios'

        // Conectar a la BD
        this.dbconnect();

        // Middlewares -> funciones que siempre se ejecutan cuando levantamos el servidor
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    // Conexión a la BD
    async dbconnect(){
        await dbConnection()
    }

    middlewares(){

        // CORS
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use(express.json())
        
        // Directorio public
        this.app.use( express.static('public') );

    }

    routes(){

        this.app.use( this.usuariosPath , require('../routes/user') )

    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor en línea. Puerto:',this.port)
        })
    }

}

module.exports = Server;
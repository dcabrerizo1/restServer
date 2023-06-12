const express = require('express')
const cors = require('cors')

class Server{

    constructor() {
        
        this.app = express()
        this.port = process.env.PORT || 8080
        this.usuariosPath = '/api/usuarios'

        // Middlewares -> funciones que siempre se ejecutan cuando levantamos el servidor
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
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

const mongoose = require('mongoose');

const dbConnection = async() => {

    try{
        await mongoose.connect(process.env.MONGODB_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true/*,
            useCreateIndex: true,
            useFindAndModify: false*/
        })

        console.log('Base de datos conectada')
    }catch (error){
        console.log(error)
        throw new Error('No se ha podido conectar a la base de datos.')
    }

}




module.exports = {
    dbConnection
}
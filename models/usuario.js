
const { Schema, model } = require('mongoose');

const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'Introduce un nombre']
    },
    mail: {
        type: String,
        required: [true, 'Introduce un email'],
        unique: true
    },
    pass: {
        type: String,
        required: [true, 'Introduce una contraseña']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE','USER_ROLE'],
        default: 'USER_ROLE'
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

// Excluimos algunos campos del objeto que devuelve al usuario cuando es creado
userSchema.methods.toJSON = function (){
    const { __v, pass, _id, ...user } = this.toObject()
    
    // Canviem de nom la columna _id
    user.uid = _id  

    return user
}

module.exports = model('Usuario',userSchema)
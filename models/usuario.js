
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
        emun: ['ADMIN_ROLE','USER_ROLE']
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
    const { __v, pass, ...user } = this.toObject();
    return user
}

module.exports = model('Usuario',userSchema)
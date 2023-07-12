
const { Schema, model } = require('mongoose');

const categorySchema = Schema ({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

// Excluimos algunos campos del objeto que devuelve al usuario cuando es creado
categorySchema.methods.toJSON = function (){
    const { __v, state, ...data } = this.toObject()
    return data
}

module.exports = model('Category',categorySchema)
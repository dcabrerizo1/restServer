
const { Schema, model } = require('mongoose');

const productSchema = Schema ({
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
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    }
})

// Excluimos algunos campos del objeto que devuelve al usuario cuando es creado
productSchema.methods.toJSON = function (){
    const { __v, state, ...data } = this.toObject()
    return data
}

module.exports = model('Product',productSchema)
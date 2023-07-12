const { Category, Product } = require('../models');
const Role = require('../models/role');
const User = require('../models/usuario');

// Verificar si el rol es válido
const validRole = async (role = '') => {
    const rolExist = await Role.findOne({role})
    if(!rolExist){
        throw new Error(`El rol ${role} no es válido`)
    }
}

// Verificar si el correo existe
const validEmail = async (mail = '') => {
    const existeEmail = await User.findOne({mail})
    if(existeEmail){
        throw new Error(`El email ${mail} ya se encuentra registrado`)
    }
}

// Verificar si el ID usuario existe
const validId = async (id) => {
    const existeId = await User.findById(id)
    if(!existeId){
        throw new Error(`El ID ${id} no existe`)
    }
}

// Verificar si el ID categoria existe
const categoryExist = async(id) => {
    const existeID = await Category.findById(id)
    if(!existeID){
        throw new Error(`El ID ${id} no existe`)
    }
}

// Verificar si el nombre de la categoria existe
const checkCategoryName = async(name) => {
    const category_name = name.toUpperCase()
    const existeID = await Category.findOne({name:category_name})
    if(!existeID){
        throw new Error(`La categoria ${name} no existe`)
    }
}

// Verificar si el nombre del producto existe
const productExist = async(name) => {
    const product_name = name.toUpperCase()
    const existeID = await Product.findOne({name:product_name})
    if(existeID){
        throw new Error(`El producto ${name} ya existe, introduce un nombre distinto`)
    }
}

// Verificar si el producto existe por ID
const productIdExist = async(id) => {
    const existeID = await Product.findById(id)
    if(!existeID){
        throw new Error(`El ID ${id} no existe`)
    }
}


module.exports = {
    validRole,
    validEmail,
    validId,
    categoryExist,
    checkCategoryName,
    productExist,
    productIdExist
}
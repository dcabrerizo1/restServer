const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const {
    User, Category, Product, Role
} = require('../models')

allowedCollections = [
    'category',
    'product',
    'role',
    'user'
]

const searchUsers = async ( term = '', res = response ) => {

    const checkMongoID = ObjectId.isValid( term ); // Devuelve true si es válido

    // BUSQUEDA DE USUARIO POR ID
    if(checkMongoID){
        const user = await User.findById(term)
        return res.json({
            results: (user) ? [user] : []
        })
    }

    // BUSQUEDA DE USUARIO POR OTROS TERMINOS
    const regex = new RegExp(term,'i');// Expresión regular para manejar el key sensitive

    const users = await User.find({ // Con find regresamos todas las coincidencias. Podríamos usar count para devolver el número de coincidencias
        $or: [ {name:regex , mail:true} , {role:regex} ], // Buscamos en diferentes columnas de la tabla con el $or, puede haber conjuntos dentro de un $or
        $and: [{state:true}] // Para especificar un campo que ha de estar igual si o si, usamos $and
    })

    res.json({
        results: (users) ? [users] : []
    })
}

const searchCategories = async ( term = '', res = response ) => {

    const checkMongoID = ObjectId.isValid( term ); // Devuelve true si es válido

    // BUSQUEDA DE CATEGORIA POR ID
    if(checkMongoID){
        const category = await Category.findById(term)
        return res.json({
            results: (category) ? [category] : []
        })
    }

    // BUSQUEDA DE CATEGORIA POR OTROS TERMINOS
    const regex = new RegExp(term,'i');// Expresión regular para manejar el key sensitive

    const categories = await Category.find({ // Con find regresamos todas las coincidencias. Podríamos usar count para devolver el número de coincidencias
        $or: [ {name:regex} ], // Buscamos en diferentes columnas de la tabla con el $or, puede haber conjuntos dentro de un $or
        $and: [{state:true}] // Para especificar un campo que ha de estar igual si o si, usamos $and
    })

    res.json({
        results: (categories) ? [categories] : []
    })
}

const searchProducts = async ( term = '', res = response ) => {

    const checkMongoID = ObjectId.isValid( term ); // Devuelve true si es válido

    // BUSQUEDA DE PRODUCTO POR ID
    if(checkMongoID){
        const product = await Product.findById(term).populate('category','name') // Añadimos populate para ver la categoria
        return res.json({
            results: (product) ? [product] : []
        })
    }

    // BUSQUEDA DE PRODUCTO POR OTROS TERMINOS
    const regex = new RegExp(term,'i');// Expresión regular para manejar el key sensitive

    const products = await Product.find({ // Con find regresamos todas las coincidencias. Podríamos usar count para devolver el número de coincidencias
        $or: [ {name:regex} ], // Buscamos en diferentes columnas de la tabla con el $or, puede haber conjuntos dentro de un $or
        $and: [{state:true}] // Para especificar un campo que ha de estar igual si o si, usamos $and
    }).populate('category','name') // Añadimos populate para ver la categoria

    res.json({
        results: (products) ? [products] : []
    })
}

const search = (req, res = response) => {

    const {collection,term} = req.params;

    if(!allowedCollections.includes(collection)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${allowedCollections}`
        })
    }

    switch(collection){
        case 'category':

            searchCategories(term,res)

            break;
        
        case 'product':

            searchProducts(term,res)
        
            break;
        
        case 'role':
            
            break;
        
        case 'user':

            searchUsers(term,res)

            break;

        default:
        
            res.status(500).json({
                msg: 'Error: No se ha identificado la colección'           
            })

            break;
    }

}



module.exports = {
    search
}
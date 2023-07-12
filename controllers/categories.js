const { response } = require('express')
const {
    Category
} = require('../models')

const createCategory = async(req, res = response) => {

    const name = req.body.name.toUpperCase()
    const categoryDB = await Category.findOne({name})

    // Si la categoria ya existe
    if(categoryDB){
        return res.status(400).json({
            msg: `La categoria ${name} ya existe`
        })
    }
    
    // Crear la categoria
    const new_category = {
        name, 
        user: req.user_uid._id
    }
    const category = new Category( new_category );
    await category.save();

    res.status(201).json({
        msg: `Se ha creado la categoria ${name}`
    })
} 

const getCategories = async (req, res = response) => {
    
    const { limit = 5, from = 0 } = req.query; // Variables recibidas por GET
    const query = {state:true}; // Condiciones para la búsqueda de categorias

    const [categories, total] = await Promise.all([ 
        Category.find(query) // Recuperar categorias que guardamos en la variable categories
            .limit(Number(limit))
            .skip(Number(from))
            .populate('user','name'),
        Category.countDocuments(query) // Contar registros que guardamos en la variable total
    ])

    // Respuesta JSON
    res.json({
        "Total categorias": total,
        categories
    })
}

const getCategory = async (req, res = response) => {
    
    const { id } = req.params;
    const category = await Category.findById( id )
        .populate('user','name')

    if(!category.state){
        return res.status(400).json({
            msg: `La categoria se encuentra borrada`
        })
    }

    // Respuesta JSON
    res.json({
        category
    })

}

const updateCategory = async (req, res = response) => {
    
    const { id } = req.params;
    const name = req.body.name.toUpperCase();
    const categoryDB = await Category.findOne({name})

    // Si el nombre de categoria ya existe
    if(categoryDB){
        return res.status(400).json({
            msg: `La categoria ${name} ya existe, introduzca un nombre distinto`
        })
    }
    
    // Actualizamos el nombre
    const data = { name }
    const category = await Category.findByIdAndUpdate( id, data, {new: true} ).populate('user','name')

    // Respuesta JSON
    res.json({
        category
    })
}

const deleteCategory = async (req, res = response) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate( id, {state: false}, {new: true}).populate('user','name')

    // Respuesta JSON
    res.json({
        'Categoria eliminada': category
    })
}

module.exports = {
    createCategory, getCategories, getCategory, updateCategory, deleteCategory
}
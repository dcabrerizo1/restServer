const { response } = require('express')
const {
    Product, Category
} = require('../models')

const createProduct = async(req, res = response) => {

    const name = req.body.name.toUpperCase()
    // Obtener la categoria
    const categoryName = req.body.category.toUpperCase()
    const categoryDB = await Category.findOne({name:categoryName})
    // Comprobar si se ha borrado la categoria
    if(!categoryDB.state){
        return res.status(400).json({
            msg: `La categoria ${req.body.category} s'ha esborrat, posat en contacte amb l'administrador`
        })
    }
    // Crear el objeto con todos los campos a insertar
    const new_product = {
        name, 
        user: req.user_uid._id,
        state: req.body.state,
        price: req.body.price,
        category: categoryDB._id,
        description: req.body.description,
        available: req.body.available
    }
    const product = new Product( new_product );
    await product.save();

    res.status(201).json({
        msg: `Se ha creado el producto: ${name}`
    })
}

const getProducts = async(req, res = response) => {
    const { limit = 5, from = 0 } = req.query; // Variables recibidas por GET
    const query = {state:true}; // Condiciones para la búsqueda de productos

    const [products, total] = await Promise.all([ 
        Product.find(query) // Recuperar productos que guardamos en la variable products
            .limit(Number(limit))
            .skip(Number(from))
            .populate('user','name')
            .populate('category','name'),
        Product.countDocuments(query) // Contar registros que guardamos en la variable total
    ])

    // Respuesta JSON
    res.json({
        "Total productos": total,
        products
    })
}

const getProduct = async (req, res = response) => {
    
    const { id } = req.params;
    const product = await Product.findById( id )
        .populate('user','name')
        .populate('category','name')

    if(!product.state){
        return res.status(400).json({
            msg: `El producto se encuentra borrado`
        })
    }

    // Respuesta JSON
    res.json({
        product
    })
}

const updateProduct = async (req, res = response) => {
    
    const { id } = req.params;
    const name = req.body.name.toUpperCase();
    
    let category_name;
    if(req.body.category){
        category_name = req.body.category.toUpperCase();
    }

    let [check_name,categoryDB,productDB] = await Promise.all([ 
        Product.countDocuments({name:name, _id: {$ne: id}}),
        Category.findOne({name: category_name }),
        Product.findById({_id: id})
    ])

    if(!productDB.state){
        return res.status(400).json({
            msg: `El producto ${productDB.name} se encuentra borrado, pongase en contacto con el administrador`
        })
    }

    if(check_name){
        return res.status(400).json({
            msg: `El nombre ${name} ya existe, introduzca un nombre distinto para el producto`
        })
    }

    if(!categoryDB && category_name){
        return res.status(400).json({
            msg: `La categoria ${category_name} no existe, introduzca una categoria existente`
        })
    }else if(!categoryDB){
        categoryDB = await Category.findOne({_id: productDB.category })
    }
   
    // Actualizamos el producto
    const data = { 
        name,
        price: req.body.price,
        category: categoryDB._id,
        available: req.body.available 
    }
    const product = await Product.findByIdAndUpdate( id, data, {new: true} ).populate('user','name')

    // Respuesta JSON
    res.json({
        product
    })
}

const deleteProduct = async (req, res = response) => {
    
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate( id, {state: false}, {new: true}).populate('user','name')

    // Respuesta JSON
    res.json({
        'Producto eliminado': product
    })
}

module.exports = {
    createProduct, getProducts, getProduct, updateProduct, deleteProduct
}
const { Router } = require('express');
const { check } = require('express-validator');
// Importar funciones del controlador de categorias
const {
    createProduct, getProducts, getProduct, updateProduct, deleteProduct
} = require('../controllers/products')
// Importar middlewares unificados
const {
    validateJWT, validarCampos, adminRole
} = require('../middlewares')
// Importar helpers
const { 
    checkCategoryName, productExist, productIdExist
} = require('../helpers/db-validators');

const router = Router();

// {{url}}/api/products

// Crear producto - privado - requiere token
router.post('/',[
    // Comprovar token
    validateJWT,
    // Comprobar que el campo está rellenado
    check('name','El nombre es obligatorio').not().isEmpty(),
    // Comprobar que el producto no existe
    check('name').custom(productExist),
    // Comprobar si encia la categoria
    check('category','La categoria es obligatoria').not().isEmpty(),
    // Comprobar si la categoria existe
    check('category').custom(checkCategoryName),
    // Comprobar los check lanzados
    validarCampos
],createProduct)

// Obtener todos los productos - publico
router.get('/',getProducts)

// Obtener un producto por id - publico
router.get('/:id',[
    // Comprobar si la ID es válida
    check('id','No es un ID válido').isMongoId(),
    // Comprobar si la id existe
    check('id').custom(productIdExist),
    // Comprobar los check lanzados
    validarCampos
],getProduct)

// Actualizar un producto - privado - requiere token
router.put('/:id',[
    // Comprovar token
    validateJWT,
    // Comprobar si la ID es válida
    check('id','No es un ID válido').isMongoId(),
    // Comprobar si la id existe
    check('id').custom(productIdExist),
    // Comprobar que el campo está rellenado
    check('name','El nombre es obligatorio').not().isEmpty(),
    // Comprobar los check lanzados
    validarCampos
],updateProduct)

// Borrar un producto - privado - requiere token - requiere rol admin
router.delete('/:id',[
    // Comprovar token
    validateJWT,
    // Comprobar si la ID es válida
    check('id','No es un ID válido').isMongoId(),
    // Comprobar si la id existe
    check('id').custom(productIdExist),
    // Comprobar que tiene el rol admin
    adminRole,
    // Comprobar los check lanzados
    validarCampos
],deleteProduct)

module.exports = router;
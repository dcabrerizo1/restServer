const { Router } = require('express');
const { check } = require('express-validator');
// Importar funciones del controlador de categorias
const {
    createCategory, getCategories, getCategory, updateCategory, deleteCategory
} = require('../controllers/categories')
// Importar middlewares unificados
const {
    validateJWT, validarCampos, adminRole
} = require('../middlewares')
// Importar helpers
const { 
    categoryExist 
} = require('../helpers/db-validators');

const router = Router();

// {{url}}/api/categories

// Obtener todas las categorias - publico
router.get('/',getCategories)

// Obtener una categoria por id - publico
router.get('/:id',[
    // Comprobar si la ID es válida
    check('id','No es un ID válido').isMongoId(),
    // Comprobar si la id existe
    check('id').custom(categoryExist),
    // Comprobar los check lanzados
    validarCampos
],getCategory)

// Crear una categoria - privado - requiere token
router.post('/',[
    // Comprovar token
    validateJWT,
    // Comprobar que el campo está rellenado
    check('name','El nombre es obligatorio').not().isEmpty(),
    // Comprobar los check lanzados
    validarCampos
],createCategory)

// Actualizar una categoria - privado - requiere token
router.put('/:id',[
    // Comprovar token
    validateJWT,
    // Comprobar si la ID es válida
    check('id','No es un ID válido').isMongoId(),
    // Comprobar si la id existe
    check('id').custom(categoryExist),
    // Comprobar que el campo está rellenado
    check('name','El nombre es obligatorio').not().isEmpty(),
    // Comprobar los check lanzados
    validarCampos
],updateCategory)

// Borrar una categoria - privado - requiere token - requiere rol admin
router.delete('/:id',[
    // Comprovar token
    validateJWT,
    // Comprobar si la ID es válida
    check('id','No es un ID válido').isMongoId(),
    // Comprobar si la id existe
    check('id').custom(categoryExist),
    // Comprobar que tiene el rol admin
    adminRole,
    // Comprobar los check lanzados
    validarCampos
],deleteCategory)





module.exports = router;
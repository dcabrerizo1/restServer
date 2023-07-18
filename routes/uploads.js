const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validateFiles } = require('../middlewares');
const {
    loadFiles, uploadFiles, showFiles, uploadFiles_cloudinary
} = require('../controllers/uploads')
const {
    allowedCollections
} = require ('../helpers')


const router = Router();

router.post('/',[
    validateFiles
],loadFiles)

router.put('/:collection/:id',[
    check('id','La id es obligatoria').not().isEmpty(),
    check('id','La id no es válida').isMongoId(),
    check('collection','La colección es obligatoria').not().isEmpty(),
    check('collection').custom( c => allowedCollections(c,['users','products']) ),
    validateFiles,
    validarCampos
],
    uploadFiles           // Subir la imagen al propio servidor
    //uploadFiles_cloudinary  // Subir la imagen en un servidor distinto (cloudinary)
)

// ESTA FUNCIÓN SOLO DEVOLVERÁ LAS IMÁGENES SUBIDAS EN LOCAL (activar la función uploadFiles de arriba y comentar la ..._cloudinary)
router.get('/:collection/:id',[
    check('id','La id es obligatoria').not().isEmpty(),
    check('id','La id no es válida').isMongoId(),
    check('collection','La colección es obligatoria').not().isEmpty(),
    check('collection').custom( c => allowedCollections(c,['users','products']) ),
    validarCampos
],
    showFiles              // Mostrar la imagen subida al propio servidor
)


module.exports = router;
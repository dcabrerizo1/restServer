const { Router } = require('express');
const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validRole, validEmail, validId } = require('../helpers/db-validators');

// Importar middlewares unificados
const {
    validateJWT, adminRole, haveRole, validarCampos
} = require('../middlewares')
//const { validateJWT } = require('../middlewares/validacion_jwt');
//const { adminRole, haveRole } = require('../middlewares/validacion-roles');
//const { validarCampos } = require('../middlewares/validacion-campos');

const router = Router();


/*
router.get('/', (req, res) => {
    // Status de error
    res.status(403).json({
        msg: 'get API'
    })
})
*/

router.get('/', usuariosGet)

// Recibir POST
router.post('/', [
    // Comprobar que el campo está rellenado
    check('name','El nombre és obligatorio').not().isEmpty(),
    // Comprobar que el email cumple con el formato
    check('mail','El email no es válido').isEmail(),
    // Comprobar que no existe el email
    check('mail').custom(validEmail),
    // Establecer un mínimo de carácteres para la password
    check('pass','La contraseña debe tener un mínimo de 6 carácteres').isLength( {min: 6} ),
    // Comprobar si el rol es válido
    check('role').custom(validRole), // check('role','El rol no es válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    // Comprobar los check lanzados
    validarCampos
], usuariosPost )

// Recibir PUT
router.put('/:id',[
    // Comprobar si la ID es válida
    check('id','No es un ID válido').isMongoId(),
    // Comprobar si la ID ya ha sido registrada
    check('id').custom(validId),
    // Comprobar si el rol es válido
    check('role').custom(validRole),
    // Comprobar los check lanzados
    validarCampos
], usuariosPut )

router.patch('/',usuariosPatch )

router.delete('/:id',[
    // Comprovar token
    validateJWT, 
    // Comprovar rol del usuario que llama la acción (token)
    //adminRole,
    // Comprovar si el usuario tiene uno de los roles requeridos
    haveRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    // Comprobar si la ID es válida
    check('id','No es un ID válido').isMongoId(),
    // Comprobar si la ID ya ha sido registrada
    check('id').custom(validId),
    // Comprobar los check lanzados
    validarCampos
], usuariosDelete )






module.exports = router;
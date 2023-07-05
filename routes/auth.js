const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validacion-campos');

const router = Router();

router.post('/login',[
    check('mail','El correo es obligatorio').not().isEmpty(),
    check('mail','El correo no es válido').isEmail(),
    check('pass','La contraseña es obligatoria').not().isEmpty(),
    // Comprobar los check lanzados
    validarCampos
], login)

router.post('/google',[
    check('id_token','El id_token es necesario').not().isEmpty(),
    // Comprobar los check lanzados
    validarCampos
], googleSignin)






module.exports = router;
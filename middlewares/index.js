const validarJWT = require('../middlewares/validacion_jwt');
const validarRoles = require('../middlewares/validacion-roles');
const validarCampos = require('../middlewares/validacion-campos');

module.exports = {
    ...validarJWT,
    ...validarRoles,
    ...validarCampos
}
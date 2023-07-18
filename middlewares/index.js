const validarJWT = require('../middlewares/validacion_jwt');
const validarRoles = require('../middlewares/validacion-roles');
const validarCampos = require('../middlewares/validacion-campos');
const validateFiles = require('../middlewares/validate-files');

module.exports = {
    ...validarJWT,
    ...validarRoles,
    ...validarCampos,
    ...validateFiles
}
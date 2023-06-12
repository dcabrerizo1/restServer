


const { Router } = require('express');
const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/usuarios');

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


router.post('/',usuariosPost )

router.put('/:id',usuariosPut )

router.patch('/',usuariosPatch )

router.delete('/:id',usuariosDelete )






module.exports = router;
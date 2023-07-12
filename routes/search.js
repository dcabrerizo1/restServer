const { Router } = require('express');
const {
    search
} = require('../controllers/search')

const router = Router();

// {{url}}/api/search

// Crear producto - privado - requiere token
router.get('/:collection/:term',search)

module.exports = router;
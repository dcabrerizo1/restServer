const { response } = require('express')


const validateFiles = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file_upload) {
        return res.status(400).json({
            msg:'No se ha enviado ningún archivo.'
        });
    }

    next();
}


module.exports = {
    validateFiles
}
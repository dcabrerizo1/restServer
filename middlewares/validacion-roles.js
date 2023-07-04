const { response } = require("express")


const adminRole = (req, res = response, next) => {

    if(!req.user_uid){
        return res.status(500).json({
            msg: 'Error de validación de rol - El token aún no se ha validado'
        })
    }

    const { role, name } = req.user_uid;
    
    if(role != 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `El usuario ${name} no es administrador - No puede realizar la acción`
        })
    }

    next()
}

const haveRole = (...roles) => {
    
    return (req, res = response, next) => {

        if(!req.user_uid){
            return res.status(500).json({
                msg: 'Error de validación de rol - El token aún no se ha validado'
            })
        }

        if(!roles.includes(req.user_uid.role)){
            return res.status(401).json({
                msg: `El servicio requiere uno de los siguientes roles: ${roles}`
            })
        }

        next();
    }
}





module.exports = {
    adminRole, haveRole
}
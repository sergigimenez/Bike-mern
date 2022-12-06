const { response } = require('express');
const jwt = require('jsonwebtoken')

const validarJWT = (req, res = response, next) => {

    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        })
    }

    try {

        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        )

        req.uid = payload.uid
        req.name = payload.name
        
    } catch (e) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }


    next();
}

const validarJWTByUser = (req, res = response, user) => {

    const token = req.header('x-token')

    if (!token) {
        return {
            code: 401,
            msg: 'No hay token en la peticion'
        }
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        )

        req.uid = payload.uid
        req.name = payload.name
        
        if(user._id.toString() != payload.uid){
            return {
                code: 401,
                msg: 'No tienes permisos para realizar esta accion'
            }
        }

        return {
            code: 200,
            msg: ''
        }
    } catch (e) {
        return {
            code: 401,
            msg: 'Token no valido'
        }
    }
}

module.exports = {
    validarJWT,
    validarJWTByUser
}
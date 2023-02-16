const { response } = require('express');
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario');
const usuarioModel = require('../models/Usuario')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {
    const { email, password, repeatEmail, repeatPassword } = req.body

    try {
        if (email != repeatEmail || password != repeatPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El email o la contraseña no coinciden'
            })
        }

        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese email'
            })
        }

        usuario = new usuarioModel(req.body)
        //encriptar pass
        const salt = bcrypt.genSaltSync()
        usuario.password = bcrypt.hashSync(password, salt)
        //encriptar pass

        await usuario.save(); // save en BD

        const token = await generarJWT(usuario.id, usuario.name)

        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            cards: [],
            cardsLiked: [],
            token
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

const loginUsuario = async (req, res = response) => {
    const { email, password } = req.body

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe el usuario con ese mail'
            })
        }

        //comparar password
        const validPassword = bcrypt.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'password incorrecto'
            })
        }
        //comparar password

        //generar JWT
        const token = await generarJWT(usuario.id, usuario.name)
        //generar JWT

        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            email: usuario.email,
            cards: usuario.cards,
            cardsLiked: usuario.cardsLiked,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

const loginUserWhithGoogle = async (req, res = response) => {
    const { email, name, uid} = req.body

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            newUsuario = new usuarioModel({ email, name, uid, password: "newPassRandom" })
            //encriptar pass
            const salt = bcrypt.genSaltSync()
            newUsuario.password = bcrypt.hashSync(password, salt)
            //encriptar pass

            await newUsuario.save(); // save en BD

            const token = await generarJWT(newUsuario.uid, newUsuario.name)

            res.status(200).json({
                ok: true,
                uid: newUsuario.uid,
                name: newUsuario.name,
                cards: [],
                cardsLiked: [],
                token
            })
        } else {
            //generar JWT
            const token = await generarJWT(usuario.id, usuario.name)
            //generar JWT

            res.status(200).json({
                ok: true,
                uid: usuario.id,
                name: usuario.name,
                email: usuario.email,
                cards: usuario.cards,
                cardsLiked: usuario.cardsLiked,
                token
            })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

const loginUserWhithFacebook = async (req, res = response) => {
    const {name, uid, password = "newPassRandom" } = req.body

    try {
        const usuario = await Usuario.findOne({ uidFacebook: uid });

        console.log(usuario)

        if (!usuario) {
            newUsuario = new usuarioModel({ email: "email@facebook.com", name, uidFacebook: uid, password: "newPassRandom" })
            //encriptar pass
            const salt = bcrypt.genSaltSync()
            newUsuario.password = bcrypt.hashSync(password, salt)
            //encriptar pass

            await newUsuario.save(); // save en BD

            const token = await generarJWT(newUsuario.uid, newUsuario.name)

            res.status(200).json({
                ok: true,
                uid: newUsuario.uid,
                name: newUsuario.name,
                cards: [],
                cardsLiked: [],
                token
            })
        } else {
            //generar JWT
            const token = await generarJWT(usuario.id, usuario.name)
            //generar JWT

            res.status(200).json({
                ok: true,
                uid: usuario.id,
                name: usuario.name,
                email: usuario.email,
                cards: usuario.cards,
                cardsLiked: usuario.cardsLiked,
                token
            })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

const revalidarToken = async (req, res) => {

    const { uid, name } = req

    const usuario = await Usuario.findOne({ uid });

    //generar JWT
    const token = await generarJWT(uid, name)
    //generar JWT

    res.json({
        ok: true,
        uid, name,
        email: usuario.email,
        cards: usuario.cards,
        cardsLiked: usuario.cardsLiked,
        msg: 'renew',
        token,
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    loginUserWhithGoogle,
    loginUserWhithFacebook,
    revalidarToken
}
const { response } = require('express');
const { logError } = require('../middlewares/erros');
const {validarJWTByUser } = require('../middlewares/validar-jwt');
const Card = require('../models/Card');
const Usuario = require('../models/Usuario');

const getCards = async (req, res = response) => {
    const cards = await Card.find()

    res.status(200).json({
        ok: true,
        msg: cards
    })
}

const addCard = async (req, res = response) => {
    const card = new Card(req.body)

    const cardId = await Card.find().sort({_id:-1}).limit(1)
    cardId.length == 0 ? card.id = 0 : card.id = cardId[0].id+1;

    try {
        let error = card.validateSync();

        if (typeof error?.errors != 'undefined') {

            const errors = error?.errors

            for (err in errors) {
                if(errors[err].properties.type == "required"){
                    throw new Error(`El objeto ${err} es obligatorio`)
                }else{
                    throw new Error("error: " + err)
                }
            }
        } else {
            if(await (await Card.find({titleCard: card.titleCard}).exec()).length != 0){
                throw new Error("La carrera ya existe!")
            }

            await card.save()

            res.status(200).json({
                state: 'addCard',
                status: true,
                payload: card
            })
        }


    } catch (e) {
        logError(req, res, e, "addCard")
    }
}

const getCardsByUser = async (req, res = response) => {

    const {email, cards} = req.body

    try{
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe el usuario con ese mail'
            })
        }

        let resp = validarJWTByUser(req, res, usuario)
        if(resp.code == 401){
            throw new Error(resp.msg)
        }

        let usuarioCards = usuario.cards

        res.status(200).json({
            ok: true,
            usuarioCards
        })
    }catch(e){
        logError(req, res, e, "getCardsByUser")
    }
}

const followCardByUser = async(req, res = response) => {
    const {email, cards} = req.body

    try{
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe el usuario con ese mail'
            })
        }

        let resp = validarJWTByUser(req, res, usuario)
        if(resp.code == 401){
            throw new Error(resp.msg)
        }
    

       let cardExist = await (await Card.find({id: {$in: cards}})).map(e => e.id)

        let newCards = cards.concat(usuario.cards)
        newCards = [...new Set([...cardExist, ...usuario.cards])]

        const userUpdated = await Usuario.findByIdAndUpdate(usuario._id, {cards: newCards}, { new: true })

        res.status(200).json({
            ok: true,
            userUpdated
        })
    }catch(e){
        logError(req, res, e, "followCardByUser")
    }
}

const unfollowCardByUser = async(req, res = response) => {
    const {email, cards} = req.body

    try{
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe el usuario con ese mail'
            })
        }

        let resp = validarJWTByUser(req, res, usuario)
        if(resp.code == 401){
            throw new Error(resp.msg)
        }
    
        let usuarioCards = usuario.cards

        await (await Card.find({id: {$in: cards}}))
            .map(e => e.id)
            .forEach(e => {
                usuarioCards = usuarioCards.filter(e1 => e1 !== e)
            })

        newCards = [...new Set(usuarioCards)];

        const userUpdated = await Usuario.findByIdAndUpdate(usuario._id, {cards: newCards}, { new: true })

        res.status(200).json({
            ok: true,
            userUpdated
        })
    }catch(e){
        logError(req, res, e, "unfollowCardByUser")
    }
}

module.exports = { addCard, getCards, getCardsByUser, followCardByUser, unfollowCardByUser }

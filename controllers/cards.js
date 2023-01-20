const { response } = require('express');
const { logError } = require('../middlewares/erros');
const {validarJWTByUser } = require('../middlewares/validar-jwt');
const {genRandonID} = require('../middlewares/utils')

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

    card.id = genRandonID(8)

    try {
        let error = card.validateSync();

        if (typeof error?.errors != 'undefined') {
            const errors = error?.errors

            for (err in errors) {
                if(errors[err].properties.type == "required"){
                    throw new Error(`El objeto ${err} es obligatorio`)
                }else{
                    throw new Error("error : " + err)
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

    const {uid, email, cards} = req.body

    try{
        const usuario = await Usuario.findOne({ uid });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe el usuario con ese uid'
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
    const {uid, email, cards} = req.body

    try{
        const usuario = await Usuario.findOne({ uid });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe el usuario con ese uid'
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
    const {uid, email, cards} = req.body

    try{
        const usuario = await Usuario.findOne({ uid });

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

const searchCard = async(req, res = response) => {
    try{
        const {params} = req.body
        const {query} = req.params

        let result = ""

        switch(`${query}`){
            case "titleCard":
                result = await Card.find({"titleCard" : { $regex: params, $options: "i" } });
                break; 
            case "Distancia":
                result = await Card.find({"info.Distancia" : { $regex: params, $options: "i" } });
                break;
            case "Desnivel":
                result = await Card.find({"info.Desnivel" : { $regex: params, $options: "i" } });
                break;
            case "Fecha":
                result = await Card.find({"info.Fecha" : { $regex: params, $options: "i" } });
                break;
            case "Poblacion":
                result = await Card.find({"info.Poblacion" : { $regex: params, $options: "i" } });
                break;
            case "Provincia":
                result = await Card.find({"info.Provincia" : { $regex: params, $options: "i" } });
                break;
            default:
                result = await Card.find({$or : [
                    {"titleCard" : { $regex: params, $options: "i" } },
                    {"info.Distancia" : { $regex: params, $options: "i" } },
                    {"info.Desnivel" : { $regex: params, $options: "i" } },
                    {"info.Fecha" : { $regex: params, $options: "i" } },
                    {"info.Poblacion" : { $regex: params, $options: "i" } },
                    {"info.Provincia" : { $regex: params, $options: "i" } }
                ]});
                break;
        }


        res.status(200).json({
            ok: true,
            resp: result,
            param: params
        })
    }catch(e){
        logError(req, res, e, "searchCard")
    }
}

module.exports = { addCard, getCards, getCardsByUser, followCardByUser, unfollowCardByUser, searchCard }

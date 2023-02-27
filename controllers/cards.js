const { response } = require('express');
const { logError } = require('../middlewares/erros');
const { validarJWTByUser } = require('../middlewares/validar-jwt');
const { genRandonID } = require('../middlewares/utils')

const Card = require('../models/Card');
const Usuario = require('../models/Usuario');
const Provincias = require('../models/Provincias');
const Poblaciones = require('../models/Poblaciones');

const getCards = async (req, res = response) => {

    const { num } = req.params

    const cards = await Card.find().skip(parseInt(num)).limit(25)

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
                if (errors[err].properties.type == "required") {
                    throw new Error(`El objeto ${err} es obligatorio`)
                } else {
                    throw new Error("error : " + err)
                }
            }
        } else {
            if (await (await Card.find({ titleCard: card.titleCard }).exec()).length != 0) {
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
        console.log(e)
        logError(req, res, e, "addCard")
    }
}

const updateImage = async (req, res = response) => {
    try {
        const { cardId, newImage } = req.body

        const card = await Card.find({ id: cardId });

        if (!card) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe esa ruta'
            })
        }

        const updateCard = await Card.findOneAndUpdate({ id: cardId }, { img: newImage }, { new: true })

        res.status(200).json({
            ok: true,
            msg: "upload",
            cardId,
            cardImg: updateCard.img
        })
    } catch (e) {
        logError(req, res, e, "updateImage")
    }
}

const getCardsByUser = async (req, res = response) => {

    const { uid } = req.body

    try {
        const usuario = await Usuario.findById(uid)

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe el usuario con ese uid'
            })
        }

        res.status(200).json({
            ok: true,
            usuarioCards: usuario.cards,
            cardsLiked: usuario.cardsLiked
        })
    } catch (e) {
        logError(req, res, e, "getCardsByUser")
    }
}

/*3 peticiones a la BD */
const followCardByUser = async (req, res = response) => {
    const { uid, email, cards } = req.body

    try {
        const usuario = await Usuario.findById(uid)

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe el usuario con ese uid'
            })
        }


        //let cardExist = await (await Card.find({ id: { $in: cards } })).map(e => e.id)

        let cardExist = await (await Card.find({ id: { $in: cards } })).map(e => {return {"id": e.id, "title": e.titleCard, "date": e.info.Fecha}})

        if(!!!usuario.cards.find(uc => {return uc.id == cardExist[0]?.id})){
            let newCards = cards.concat(usuario.cards)
            newCards = [...new Set([...cardExist, ...usuario.cards])]
    
            const userUpdated = await Usuario.findByIdAndUpdate(usuario._id, { cards: newCards }, { new: true })
    
            return res.status(200).json({
                ok: true,
                userUpdated
            })
        }

        return res.status(200).json({
            ok: true,
            msg: "el usuario ya seguia esta carrera"
        })
    } catch (e) {
        logError(req, res, e, "followCardByUser")
    }
}

/*3 peticiones a la BD */
const unfollowCardByUser = async (req, res = response) => {
    const { uid, email, cards } = req.body

    try {
        const usuario = await Usuario.findById(uid)

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe el usuario con ese mail'
            })
        }

        let usuarioCards = usuario.cards

        await (await Card.find({ id: { $in: cards } }))
            .map(e => e.id)
            .forEach(e => {
                usuarioCards = usuarioCards.filter(e1 => e1.id !== e)
                //usuarioCards = usuarioCards.filter(e1 => e1 !== e)
            })

        newCards = [...new Set(usuarioCards)];

        const userUpdated = await Usuario.findByIdAndUpdate(usuario._id, { cards: newCards }, { new: true })

        res.status(200).json({
            ok: true,
            userUpdated
        })
    } catch (e) {
        logError(req, res, e, "unfollowCardByUser")
    }
}

/*4 peticiones a la BD */
const likeCardByUser = async (req, res = response) => {
    const { uid, cardId } = req.body

    try {
        const usuario = await Usuario.findById(uid)

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe el usuario con ese mail'
            })
        }

        const card = await Card.find({ id: cardId });

        if (!card) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe esa ruta'
            })
        }

        if (usuario.cardsLiked.includes(cardId)) {
            let cardsLiked = usuario.cardsLiked.filter(c => c !== cardId)

            await Usuario.findOneAndUpdate({ _id: uid, cardsLiked: cardsLiked })
            const card = await Card.findOneAndUpdate({ id: cardId }, { $inc: { "stateComents.likes": -1 } }, { new: true })

            res.status(200).json({
                ok: true,
                msg: "dislike",
                totalLikes: card.stateComents.likes
            })

        } else {
            let cardsLiked = [...new Set([cardId, ...usuario.cardsLiked])]

            await Usuario.findOneAndUpdate({ _id: uid, cardsLiked: cardsLiked })
            const card = await Card.findOneAndUpdate({ id: cardId }, { $inc: { "stateComents.likes": 1 } }, { new: true })

            res.status(200).json({
                ok: true,
                msg: "like",
                totalLikes: card.stateComents.likes
            })
        }
    } catch (e) {
        logError(req, res, e, "likeCardByUser")
    }
}

const commentCardByUser = async (req, res = response) => {
    const { uid, cardId, comment } = req.body
    try {
        const usuario = await Usuario.findById(uid)

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe el usuario con ese mail'
            })
        }

        const genRandomIdComment = genRandonID(14)

        const card = await Card.findOneAndUpdate({ id: cardId },
            {
                $inc: {
                    "stateComents.comentarios": 1
                },
                $push: {
                    comments: {
                        "id": genRandomIdComment,
                        "uid": uid,
                        "userComent": comment.userComent,
                        "textComent": comment.textComent,
                        "dateComent": comment.dateComent
                    }
                }
            },
            { new: true })

        if (!card) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe esa ruta'
            })
        }

        res.status(200).json({
            ok: true,
            "comentario": {
                "id": genRandomIdComment,
                "uid": uid,
                "userComent": usuario.name,
                "textComent": comment.textComent,
                "dateComent": comment.dateComent
            },
            "totalComentario": card.stateComents.comentarios,
            msg: "addNewComment"
        })

    } catch (e) {
        logError(req, res, e, "commentCardByUser")
    }
}

const updateCommentCardByUser = async (req, res = response) => {
    const { uid, comment } = req.body
    try {
        const usuario = await Usuario.findById(uid)

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe el usuario con ese mail'
            })
        }

        const commentUpdate = await Card.findOneAndUpdate(
            { "comments.id": comment.id },
            { "comments.$.textComent": comment.textComent },
            { new: true }
        );

        if (!commentUpdate) {
            return res.status(400).json({
                ok: false,
                id: comment.id,
                msg: 'no existe ese comentario'
            })
        }

        res.status(200).json({
            ok: true,
            commentUpdate,
            msg: "addNewComment"
        })

    } catch (e) {
        logError(req, res, e, "commentCardByUser")
    }
}

const deleteCommentCardByUser = async (req, res = response) => {
    const { uid, comment } = req.body
    try {
        const usuario = await Usuario.findById(uid)

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe el usuario con ese mail'
            })
        }

        const commentUpdate = await Card.findOneAndUpdate(
            { "comments.id": comment.id },
            {
                $inc: {
                    "stateComents.comentarios": -1
                },
                $pull: { comments: { "id": comment.id } }
            },
            { new: true }
        ).then((obj, err) => {
            if (!!err) {
                throw new Error("error : " + err)
            }

            if (obj == null) {
                return res.status(400).json({
                    ok: true,
                    msg: 'no existe ese comentario'
                })
            } else {
                res.status(200).json({
                    ok: true,
                    uid,
                    "commentarioID": comment.id,
                    totalComentario: obj.stateComents.comentarios,
                    msg: "deleteComment"
                })
            }
        })
    } catch (e) {
        logError(req, res, e, "deleteCommentCardByUser")
    }
}

const searchCard = async (req, res = response) => {
    try {
        const { params } = req.body
        const { num } = req.params

        let result = ""
        let query = {}

        if (params.provincias.length > 0) {
            query["info.Provincia"] = { $in: params.provincias }
        }

        if (params.poblacion.length > 0) {
            query["info.Poblacion"] = { $in: params.poblacion }
        }

        if (params.titleCard != null) {
            query.titleCard = { $regex: params.titleCard, $options: "i" }
        }

        if (params.fecha != null) {
            query["info.Fecha"] = { $gte: params.fecha.toLocaleString() }
        }

        if (params.distancia != null) {
            if (params.distancia.lte != null) {
                query["info.Distancia"] = { $elemMatch: { $lte: params.distancia.lte } }
            }
            if (params.distancia.gte != null) {
                query["info.Distancia"] = { $elemMatch: { $gte: params.distancia.gte } }
            }
            if (params.distancia.gte != null && params.distancia.lte != null) {
                query["info.Distancia"] = { $elemMatch: { $gte: params.distancia.gte, $lte: params.distancia.lte } }
            }
        }

        if (params.desnivel != null) {
            if (params.desnivel.lte != null) {
                query["info.Desnivel"] = { $elemMatch: { $lte: params.desnivel.lte } }
            }
            if (params.desnivel.gte != null) {
                query["info.Desnivel"] = { $elemMatch: { $gte: params.desnivel.gte } }
            }
            if (params.desnivel.gte != null && params.desnivel.lte != null) {
                query["info.Desnivel"] = { $elemMatch: { $gte: params.desnivel.gte, $lte: params.desnivel.lte } }
            }
        }

        result = await Card.find(query).skip(parseInt(num)).limit(25)
        totalResults = await Card.countDocuments(query)

        res.status(200).json({
            ok: true,
            query,
            resp: result,
            totalResults
        })
    } catch (e) {
        logError(req, res, e, "searchCard")
    }
}

const getProvincias = async (req, res = response) => {
    try {
        result = await Provincias.find();

        res.status(200).json({
            ok: true,
            resp: result
        })
    } catch (e) {
        logError(req, res, e, "getProvincias")
    }
}

const getPoblaciones = async (req, res = response) => {
    try {
        result = await Poblaciones.find();

        res.status(200).json({
            ok: true,
            resp: result
        })
    } catch (e) {
        logError(req, res, e, "getPoblaciones")
    }
}

const getTitleCard = async (req, res = response) => {
    try {

        result = await Card.find({ titleCard: { $ne: "" } }, { titleCard: 1 });

        res.status(200).json({
            ok: true,
            resp: result
        })
    } catch (e) {
        logError(req, res, e, "getTitleCard")
    }
}

const cardUpdateRSS = async (req, res = response) => {
    const { uid, web } = req.body
    try {
        const usuario = await Usuario.findById(uid)

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'no existe el usuario con ese mail'
            })
        }

        const rssUpdated = await Card.findOneAndUpdate(
            { "info.Web": web.url },
            {
                "info.Facebook": web.facebook,
                "info.Instagram": web.instagram,
                "info.Twitter": web.twitter,
                "info.Youtube": web.youtube
            },
            { new: true }
        );

        if (!rssUpdated) {
            return res.status(400).json({
                ok: false,
                id: comment.id,
                msg: 'esta carrera no tiene web o no existe'
            })
        }

        res.status(200).json({
            ok: true,
            rssUpdated,
            msg: "updateRSS"
        })

    } catch (e) {
        logError(req, res, e, "updateRSS")
    }
}

module.exports = {
    addCard, updateImage, getCards, getCardsByUser, followCardByUser,
    unfollowCardByUser, likeCardByUser, commentCardByUser, searchCard,
    getProvincias, getPoblaciones, getTitleCard, updateCommentCardByUser,
    deleteCommentCardByUser, cardUpdateRSS
}

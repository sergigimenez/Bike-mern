/*
    Rutas de Usuarios / Auth
    host + /api/auth
 */

const { Router } = require('express');
const router = Router();

const { validarJWT } = require('../middlewares/validar-jwt');
const { addCard, updateImage, getCards, getCardsByUser, followCardByUser, likeCardByUser,
    unfollowCardByUser, commentCardByUser, updateCommentCardByUser, deleteCommentCardByUser, searchCard, getProvincias, getTitleCard,
    getPoblaciones, cardUpdateRSS } = require('../controllers/cards')

router.use(validarJWT)

router.post('/', addCard)
router.get('/num/:num', getCards)

router.get('/user', getCardsByUser)

router.post('/uploadImage', updateImage)
router.post('/follow', followCardByUser)
router.post('/unfollow', unfollowCardByUser)
router.post('/like', likeCardByUser)

router.post('/comment', commentCardByUser)
router.put('/comment', updateCommentCardByUser)
router.delete('/comment', deleteCommentCardByUser)

router.post('/search/:num', searchCard)
router.get('/provincias', getProvincias)
router.get('/poblaciones', getPoblaciones)
router.get('/titleCard', getTitleCard)

router.put('/update/rss', cardUpdateRSS)

module.exports = router
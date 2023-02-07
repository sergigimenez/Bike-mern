/*
    Rutas de Usuarios / Auth
    host + /api/auth
 */

const { Router } = require('express');
const router = Router();

const { validarJWT } = require('../middlewares/validar-jwt');
const { addCard, getCards, getCardsByUser, followCardByUser, likeCardByUser,
    unfollowCardByUser, searchCard, getProvincias, getTitleCard,
    getPoblaciones} = require('../controllers/cards')

router.use(validarJWT)

router.post('/', addCard)
router.get('/num/:num', getCards)

router.get('/user', getCardsByUser)

router.post('/follow', followCardByUser)
router.post('/unfollow', unfollowCardByUser)
router.post('/like', likeCardByUser)


router.post('/search/:num', searchCard)
router.get('/provincias', getProvincias)
router.get('/poblaciones', getPoblaciones)
router.get('/titleCard', getTitleCard)

module.exports = router
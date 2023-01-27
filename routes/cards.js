/*
    Rutas de Usuarios / Auth
    host + /api/auth
 */

const { Router } = require('express');
const router = Router();

const { validarJWT } = require('../middlewares/validar-jwt');
const { addCard, getCards, getCardsByUser, followCardByUser, 
    unfollowCardByUser, searchCard, getProvincias, getTitleCard} = require('../controllers/cards')

router.use(validarJWT)

router.post('/', addCard)
router.get('/num/:num', getCards)

router.get('/user', getCardsByUser)

router.post('/follow', followCardByUser)
router.post('/unfollow', unfollowCardByUser)

router.post('/search/:num', searchCard)
router.get('/provincias', getProvincias)
router.get('/titleCard', getTitleCard)

module.exports = router
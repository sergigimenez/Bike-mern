/*
    Rutas de Usuarios / Auth
    host + /api/auth
 */

const { Router } = require('express');
const router = Router();

const { validarJWT } = require('../middlewares/validar-jwt');
const { addCard, getCards, getCardsByUser, followCardByUser, unfollowCardByUser } = require('../controllers/cards')

router.use(validarJWT)

router.post('/', addCard)
router.get('/', getCards)

router.get('/user', getCardsByUser)

router.post('/follow', followCardByUser)
router.post('/unfollow', unfollowCardByUser)

module.exports = router
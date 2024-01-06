/*
    Rutas de Usuarios / Brad
    host + /api/gpt4
 */

    const { Router } = require('express');
    const router = Router();

    const { validarJWT } = require('../middlewares/validar-jwt');
    const { resumeText } = require('../controllers/gpt4');

    router.use(validarJWT)

    router.get('/resumeText', resumeText)

    module.exports = router
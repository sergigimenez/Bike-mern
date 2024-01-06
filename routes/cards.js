/*
    Rutas de Usuarios / Auth
    host + /api/auth
 */

const { Router } = require("express");
const router = Router();

//TOKEN DE USUARIO
//const { validarJWT } = require('../middlewares/validar-jwt');
const {
  addCard,
  updateImage,
  getCards,
  getCardByHash,
  getAllCards,
  getCardsByUser,
  followCardByUser,
  likeCardByUser,
  unfollowCardByUser,
  commentCardByUser,
  updateCommentCardByUser,
  deleteCommentCardByUser,
  searchCard,
  getProvincias,
  getTitleCard,
  getPoblaciones,
  cardUpdateRSS,
  cardUpdateNameURL,
} = require("../controllers/cards");

//router.use(validarJWT)

router.post("/", addCard);
router.get("/num/:num", getCards);
router.get("/id/:id", getCardByHash);
router.get("/all", getAllCards);

router.post("/user", getCardsByUser);

router.post("/uploadImage", updateImage);
router.post("/follow", followCardByUser);
router.post("/unfollow", unfollowCardByUser);
router.post("/like", likeCardByUser);

router.post("/comment", commentCardByUser);
router.put("/comment", updateCommentCardByUser);
router.delete("/comment", deleteCommentCardByUser);

router.post("/search/:num", searchCard);
router.get("/provincias", getProvincias);
router.get("/poblaciones", getPoblaciones);
router.get("/titleCard", getTitleCard);

router.put("/update/rss", cardUpdateRSS);
router.put("/update/nameURL", cardUpdateNameURL);

module.exports = router;

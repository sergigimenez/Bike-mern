const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    uidFacebook: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cards: {
        type: Array
    },
    cardsLiked: {
        type: Array
    }
});


module.exports = model('Usuario', UsuarioSchema );

const { Schema, model } = require('mongoose')
const { object } = require('prop-types')

const CardSchema = Schema({
    id: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    titleCard: {
        type: String,
        required: true
    },
    info: {
        type: {
            distancia: {
                type: Number,
                required: true
            },
            desnivel: {
                type: Number,
                required: true
            },
            fecha: {
                type: String,
                required: true
            },
            precio: {
                type: Number,
                required: true
            },
            etapas: {
                type: Number,
                required: true
            },
        },
        required: true
    },
    stateComents: {
        type: {
            likes: {
                type: Number,
                required: true
            },
            comentarios: {
                type: Number,
                required: true
            }
        },
        required: true
    },
    comments: {
        type: Array
    }
})

module.exports = model('Card', CardSchema)
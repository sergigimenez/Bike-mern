const { Schema, model } = require("mongoose");

const CardSchema = Schema({
  id: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  titleCard: {
    type: String,
    required: true,
  },
  nameURL: {
    type: String,
  },
  info: {
    type: {
      Distancia: {
        type: Array,
      },
      Desnivel: {
        type: Array,
      },
      Fecha: {
        type: Date,
      },
      Fecha_fin: {
        type: Date,
      },
      Fecha_confirmada: {
        type: String,
      },
      Poblacion: {
        type: String,
        required: true,
      },
      Provincia: {
        type: String,
        required: true,
      },
      Precio: {
        type: Number,
        required: true,
      },
      Etapas: {
        type: Number, //TODO AÑADIR ETAPAS EN EL FORMULARIO
      },
      Facebook: {
        type: String,
      },
      Instagram: {
        type: String,
      },
      Twitter: {
        type: String,
      },
      Youtube: {
        type: String,
      },
      Web: {
        type: String,
      },
    },
    required: true,
  },
  stateComents: {
    type: {
      likes: {
        type: Number,
        required: true,
      },
      comentarios: {
        type: Number,
        required: true,
      },
    },
    required: true,
  },
  comments: {
    type: Array,
  },
});

module.exports = model("Card", CardSchema);

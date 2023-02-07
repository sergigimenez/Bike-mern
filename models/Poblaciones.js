const { Schema, model } = require('mongoose');

const ProvinciasSchema = Schema({
    poblacion: {
        type: String,
        required: true
    },
    provincia: {
        type: String,
        required: true,
    }
});


module.exports = model('Poblaciones', ProvinciasSchema );

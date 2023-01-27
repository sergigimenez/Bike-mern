const { Schema, model } = require('mongoose');

const ProvinciasSchema = Schema({
    sigla: {
        type: String,
        required: true
    },
    provincia: {
        type: String,
        required: true,
    }
});


module.exports = model('Provincias', ProvinciasSchema );

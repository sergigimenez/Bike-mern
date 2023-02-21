const mongoose = require('mongoose')
require('dotenv').config()

const dbConnection = async () => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect( process.env.DB_CNN , {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            maxIdleTimeMS: 500000
            //useCreateIndex: true
        });
        
        console.log('DB online')
    } catch (e) {
        console.log(e)
        throw new Error(`Error a la hora de inicializar la BD`)
    }
}

module.exports = {dbConnection}
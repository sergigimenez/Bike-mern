const express = require('express')
require('dotenv').config()
const cors = require('cors')

const {dbConnection} = require('./database/config')
const app = express()

dbConnection();

app.use(cors())

app.use(express.static('public'))
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/cards', require('./routes/cards'))
app.use('/api/gpt4', require('./routes/gpt4'))

app.listen(process.env.PORT, () => {
    console.log(`Servidor en puerto: ${process.env.PORT}`)
})
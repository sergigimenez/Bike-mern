const { response } = require('express');

const logError = async (req, res = response, err, method) => {
    const debug = req.header('x-debug')

    debug == 1
        ? res.status(500).json({
            method: method,
            status: false,
            error: err.message,
        })
        : res.status(500).json({
            state: method,
            status: false,
            error: 'hable con el administrador'
        })
}

module.exports = {logError}
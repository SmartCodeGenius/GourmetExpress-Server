const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async(req, res, next) => {
    try {
        
        const jwtToken = req.header('token');

        // console.log('Token: ',jwtToken);

        if(!jwtToken) {
            return res.status(403).json('Não autorizado, sem Token');
        }

        const payload = jwt.verify(jwtToken, process.env.jwtSecret);

        req.usuario = payload.usuario;
        // console.log('id do Usuario: ', req.usuario);

        next();

    } catch (err) {
        console.error(err.message);
        return res.status(403).json('Não autorizado');
    }
}
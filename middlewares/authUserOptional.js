const jwt = require('jsonwebtoken');

const generateError = require('../helpers');

const authUserOptional = async (req, res, next) => {
    try {
        // Obtenemos el token de la cabecera.
        const { authorization } = req.headers;

        // Si hay token....
        if (authorization) {
            // Variable que contendrá la información del token
            let payload;

            try {
                payload = jwt.verify(authorization, process.env.SECRET);
            } catch {
                throw generateError('Incorrect token', 401);
            }

            // Agregamos una nueva propiedad.
            req.user = payload;
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = authUserOptional;

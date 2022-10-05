const jwt = require('jsonwebtoken');

const selectUserByIdQuery = require('../db/userQueries/selectUserByIdQuery');

const { generateError } = require('../helpers');

const authUser = async (req, res, next) => {
    try {
        // Obetenemos el token de la cabecera.
        const { authorization } = req.headers;
        // Si no hay token lanzamos un error.

        if (!authorization) {
            throw generateError('Authorization header is missing', 401);
        }

        let payload;

        try {
            // intentamos obtener la informacion del token.
            payload = jwt.verify(authorization, process.env.SECRET);
        } catch {
            throw generateError('Incorrect token', 401);
        }

        // Comprobamos que el usuario esté activado
        const user = await selectUserByIdQuery(payload.id);

        // Si el usuario no está activado, lanzamos un error.
        if (!user.active) {
            throw generateError('User is not active', 401);
        }

        // Agregamos una nueva propiedad al objeto con la info del payload.
        req.user = payload;

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = authUser;

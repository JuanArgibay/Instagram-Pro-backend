const { verifyEmail, validateSchema } = require("../../helpers");
const insertUserQuery = require("../../db/userQueries/insertUserQuery");
const { v4: uuid } = require('uuid');
const newUserSchema = require ('../../schemas/newUserSchema')


const newUser = async (req, res, next) => {

    try {
        
        const { username, password, email} = req.body;
        
        // Validamos los datos del body con joi
        await validateSchema(newUserSchema, req.body)

        // Generamos un código de registro
        const registrationCode = uuid();

        // Enviamos un email de verificación
        await verifyEmail(email, registrationCode);

        // Insertamos el usuario
        await insertUserQuery(username, password, email, registrationCode);

        res.send({
            status: 'ok',
            message: 'User created',
        });

    } catch (err) {
        next(err);
    }
}


module.exports = newUser;


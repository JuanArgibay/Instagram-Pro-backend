const { generateError } = require("../../helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const selectUserByEmailQuery = require("../../db/userQueries/selectUserByEmailQuery");

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            throw generateError('Missing fields', 400);
        }

        // Obtenemos al susuario con el email que viene en el body.
        const user = await selectUserByEmailQuery(email);

        // Comprobamos si las contraseñas coinciden
        const validPassword = await bcrypt.compare(password, user.password);
        
         // Si las contraseñas no coinciden lanzamos un error
        if(!validPassword) {
            throw generateError('Incorrect password', 401);
        }

        // Si el usuario no está activo lanzamos un error.
        if(!user.active) throw generateError('User is not active',401);
       
        // Generamos un objeto con la informacion que queremos agregar al token. 
        const payload = {
            id: user.id,
            role: user.role,
        };

        // Firmamos el token 
        const token = jwt.sign(payload, process.env.SECRET,{
            expiresIn:'10d',
        }); 

        res.send({
            status: 'ok',
            data: {  
                token,
            },
        });

    } catch (err) {
        next(err);
    }
}

module.exports = loginUser;
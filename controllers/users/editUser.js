const { validateSchema, savePhoto, deletePhoto } = require('../../helpers');
const selectUserByIdQuery = require('../../db/userQueries/selectUserByIdQuery');
const updateUserQuery = require('../../db/userQueries/updateUserQuery');
const editUserSchema = require('../../schemas/editUserSchema');

const editUser = async (req, res, next) => {
    try {
        // Obtenemos los campos del body.
        let { username, email } = req.body;

        // obtenemos la info del usuario
        const user = await selectUserByIdQuery(req.user.id);
        
        // Variable donde almacenamos el nombre de la imagen
        let avatar;
        console.log(user);
       
        // Si existe avatar
        if (req.files?.avatar) {
            // Si el usuario tiene un avatar asignado lo borramos del dico duro
            if (user.avatar) {
                await deletePhoto(user.avatar);
            }

            // Guardamos la imagejn en el disco duro y obtenemos el nombre
            avatar = await savePhoto(req.files.avatar);
        }
        // Establecemos el valor final para las variables.
        username = username || user.username;
        email = email || user.email;
        avatar = avatar || user.avatar;

        // Creamos una variable para validar los datos
        const validateData = {
            username: username,
            email: email
        }

         // Validamos los datos del body con joi
         await validateSchema(editUserSchema, validateData)

        // Actualizamos los datos del usuario
        await updateUserQuery(username, email, avatar, req.user.id);

        res.send({
            status: 'ok',
            message: 'Usuario updated',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = editUser;

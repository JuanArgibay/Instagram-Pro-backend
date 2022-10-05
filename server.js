require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const cors = require('cors');

const { PORT, UPLOADS_DIR, MYSQL_HOST } = process.env;

const app = express();

app.use(cors());

app.use(morgan('dev'));

app.use(express.json());

app.use(fileUpload());

app.use(express.static(UPLOADS_DIR));

/**
 * ########################
 * ## Endpoints Usuarios ##
 * ########################
 */

const {
    newUser,
    validateUser,
    loginUser,
    editUser,
    getUserProfile,
    getOwnProfile,
    getUser,
} = require('./controllers/users/index');

const authUser = require('./middlewares/authUser');
const authUserOptional = require('./middlewares/authUserOptional');

app.get('/users/:idUser', authUserOptional, getUserProfile); // -   Ver el perfil de un usuario y su galeria de fotos.

app.get('/users/profile/:idUser', authUserOptional, getUser); // - Devuelve los datos principales de un usuario

app.post('/users', newUser); // -   Registro. -   Extra: Validación por email.

app.get('/users/validate/:registrationCode', validateUser); //-  validar un usuario

app.get('/users', authUser, getOwnProfile); //-     Devuelve los datos del usuario logeado y sus fotos

app.post('/users/login', loginUser); // -   Login

app.put('/users', authUser, editUser); // -  Editar usuario **TOKEN && ACTIVE**

/**
 * #######################
 * ## Endpoints entries ##
 * #######################
 */
const {
    newEntry,
    insertCommentToEntry,
    likeEntry,
    listEntries,
    viewEntryComments,
    getSingleEntry,
} = require('./controllers/entries');

app.post('/entries', authUser, newEntry); // -   Publicar una foto (con resize) con una descripcion **TOKEN && ACTIVE**

app.get('/entries', authUserOptional, listEntries); //  -   Ver ultimas fotos (entries) publicadas por otros usuarios. // -   Buscar fotos por texto descriptivo.

app.get('/entries/:idEntry', authUserOptional, getSingleEntry); // Obtener datos de una entrada en particular

app.get('/entries/:idEntry/comment', authUserOptional, viewEntryComments); //-   Ver los comentarios de una entrada

app.post('/entries/:idEntry/comment', authUser, insertCommentToEntry); // -   Comentar una foto (con autenticación y usuario activo). **TOKEN && ACTIVE**

app.post('/entries/:idEntry/like', authUser, likeEntry); // -   Dar / Quitar like a una foto (con autenticación y usuario activo). **TOKEN && ACTIVE**

/**
 * ######################
 * ## Middleware Error ##
 * ######################
 */

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).send({
        status: 'error',
        message: err.message,
    });
});

/**
 * ##########################
 * ## Middleware Not Found ##
 * ##########################
 */

app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not found!',
    });
});

/**
 * ######################
 * ## Server listening ##
 * ######################
 */

app.listen(PORT, () => {
    console.log(`Server listening at http://${MYSQL_HOST}:${PORT}`);
});

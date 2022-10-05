const insertEntryQuery = require('../../db/entriesQueries/insertEntryQuery');
const { generateError, savePhoto } = require('../../helpers');
const insertPhotoQuery = require('../../db/entriesQueries/insertPhotoQuery');
const joi = require('joi');
const selectUserByIdQuery = require('../../db/userQueries/selectUserByIdQuery');

const newEntry = async (req, res, next) => {
    try {
        // Recojemos los datos que nos llegan desde body
        const { description } = req.body;

        //Introducimos el post en la BBDD
        const entryId = await insertEntryQuery(description, req.user?.id);

        // Obtenemos el username
        const user = await selectUserByIdQuery(req.user?.id);

        // Validamos que la descripcion es correcta
        const schema = joi.object().keys({
            description: joi.string().allow(null, '').max(250),
        });
        const validation = schema.validate(req.body);
        if (validation.error)
            throw generateError(validation.error.message, 400);

        // Creamos array donde pushearemos el nombre de las fotos
        const photos = [];

        // Comprobamos que la foto nos llega desde el body
        if (!req.files)
            throw generateError('The photo is missing from your post.', 400);
        if (Object.values(req.files).length > 4)
            throw generateError('Maximum number of photos exceeded', 400);

        for (const photo of Object.values(req.files).slice(0, 4)) {
            //Guardamos la foto
            let photoName = await savePhoto(photo);

            //Guardamos el nombre de la foto en BBDD
            const photoInfo = await insertPhotoQuery(photoName, entryId);

            photos.push({
                imageId: photoInfo[0].insertId,
                imageName: photoName,
            });
        }

        res.send({
            status: 'ok',
            message: 'Post created!',
            data: {
                entry: {
                    entryId: entryId,
                    entryDescription: description,
                    entryOwnerUsername: user.username,
                    photos,
                    totalComments: 0,
                    totalLikes: 0,
                    entryOwnerId: req.user.id,
                    entryCreationDate: new Date(),
                    comments: [],
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = newEntry;

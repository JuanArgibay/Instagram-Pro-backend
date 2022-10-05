const insertCommentToEntryQuery = require('../../db/entriesQueries/insertCommentToEntryQuery');
const joi = require('joi');
const { generateError } = require('../../helpers');
const selectEntryByIdEntryQuery = require('../../db/entriesQueries/selectEntryByIdEntryQuery');

const insertCommentToEntry = async (req, res, next) => {
    try {
        // Recogemos los datos necesarios del front
        const { comment } = req.body;
        const { idEntry } = req.params;

        // Validamos que el comentario
        const schema = joi.object().keys({
            comment: joi.string().max(250).required(),
        });

        const validation = schema.validate(req.body);
        if (validation.error)
            throw generateError(validation.error.message, 400);

        //Comprobamos que existe la entrada
        await selectEntryByIdEntryQuery(idEntry);

        // Realizamos el registro del comentario en la BBDD
        await insertCommentToEntryQuery(idEntry, comment, req.user.id);

        res.send({
            status: 'ok',
            message: 'Comment sent!',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = insertCommentToEntry;

const insertLikeQuery = require('../../db/entriesQueries/insertLikeQuery');
const selectEntryByIdQuery = require('../../db/entriesQueries/selectEntryByIdEntryQuery');

const likeEntry = async (req, res, next) => {
    try {
        const { idEntry } = req.params;

        // Comprobamos que existe el post al que hay que ingrsar el like
        await selectEntryByIdQuery(idEntry);

        // Insertamos el like en el post
        const like = await insertLikeQuery(idEntry, req.user.id);

        res.send({
            status: 'ok',
            message: like ? 'Liked!' : 'Disliked',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = likeEntry;

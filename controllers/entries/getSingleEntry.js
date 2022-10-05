const selectEntryByIdEntryQuery = require('../../db/entriesQueries/selectEntryByIdEntryQuery');
const selectPhotosByIdEntryQuery = require('../../db/entriesQueries/selectPhotosByIdEntryQuery');
const { generateError } = require('../../helpers');

const getSingleEntry = async (req, res, next) => {
    try {
        const { idEntry } = req.params;

        const [entry] = await selectEntryByIdEntryQuery(idEntry, req.user?.id);

        if (entry.length < 1) throw generateError('No entry found', 404);

        const photos = await selectPhotosByIdEntryQuery(idEntry);

        const fullEntry = { ...entry, ...{ photos: photos } };

        res.send({
            status: 'ok',
            data: {
                fullEntry,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getSingleEntry;

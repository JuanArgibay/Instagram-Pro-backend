const selectAllEntriesQuery = require('../../db/entriesQueries/selectAllEntriesQuery');
const selectPhotosByIdEntryQuery = require('../../db/entriesQueries/selectPhotosByIdEntryQuery');
const selectFirstsCommentsByIdEntry = require('../../db/entriesQueries/selectFirstsCommentsByIdEntry');
const { indexPagination } = require('../../helpers');
const totalResultsQuery = require('../../db/entriesQueries/totalResultsQuery');

const listEntries = async (req, res, next) => {
    try {
        // Recogemos la keyword
        const { keyword } = req.query;
        console.log(req.user);
        // Recogemos la pagina por la que se hara la query
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);

        // En caso de no recibir datos del cliente introducimos por defecto la primera pagina con 10 posts a mostrar
        if (!page) page = 1;
        if (!limit) limit = 10;

        let startIndex = (page - 1) * limit;

        // Listamos todas las entries pasando como argumentos la pagina, los datos a recibir por pagina y en caso de tenerlo la keyword y el id del usuario.
        const entries = await selectAllEntriesQuery(
            req.user?.id,
            startIndex,
            limit,
            keyword
        );

        // Obtenemos el total de entradas
        const totalResults = await totalResultsQuery({
            option: 'listEntries',
            keyword,
        });

        // Montamos el indice de navegacion
        const index = await indexPagination(
            totalResults.totalResults,
            startIndex,
            page,
            limit
        );

        // Añadimos a las entradas los nombres de las fotos que tenga cada una
        await Promise.all(
            entries.map(async (entry) => {
                const photos = await selectPhotosByIdEntryQuery(entry.entryId);
                entry.photos = photos;
            })
        );

        // Añadimos a cada entrada los tres comentarios mas recientes que tenga cada entrada
        await Promise.all(
            entries.map(async (entry) => {
                const comments = await selectFirstsCommentsByIdEntry(
                    entry.entryId,
                    req.user?.id,
                    (startIndex = 0),
                    (limit = 3)
                );
                entry.comments = comments;
            })
        );

        res.send({
            status: 'ok',
            data: {
                index,
                entries,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = listEntries;

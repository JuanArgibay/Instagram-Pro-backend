const selectUserByIdQuery = require('../../db/userQueries/selectUserByIdQuery');
const selectPhotosByIdUserQuery = require('../../db/entriesQueries/selectPhotosByIdUserQuery');
const { indexPagination } = require('../../helpers');
const totalResultsQuery = require('../../db/entriesQueries/totalResultsQuery');

const getOwnProfile = async (req, res, next) => {
    try {
        const idUser = req.user.id;

        // Recogemos la pagina por la que se hara la query
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);

        // En caso de no recibir datos del cliente introducimos por defecto la primera pagina con 10 posts a mostrar
        if (!page) page = 1;
        if (!limit) limit = 10;

        let startIndex = (page - 1) * limit;

        // Recogemos los datos del usuario
        const user = await selectUserByIdQuery(idUser);

        // Obtenemos el total de resultados para calcular la paginacion
        const totalResults = await totalResultsQuery({
            option: 'getUser',
            idUser,
        });

        // Recogemos todas las fotos del usuario
        let photos = await selectPhotosByIdUserQuery(idUser, startIndex, limit);

        if (photos.length < 1) photos = 'Photos not found';

        // Montamos el resultado de fotos

        // Establecemos el indice
        const index = await indexPagination(
            totalResults.totalResults,
            startIndex,
            page,
            limit
        );

        // Montamos el resultado final con los datos del usuario, index de sus fotos, y fotos del usuario
        const fullUser = {
            user,
            index,
            photos,
        };

        res.send({
            status: 'ok',
            data: {
                fullUser,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getOwnProfile;

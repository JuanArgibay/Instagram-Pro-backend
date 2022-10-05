const getConnection = require('../getConnection');

const selectPhotosByIdUserQuery = async (idUser, startIndex, limit) => {
    let connection;

    try {
        connection = await getConnection();

        let [photos] = await connection.query(
            `
            SELECT P.name AS photoName, P.id AS photoId, E.id AS entryId
            FROM photos P
            LEFT JOIN entries E ON P.idEntry = E.id
            LEFT JOIN users U On E.idUser = U.id
            Where U.id = ?
            GROUP BY P.id
            ORDER BY P.id DESC
            LIMIT ?,?
            `,
            [idUser, startIndex, limit]
        );

        return photos;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectPhotosByIdUserQuery;

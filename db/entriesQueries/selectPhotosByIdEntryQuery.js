const getConnection = require('../getConnection');

const selectPhotosByIdEntryQuery = async (idEntry) => {
    // Otorgamos un valor por defecto al parámetro 'keyword' en caso de que no recibamos ningun argumento.

    let connection;
    try {
        connection = await getConnection();

        const [photos] = await connection.query(
            `
                SELECT 
                        id AS imageId,
                        name AS imageName,
                        createdAt AS imageAddingDate
                FROM photos 
                WHERE idEntry = ?
            `,
            [idEntry]
        );

        return photos;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectPhotosByIdEntryQuery;

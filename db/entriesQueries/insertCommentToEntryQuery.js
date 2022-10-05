const getConnection = require('../getConnection');

const insertCommentToEntryQuery = async (idEntry, comment, idUser) => {
    let connection;

    try {
        connection = await getConnection();

        // Insertamos el comentario en la BBDD
        await connection.query(
            `
                INSERT INTO comments (idEntry, idUser, comment, createdAT) VALUES (?, ?, ?, ?)
            `,
            [idEntry, idUser, comment, new Date()]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertCommentToEntryQuery;

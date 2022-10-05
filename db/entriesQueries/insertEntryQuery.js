const getConnection = require('../getConnection');

const insertEntryQuery = async (description, idUser) => {
    let connection;

    try {
        connection = await getConnection();

        // Insertamos los datos del post en la BBDD
        const [newEntry] = await connection.query(
            `INSERT INTO entries (description, idUser, createdAt) VALUES (?, ?, ?)`,
            [description, idUser, new Date()]
        );

        // Retornamos la id de la entrada
        return newEntry.insertId;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertEntryQuery;

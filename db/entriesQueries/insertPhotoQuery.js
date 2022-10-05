const getConnection = require('../getConnection');

const insertPhotoQuery = async (photoName, idEntry) => {
    let connection;

    try {
        connection = await getConnection();

        // Insertamos datos de la foto en la BBDD
        const data = await connection.query(
            `
                INSERT INTO photos (name, idEntry, createdAt) VALUES (?, ?, ?)
            `,
            [photoName, idEntry, new Date()]
        );

        return data;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertPhotoQuery;

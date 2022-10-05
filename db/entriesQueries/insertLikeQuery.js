const getConnection = require('../getConnection');

const insertLikeQuery = async (idEntry, idUser) => {
    let connection;
    try {
        connection = await getConnection();

        // Comprobamos si ya existe un like de un usuario en una entrada.
        const [likes] = await connection.query(
            `
                SELECT value FROM likes WHERE idUser = ? AND idEntry = ?
            `,
            [idUser, idEntry]
        );

        // En caso de no existir, lo introducimos.
        if (likes.length < 1) {
            await connection.query(
                `
                    INSERT INTO likes (idUser, idEntry, createdAt) VALUES (?, ?, ?)
                `,
                [idUser, idEntry, new Date()]
            );
            return true;
        } else {
            // En caso de que ya existiera un like, cambiamos su valor a false, o lo que es lo mismo, a dislike.
            await connection.query(
                `
                    UPDATE likes SET value = ?, modifiedAt = ? WHERE idUser = ? AND idEntry = ?
                `,
                [!likes[0].value, new Date(), idUser, idEntry]
            );

            // Retornamos true o false dependiendo de su estado (like o dislike)
            return !likes[0].value;
        }
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertLikeQuery;

const getConnection = require('../getConnection');
const { generateError } = require('../../helpers');

const selectEntryByIdEntryQuery = async (idEntry, idUser) => {
    let connection;
    try {
        connection = await getConnection();

        const [entry] = await connection.query(
            `
                SELECT 
                    E.id AS entryId,
                    E.description AS entryDescription,
                    E.idUser AS entryOwnerId,
                    U.username AS entryOwnerUsername,
                    E.idUser = ? AS EntryOwner,
                    BIT_OR(L.idUser = ? AND L.value = 1) AS likedByMe,
                    COUNT(C.id) AS totalComments,
                    SUM(IFNULL(L.value = true, 0)) AS totalLikes,
                    E.createdAt AS entryCreationDate
                FROM entries E
                LEFT JOIN users U ON E.idUser = U.id
                LEFT JOIN likes L ON L.idEntry = E.id
                LEFT JOIN comments C ON C.idEntry = E.id
                WHERE E.id = ?
                GROUP BY E.id;
            `,
            [idUser, idUser, idEntry]
        );

        if (entry.length < 1) throw generateError('No entry found', 404);

        return entry;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectEntryByIdEntryQuery;

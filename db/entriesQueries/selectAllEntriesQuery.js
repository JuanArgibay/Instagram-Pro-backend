const getConnection = require('../getConnection');

const selectAllEntriesQuery = async (
    idUser,
    startIndex,
    limit,
    keyword = ''
) => {
    let connection;
    try {
        connection = await getConnection();

        let entries;

        keyword === ''
            ? ([entries] = await connection.query(
                  `
                SELECT 
                    E.id AS entryId,
                    E.description AS entryDescription,
                    E.idUser AS entryOwnerId,
                    U.username AS entryOwnerUsername,
                    E.idUser = ? AS entryOwner,
                    BIT_OR(L.idUser = ? AND L.value = 1) AS likedByMe,
                    COUNT(C.id) AS totalComments,
                    SUM(IFNULL(L.value = true, 0)) AS totalLikes,
                    E.createdAt AS entryCreationDate
                FROM entries E
                LEFT JOIN users U ON E.idUser = U.id
                LEFT JOIN likes L ON L.idEntry = E.id
                LEFT JOIN comments C ON C.idEntry = E.id
                GROUP BY E.id
                ORDER BY E.id DESC
                LIMIT ?,?;
            `,
                  [idUser, idUser, startIndex, limit]
              ))
            : ([entries] = await connection.query(
                  `
                SELECT 
                E.id AS entryId,
                    E.description AS entryDescription,
                    E.idUser AS entryOwnerId,
                    U.username AS entryOwnerUsername,
                    E.idUser = ? AS entryOwner,
                    BIT_OR(L.idUser = ? AND L.value = 1) AS likedByMe,
                    COUNT(C.id) AS totalComments,
                    SUM(IFNULL(L.value = true, 0)) AS totalLikes,
                    E.createdAt AS entryCreationDate
                FROM entries E
                LEFT JOIN users U ON E.idUser = U.id
                LEFT JOIN likes L ON L.idEntry = E.id
                LEFT JOIN comments C ON C.idEntry = E.id
                WHERE E.description LIKE ?
                GROUP BY E.id
                ORDER BY E.id DESC
                LIMIT ?,?;
            `,
                  [idUser, idUser, `%${keyword}%`, startIndex, limit]
              ));

        return entries;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectAllEntriesQuery;

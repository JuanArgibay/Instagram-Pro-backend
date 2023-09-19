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

        let entries = {};
        let entries1;
        let entries2;

        keyword === ''
            ? ([entries1] = await connection.query(
                  `
                SELECT 
                    E.id AS entryId,
                    E.description AS entryDescription,
                    E.idUser AS entryOwnerId,
                    U.username AS entryOwnerUsername,
                    E.idUser = ? AS entryOwner,
                    COUNT(C.id) AS totalComments,
                    E.createdAt AS entryCreationDate
                FROM entries E
                LEFT JOIN users U ON E.idUser = U.id
                LEFT JOIN comments C ON C.idEntry = E.id
                GROUP BY E.id
                ORDER BY E.id DESC
                LIMIT ?,?;
            `,
                  [ idUser, startIndex, limit]
              ))
            : ([entries1] = await connection.query(
                  `
                SELECT 
                E.id AS entryId,
                    E.description AS entryDescription,
                    E.idUser AS entryOwnerId,
                    U.username AS entryOwnerUsername,
                    E.idUser = ? AS entryOwner,
                    COUNT(C.id) AS totalComments,
                    E.createdAt AS entryCreationDate
                FROM entries E
                LEFT JOIN users U ON E.idUser = U.id
                LEFT JOIN comments C ON C.idEntry = E.id
                WHERE E.description LIKE ?
                GROUP BY E.id
                ORDER BY E.id DESC
                LIMIT ?,?;
            `,
                  [ idUser, `%${keyword}%`, startIndex, limit]
              ));


            entries2 = await connection.query(
                  `
                SELECT 
                    BIT_OR(L.idUser = ? AND L.value = 1) AS likedByMe,
                    SUM(IFNULL(L.value = true, 0)) AS totalLikes,
                FROM entries E
                LEFT JOIN users U ON U.id = E.idUser
                LEFT JOIN likes L ON L.idEntry = E.id
                GROUP BY E.id
                ORDER BY E.id DESC
                LIMIT ?,?;
                
            `,
                  [ idUser, startIndex, limit]
              );

        entries = {...entries1, ...entries2}      
        return entries;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectAllEntriesQuery;

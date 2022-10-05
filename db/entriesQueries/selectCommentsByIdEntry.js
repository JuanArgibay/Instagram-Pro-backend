const { generateError } = require('../../helpers');
const getConnection = require('../getConnection');

const selectCommentsByIdEntry = async (idEntry, idUser, startIndex, limit) => {
    let connection;
    try {
        connection = await getConnection();

        const [comments] = await connection.query(
            `
            SELECT 
                C.id AS commentId, 
                C.idUser AS commentUserId, 
                U.username,
                C.idUser = ? AS ownerComment,
                C.comment, 
                C.createdAt
            FROM comments C 
            LEFT JOIN users U ON U.id = C.idUser 
            WHERE idEntry = ?
            ORDER BY C.createdAt DESC
            LIMIT ?,?;

        `,
            [idUser, idEntry, startIndex, limit]
        );

        return comments;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectCommentsByIdEntry;

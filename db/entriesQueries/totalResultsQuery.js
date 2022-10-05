const getConnection = require('../getConnection');

const totalResultsQuery = async ({ option, idUser, keyword = '', idEntry }) => {
    let connection;
    try {
        connection = await getConnection();

        let totalResults;

        if (option === 'getUser') {
            [totalResults] = await connection.query(
                `
                SELECT count(P.id) AS totalResults
                FROM photos P
                LEFT JOIN entries E ON P.idEntry = E.id
                LEFT JOIN users U On E.idUser = U.id
                Where U.id = ? 
            `,
                [idUser]
            );

            return totalResults[0];
        }

        if (option === 'listEntries') {
            keyword === ''
                ? ([totalResults] = await connection.query(
                      `
                    SELECT count(E.id) AS totalResults
                    FROM entries E
                `
                  ))
                : ([totalResults] = await connection.query(
                      `
                    SELECT count(E.id) AS totalResults
                    FROM entries E
                    WHERE E.description LIKE ?
                `,
                      [`%${keyword}%`]
                  ));

            return totalResults[0];
        }

        if (option === 'viewEntryComments') {
            [totalResults] = await connection.query(
                `
            SELECT count(C.id) as totalResults
            FROM comments C 
            LEFT JOIN users U ON U.id = C.idUser 
            WHERE idEntry = ?
        `,
                [idEntry]
            );
            return totalResults[0];
        }
    } finally {
        if (connection) connection.release();
    }
};

module.exports = totalResultsQuery;

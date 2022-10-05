const getConnection = require('../getConnection');

const updateUserQuery = async (username, email, avatar, idUser) => {

    let connection;

    try {
        connection = await getConnection();

        // Actualizamos el usuario.
        await connection.query(
            'UPDATE users SET username = ?, email = ?, avatar = ? WHERE id = ?',
            [username, email, avatar, idUser]
        )
    } finally {
        if(connection) connection.release();
    }
}


module.exports = updateUserQuery;
const getConnection = require('../getConnection');

const { generateError } = require('../../helpers');

const selectUserByIdQuery = async (idUser)  => {
    let connection;
    try {
        connection = await getConnection();

        // Seleccionamos los datos del usuario en relacion a su id
        const [users] = await connection.query(
            `SELECT id, username, email, role, createdAt, active, avatar FROM users WHERE id = ?`,
            [idUser]
        );

        // Si no existe usuario lanzamos un error
        if (users.length < 1) {
            throw generateError('User not found', 404);   
        }
        
        // devolvemos el usuario
        return users[0];

    } finally {
        if(connection) connection.release();
    }
}

module.exports = selectUserByIdQuery;
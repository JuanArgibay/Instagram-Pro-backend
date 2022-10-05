const getConnection = require('../getConnection');

const { generateError } = require('../../helpers');

const selectUserByEmailQuery = async (email)  => {
    let connection;

    try {
        connection = await getConnection();

        // Seleccionamos el usuario en base a su email
        const [users] = await connection.query(
            `SELECT id, password, avatar, active, role FROM users WHERE email = ?`,
            [email]
        );

        // Si no existe el usuario lanzamos un error
        if (users.length < 1) {
            throw generateError('Wrong email', 404);   
        }
        
        // devolvemos el usuario
        return users[0];  

    } finally {
        if(connection) connection.release();
    }
}

module.exports = selectUserByEmailQuery;
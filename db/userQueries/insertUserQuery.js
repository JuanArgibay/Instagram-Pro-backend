const { generateError } = require("../../helpers");
const getConnection = require("../getConnection");
const bcrypt = require("bcrypt");

const insertUserQuery = async (username, password, email, registrationCode) => {

    let connection;

    try {
        
        connection = await getConnection();

        // Obtenemos un array de usuarios en base al nombre de usuario 
        const [usernameUsers] = await connection.query(
            `SELECT id FROM users WHERE username = ?`,
            [username]
        );

        // Obtenemos un array de usuarios en base al email 
        const [emailUsers] = await connection.query(
            `SELECT id FROM users WHERE email = ?`,
            [email]
        );

        // Si existe algun usuario con ese email o con ese nombre de usuario lanzamos un error
        if (emailUsers.length > 0 || usernameUsers.length > 0) throw generateError('A user with that name already exists',403);

        // Encriptamos la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creamos al usuario
        await connection.query(
            `INSERT INTO users (username, email, password, registrationCode, createdAt)
            VALUES (?,?,?,?,?)`,
            [username, email, hashedPassword, registrationCode, new Date()]);


    } finally {
        
        if(connection) connection.release()
    }
};

module.exports = insertUserQuery;


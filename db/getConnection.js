const mysql = require('mysql2/promise');

// Obtenemos las variables de entorno mediante destructuring.
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = process.env;

let pool;

// Función que retorna una conexión libre.
const getConnection = async () => {
    try {
        // Si no hay un pool de conexiones lo creamos.
        if (!pool) {
            pool = mysql.createPool({
                connectionLimit: 10,
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASS,
                database: MYSQL_DB,
                timezone: 'Z',
            });
        }

        // Retornamos una conexión libre.
        return await pool.getConnection();
    } catch (err) {
        console.error(err);
        throw new Error('Error to connect with MySQL');
    }
};

// Exportamos la función.
module.exports = getConnection;

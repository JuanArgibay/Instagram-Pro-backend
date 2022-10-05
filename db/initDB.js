require('dotenv').config();

const getConnection = require('./getConnection');

const bcrypt = require('bcrypt');

async function main() {
    let connection;

    try {
        connection = await getConnection();

        await connection.query(`DROP TABLE IF EXISTS likes`);
        await connection.query(`DROP TABLE IF EXISTS comments`);
        await connection.query(`DROP TABLE IF EXISTS photos`);
        await connection.query(`DROP TABLE IF EXISTS entries`);
        await connection.query(`DROP TABLE IF EXISTS users`);

        console.log('Creating tables...');

        await connection.query(
            `
            CREATE TABLE IF NOT EXISTS users (    
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(30) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                avatar VARCHAR(100),
                role ENUM('admin', 'normal') DEFAULT 'normal',
                registrationCode VARCHAR(100),
                active BOOLEAN DEFAULT false,
                createdAt TIMESTAMP NOT NULL,
                modifiedAt TIMESTAMP
                )
            `
        );

        await connection.query(
            `
            CREATE TABLE IF NOT EXISTS entries (    
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                description VARCHAR(250),
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id),
                createdAt TIMESTAMP NOT NULL
                )
            `
        );
        await connection.query(
            `
            CREATE TABLE IF NOT EXISTS photos (    
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR (100),
                idEntry INT UNSIGNED NOT NULL,
                FOREIGN KEY (idEntry) REFERENCES entries(id),
                createdAt TIMESTAMP NOT NULL
                )
            `
        );
        await connection.query(
            `
            CREATE TABLE IF NOT EXISTS comments (    
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idEntry INT UNSIGNED NOT NULL,
                FOREIGN KEY (idEntry) REFERENCES entries(id),
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id),
                comment VARCHAR (250) NOT NULL,
                createdAt TIMESTAMP NOT NULL
                )
            `
        );
        await connection.query(
            `
            CREATE TABLE IF NOT EXISTS likes (    
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                value BOOLEAN DEFAULT true,
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id),
                idEntry INT UNSIGNED NOT NULL,
                FOREIGN KEY (idEntry) REFERENCES entries(id),
                createdAt TIMESTAMP NOT NULL,
                modifiedAt TIMESTAMP
                )
            `
        );

        console.log('Tables created!');

        const hashedPassword = await bcrypt.hash('123456', 10);

        await connection.query(
            `
                INSERT INTO users (username, email, password, role, active, createdAt)
                VALUES ('admin', 'admin@admin.com', ?, 'admin', true, ?)
            `,
            [hashedPassword, new Date()]
        );

        console.log('Admin user created!');

        await connection.query(
            `
                INSERT INTO users (username, email, password, role, active, createdAt)
                VALUES ('Manolito', 'manolito@email.com', ?, 'normal' , true, ?),
                        ('Juan', 'minombre1986@gmail.com',?, 'admin', false, ?),
                        ('Adrian', 'notfound404unknown@gmail.com', ? , 'admin', false, ?)
            `,
            [
                hashedPassword,
                new Date(),
                hashedPassword,
                new Date(),
                hashedPassword,
                new Date(),
            ]
        );

        console.log('Mock users created');
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

main();

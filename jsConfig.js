const PORT = process.env.PORT || 5002;
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '1234';
const MYSQL_DB_NAME = process.env.MYSQL_DB_NAME || 'p2p_db';
const SENDGRID_API_KEY =
    process.env.SENDGRID_API_KEY ||
    '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';
const SENDGRID_FROM = process.env.SENDGRID_FROM || 'minombre1986@gmail.com';
const SECRET = process.env.SECRET || 'dc342425DWSFfwefw234';
const UPLOADS_DIR = process.env.UPLOADS_DIR || 'uploads';

module.exports = {
    PORT,
    MYSQL_USER,
    MYSQL_HOST,
    MYSQL_PASSWORD,
    MYSQL_DB_NAME,
    SECRET,
    UPLOADS_DIR,
    SENDGRID_FROM,
    SENDGRID_API_KEY,
};

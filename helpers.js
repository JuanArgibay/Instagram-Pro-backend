const sgMail = require('@sendgrid/mail');
const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const { v4: uuid } = require('uuid');

// Asignameos el API Key a sendgrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * ####################
 * ## Generate Error ##
 * ####################
 */

const generateError = (message, status) => {
    const err = new Error(message);
    err.statusCode = status;
    return err;
};

/**
 * #####################
 * ## VALIDATE SCHEMA ##
 * #####################
 */

const validateSchema = async (schema, data) => {
    const validation = schema.validate(data);
    if (validation.error) throw generateError(validation.error.message, 400);
};

/**
 * ##################
 * ## VERIFY EMAIL ##
 * ##################
 */

const verifyEmail = async (email, registrationCode) => {
    // Asunto del email
    const subject = 'Activa tu usuario en InstagramPro';

    // Mensaje que enviaremos al email del usuario
    const emailBody = `
    Te acabar de registrar en InstagramPro.
    Pulsa este enlace para verificar tu cuenta: http://${process.env.MYSQL_HOST}:${process.env.PORT}/users/validate/${registrationCode}
    `;

    try {
        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM,
            subject,
            text: emailBody,
            html: `
                <div>
                    <h1>${subject}</h1>
                    <p>${emailBody}</p>
                </div>
                `,
        };

        // Enviamos el mensaje
        await sgMail.send(msg);
    } catch {
        throw generateError('Error sending email');
    }
};

/**
 * ######################
 * ## INDEX PAGINATION ##
 * ######################
 */

const indexPagination = async (totalResults, startIndex, page, limit) => {
    let index = { totalResults };
    let message;

    const lastPage = Math.ceil(totalResults / limit);

    if (page > lastPage || page < 0) return (message = 'No Results');

    if (startIndex > 0) {
        index = {
            ...index,
            previousPage: page - 1,
        };
    }

    index = {
        ...index,
        currentPage: page,
    };

    if (page !== lastPage) {
        index = {
            ...index,
            nextPage: page + 1,
            lastPage: lastPage,
            limit: limit,
        };
    }

    if (lastPage === page) {
        index = {
            ...index,
            nextPage: 'none',
            lastPage: lastPage,
            limit: limit,
        };
    }

    return index;
};

/**
 * ################
 * ## SAVE PHOTO ##
 * ################
 */

const savePhoto = async (img) => {
    // Creamos una ruta absoluta al directorio donde vamos a subir las imágenes
    const uploadsPath = path.join(__dirname, process.env.UPLOADS_DIR);

    try {
        // Intentamos acceder al directorio de subida de archivos
        await fs.access(uploadsPath);
    } catch {
        // Si el directorio no existe, lo creamos.
        await fs.mkdir(uploadsPath);
    }

    // Procesamos la imagen y la convertimos en un objeto de tipo "Sharp".
    const sharpImg = sharp(img.data);

    // Redimensioamos la imagen. Le asignamos un ancho máximo de 500px.
    sharpImg.resize(500);

    // Generamos un nombre único para la imagen.
    const imgName = `${uuid()}.jpg`;

    // Generamos la ruta absoluta donde guardaremos la imagen
    const imgPath = path.join(uploadsPath, imgName);

    // Guardamos la imagen
    await sharpImg.toFile(imgPath);

    // Retornamos el nombre de la imagen
    return imgName;
};

/**
 * ##################
 * ## DELETE PHOTO ##
 * ##################
 */

const deletePhoto = async (imgName) => {
    try {
        // Creamos la ruta absoluta a la imagen que queremos borrar
        const imgPath = path.join(__dirname, process.env.UPLOADS_DIR, imgName);

        try {
            // Intentamos acceder al archivo con la imagen
            await fs.access(imgPath);
        } catch {
            // Si la imagen no existe devolvemos el valor 'false'.
            return false;
        }

        // Eliminamos la imagen del disco duro
        await fs.unlink(imgPath);

        return true;
    } catch {
        throw generateError('Error to delete image from server');
    }
};

module.exports = {
    generateError,
    verifyEmail,
    savePhoto,
    deletePhoto,
    indexPagination,
    validateSchema,
};

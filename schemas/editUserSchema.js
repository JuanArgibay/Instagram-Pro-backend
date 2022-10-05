const joi = require('joi');

const newUserSchema = joi.object().keys({
    username: joi
    .string()
    .min(5)
    .max(25),
    email: joi
    .string()
    .max(100)
    .email(),
});

module.exports = newUserSchema;


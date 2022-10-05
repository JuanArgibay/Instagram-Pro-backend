const joi = require('joi');

const newUserSchema = joi.object().keys({
    username: joi.string()
    .min(5)
    .max(25)
    .required(),
    email: joi
    .string()
    .email()
    .max(100)
    .required(),
    password: joi
        .string()
        .min(8)
        .max(100)
        .regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[¡!$%^&*()_+|~=`{}:";'<>¿?,.])[a-zA-Z0-9¡!$%^&*()_+|~=`{}:";'<>¿?,.]{8,}$/
        )
        .required()
        .error((errors) => {
            switch(errors[0].code){
                case 'any.required':
                    return new Error ('Password is required')
                case 'string.pattern.base':
                    return new Error ('Password must contain 1 uppercase letter 1 lowercase letter and a punctuation mark')   
                case 'string.min':
                    return new Error ('Password must be at least 8 caracters')
                case 'string.max':
                    return new Error ('Password must be at most 100 caracters')     
            }
        }),
});

module.exports = newUserSchema;

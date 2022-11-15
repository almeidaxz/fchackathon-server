const joi = require("joi");

const errorEmail = {
    "any.required": "O E-mail deve ser preenchido.",
    "string.empty": "O E-mail deve ser preenchido.",
    "string.email": "Informe um e-mail válido."
};

const errorPassword = {
    "any.required": "A senha deve ser preenchida.",
    "string.empty": "A senha deve ser preenchida."
};

const userLoginSchema = joi.object({
    email: joi.string().email().required().messages(errorEmail),
    password: joi.string().required().trim().messages(errorPassword),
});

module.exports = {
    userLoginSchema
};
const joi = require("joi");

const errorName = {
    "any.required": "O nome deve ser informado.",
    "string.min": "O nome deve ter no mínimo 4 caracteres.",
    "string.empty": "O nome deve ser preenchido.",
};

const errorEmail = {
    "any.required": "O E-mail deve ser informado.",
    "string.email": "O E-mail deve ser válido.",
    "string.empty": "O E-mail deve ser preenchido.",
};

const errorPassword = {
    "any.required": "A senha deve ser informada.",
    "string.min": "A senha deve ter no mínimo 8 caracteres.",
    "string.empty": "A senha deve ser informada.",
};

const userSignUpSchema = joi.object({
    name: joi.string().min(3).pattern(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u).required().messages(errorName),
    email: joi.string().email().required().messages(errorEmail),
    password: joi.string().min(8).trim().required().messages(errorPassword),
});

module.exports = {
    userSignUpSchema,
};

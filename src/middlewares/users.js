const knex = require("../database/dbConnect");
const jwt = require("jsonwebtoken");

const validateUserData = (joiSchema) => async (req, res, next) => {
    const { email } = req.body;

    try {
        await joiSchema.validateAsync(req.body);

        const existingEmail = await knex("users").where({ email }).first();
        if (existingEmail)
            return res
                .status(400)
                .json({ message: "E-mail informado já cadastrado." });

        next();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const loginRequired = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).send({ mensagem: "Falha na autenticação" });
    }
};

const loginOptional = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.user = decode;
        next();
    } catch (error) {
        next();
    }
};

module.exports = {
    validateUserData,
    loginRequired,
    loginOptional
};

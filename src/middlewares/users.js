const knex = require('../database/dbConnect');

const validateUserData = joiSchema => async (req, res, next) => {
    const { email } = req.body;

    try {
        await joiSchema.validateAsync(req.body);

        if (req.url === '/signup') {
            const existingEmail = await knex('users').where({ email }).first();

            if (existingEmail) return res.status(400).json({ message: 'E-mail informado já cadastrado.' });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    validateUserData
};
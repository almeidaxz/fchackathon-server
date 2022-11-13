const knex = require("../database/dbConnect");

const validateAdminData = (joiSchema) => async (req, res, next) => {
    const { email } = req.body;

    try {
        await joiSchema.validateAsync(req.body);

        const existingEmail = await knex("admins").where({ email }).first();

        if (existingEmail)
            return res
                .status(400)
                .json({ message: "E-mail informado já cadastrado." });

        next();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    validateAdminData,
};

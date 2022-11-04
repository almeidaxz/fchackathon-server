const knex = require("../database/dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AdminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const adminExists = await knex("admins").where({ email }).first();
        if (!adminExists) {
            return res.status(401).send({ message: "Usuário não encontrado." });
        }

        const decryptedPassword = await bcrypt.compare(password, adminExists.password);
        if (!decryptedPassword) {
            return res.status(401).send({ message: "Usuário ou senha inválido." });
        }

        const token = jwt.sign(
            { email: adminExists.email },
            process.env.JWT_KEY,
            { expiresIn: "5h" }
        );

        const { password: _, ...logedAdmin } = adminExists;

        return res.status(200).send({
            message: "Autenticado com sucesso",
            logedAdmin,
            token: token,
        });
    } catch (error) {
        return res.status(500).json({ message: "Erro no servidor." });
    }
};

//DEVELOPMENT ONLY
const AdminSignUp = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);

        await knex("admins").insert({ name, email, password: encryptedPassword }).returning("*");

        return res.status(201).json({ message: "Cadastro realizado com sucesso!" });
    } catch (error) {
        return res.status(500).json({ message: "Erro no servidor." });
    }
};

module.exports = {
    AdminSignUp,
    AdminLogin
};
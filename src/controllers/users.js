const knex = require("../database/dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SignUp = async (req, res) => {
    const { name, email, password, study_tracks } = req.body;

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);

        await knex("users")
            .insert({ name, email, password: encryptedPassword, study_tracks })
            .returning("*");

        return res
            .status(201)
            .json({ message: "Cadastro realizado com sucesso!" });
    } catch (error) {
        return res.status(500).json({ message: "Erro no servidor." });
    }
};

const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        var result = await knex("users").where({ email }).returning("*");

        if (result.length < 1) {
            return res.status(401).send({ message: "Falha na autenticação" });
        }

        if (await bcrypt.compareSync(password, result[0].password)) {
            const token = jwt.sign(
                {
                    email: result[0].email,
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "5h",
                }
            );
            return res.status(200).send({
                message: "Autenticado com sucesso",
                name: result[0].name,
                email: result[0].email,
                study_tracks: result[0].study_tracks,
                token: token,
            });
        }

        return res.status(401).send({ message: "Falha na autenticação" });
    } catch (error) {
        return res.status(500).json({ message: "Erro no servidor." });
    }
};

module.exports = {
    SignUp,
    Login,
};

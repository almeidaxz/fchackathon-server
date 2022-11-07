const knex = require("../database/dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SignUp = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);

        await knex("users")
            .insert({ name, email, password: encryptedPassword })
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
        const userExists = await knex("users").where({ email }).first();

        if (!userExists) {
            return res.status(401).send({ message: "Falha na autenticação" });
        }

        if (await bcrypt.compareSync(password, userExists.password)) {
            const token = jwt.sign(
                {
                    email: userExists.email,
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "5h",
                }
            );

            const { password: _, ...logedUser } = userExists;

            return res.status(200).send({
                message: "Autenticado com sucesso",
                logedUser,
                token: token,
            });
        }

        return res.status(401).send({ message: "Falha na autenticação" });
    } catch (error) {
        return res.status(500).json({ message: "Erro no servidor." });
    }
};

const UpdateUser = async (req, res) => {
    const { id, name, email, password } = req.body;

    try {
        var user = await knex("users").where({ id }).first();

        if (typeof name === undefined) name = user.name;
        if (typeof email === undefined) email = user.email;
        if (password === undefined) {
            await knex("users").where({ id }).update({ name, email });

            return res
                .status(201)
                .json({ message: "Cadastro atualizado com sucesso!" });
        }
        var encryptedPassword = await bcrypt.hash(password, 10);
        await knex("users")
            .where({ id })
            .update({ name, email, password: encryptedPassword });

        return res
            .status(201)
            .json({ message: "Cadastro atualizado com sucesso!" });
    } catch (error) {
        return res.status(500).json({ message: "Erro no servidor." });
    }
};

const SignToTrack = async (req, res) => {
    const { track_id } = req.params;
    const { user_id } = req.body;

    try {
        const selectedTrack = await knex("tracks")
            .where({ id: track_id })
            .first();
        if (!selectedTrack)
            return res.status(404).json({ message: "Trilha não encontrada." });

        await knex("user_track").insert({ track_id, user_id }).returning("*");

        return res.status(201).json({ message: "Trilha iniciada!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor." });
    }
};

const GetUserTracks = async (req, res) => {
    const { id } = req.params;
    try {
        const tracks = await knex
            .select("*")
            .from("tracks")
            .join("user_track", function () {
                this.on("tracks.id", "=", "track_id").onIn("user_id", id);
            });
        if (tracks.length < 1)
            return res
                .status(404)
                .json({ message: "Nenhuma trilha cadastrada!" });
        return res.status(200).send(tracks);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor." });
    }
};

module.exports = {
    SignUp,
    Login,
    UpdateUser,
    SignToTrack,
    GetUserTracks,
};

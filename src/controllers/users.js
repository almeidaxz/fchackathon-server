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
        if (!user) {
            return res.status(401).send({ message: "Usuário não existe!" });
        }

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

const DeleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        var userExists = await knex("users").where({ id }).first();

        if (!userExists) {
            return res.status(401).send({ message: "Usuário não encontrado." });
        }
        await knex.select().table("user_track").where({ user_id: id }).del();
        await knex("users").where({ id }).del();

        return res
            .status(201)
            .json({ message: "Usuário deletado com sucesso!" });
    } catch (error) {
        console.log(error);
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

const GetContentsToTrack = async (req, res) => {
    const { id } = req.params;
    try {
        const contents = await knex
            .select("*")
            .from("contents")
            .join("track_content", function () {
                this.on("contents.id", "=", "content_id").onIn("track_id", id);
            });
        if (!contents)
            return res
                .status(404)
                .json({ message: "Nenhum conteúdo cadastrado!" });
        return res.status(200).send(contents);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor." });
    }
};

const GetTracks = async (req, res) => {
    try {
        const tracks = await knex.select().table("tracks");
        if (!tracks)
            return res
                .status(404)
                .json({ message: "Nenhuma trilha cadastrada!" });
        return res.status(200).send({ tracks });
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
    DeleteUser,
    GetContentsToTrack,
    GetTracks,
};

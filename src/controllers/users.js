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
            return res.status(401).send({ message: "Usuário não encontrado. Cadastre-se aqui!" });
        }

        const decryptedPassword = await bcrypt.compare(password, userExists.password);
        if (!decryptedPassword) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos.' })
        }
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
    } catch (error) {
        return res.status(500).json({ message: "Erro no servidor." });
    }
};

const UpdateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

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
                .status(200)
                .json({ message: "Cadastro atualizado com sucesso!" });
        }
        var encryptedPassword = await bcrypt.hash(password, 10);
        await knex("users")
            .where({ id })
            .update({ name, email, password: encryptedPassword });

        return res
            .status(200)
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
        await knex.select().table("user_tracks").where({ user_id: id }).del();
        await knex("users").where({ id }).del();

        return res
            .status(200)
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
        if (!selectedTrack) {
            return res.status(404).json({ message: "Trilha não encontrada." });
        }

        const userSigned = await knex('user_tracks').where({ track_id, user_id }).first();

        if (userSigned) return res.status(404).json({ message: "Trilha já iniciada" });

        await knex("user_tracks").insert({ track_id, user_id });

        const trackContent = await knex('contents').where({ track_id });

        if (trackContent.length) {
            trackContent.map(async (item) => {
                await knex("user_contents").insert({ track_id, user_id, content_id: item.id, complete: false }).returning("*");
            });
        }

        return res.status(200).json({ message: "Trilha iniciada!" });
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
            .join("user_tracks", function () {
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

const GetUserContents = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) return res.status(400).json({ message: "O id do usuário deve ser informado." });

    try {
        const userContents = await knex('user_contents').where({ user_id }).debug();

        console.log(userContents);
        return res.status(200).json(userContents);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor." });
    }
}

const GetContentsToTrack = async (req, res) => {
    const { track_id } = req.params;
    try {

        const contents = await knex('contents').where({ track_id });
        if (!contents)
            return res
                .status(404)
                .json({ message: "Nenhum conteúdo cadastrado!" });
        return res.status(200).json(contents);
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

const GetUserProgress = async (req, res) => {
    const { track_id, user_id } = req.params;

    try {
        const trackContentForUser = await knex('user_contents').where({ user_id, track_id });
        if (!trackContentForUser) return res.status(404).json({ message: "Nenhum conteúdo encontrado" });

        return res.status(200).json(trackContentForUser);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Erro no servidor." });
    }
}

const CheckContentAsComplete = async (req, res) => {
    const { user_id, content_id, complete } = req.body;

    try {
        const check = await knex('user_contents').update({ complete }).where({ user_id, content_id }).returning('*');

        return res.status(200).json({ message: "Atualizado com sucesso!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor." });
    }
}

module.exports = {
    SignUp,
    Login,
    UpdateUser,
    SignToTrack,
    GetUserTracks,
    DeleteUser,
    GetContentsToTrack,
    GetTracks,
    CheckContentAsComplete,
    GetUserProgress,
    GetUserContents
};

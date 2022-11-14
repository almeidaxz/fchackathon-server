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

        const decryptedPassword = await bcrypt.compare(
            password,
            adminExists.password
        );
        if (!decryptedPassword) {
            return res
                .status(401)
                .send({ message: "Usuário ou senha inválido." });
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
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor." });
    }
};

const AdminAddTrack = async (req, res) => {
    const { name } = req.body;

    try {
        const trackExists = await knex("tracks").where({ name }).first();
        if (trackExists)
            return res.status(400).json({ message: "Trilha já existente" });

        if (!name)
            return res
                .status(400)
                .json({ message: "Informe o nome da trilha." });

        await knex("tracks").insert({ name }).returning("*");

        return res
            .status(201)
            .json({ message: "Trilha cadastrada com sucesso." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor." });
    }
};

const AdminAddTrackContent = async (req, res) => {

    const { track_id, name, type, duration, creator, url, description, subtitle, url_image } =
        req.body;
        
    try {
        if (!name || !type || !duration || !url) {
            return res
                .status(400)
                .json({ message: "Informe todos os dados obrigatórios" });
        }


        const trackExists = await knex('tracks').where({ id: track_id }).first();

        if (!trackExists) return res.status(404).json({ message: "Triha não cadastrada." });

        if (
            (type === "artigo" && !description) ||
            (type === "artigo" && !url_image)
        ) {
            return res.status(400).json({
                message:
                    "Uma descrição e a url da imagem são obrigatórias caso o tipo seja artigo.",
            });
        }

        await knex("contents")
            .insert({
                creator,
                description,
                duration,
                track_id,
                name,
                subtitle,
                type,
                url,
                url_image
            })
            .returning("*");

        return res
            .status(201)
            .json({ message: "Conteúdo cadastrado com sucesso." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor." });
    }
};

const DeleteTrack = async (req, res) => {
    const { id } = req.params;

    try {
        var trackExists = await knex("tracks").where({ id }).first();

        if (!trackExists) {
            return res.status(401).send({ message: "Trilha não encontrado." });
        }
        await knex.select().table("user_track").where({ track_id: id }).del();
        await knex
            .select()
            .table("track_content")
            .where({ track_id: id })
            .del();
        await knex("tracks").where({ id }).del();

        return res
            .status(201)
            .json({ message: "Trilha deletada com sucesso!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor." });
    }
};

const DeleteContent = async (req, res) => {
    const { id } = req.params;

    try {
        var contentExists = await knex("contents").where({ id }).first();

        if (!contentExists) {
            return res
                .status(401)
                .send({ message: "Conteúdo não encontrado." });
        }
        await knex
            .select()
            .table("track_content")
            .where({ content_id: id })
            .del();
        await knex("contents").where({ id }).del();

        return res
            .status(201)
            .json({ message: "Conteúdo deletada com sucesso!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor." });
    }
};

module.exports = {
    AdminSignUp,
    AdminLogin,
    AdminAddTrack,
    AdminAddTrackContent,
    DeleteContent,
    DeleteTrack,
};

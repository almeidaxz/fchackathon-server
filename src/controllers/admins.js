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
            { expiresIn: "1h" }
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

        return res.status(500).json({ message: "Erro no servidor." });
    }
};

const AdminAddTrackContent = async (req, res) => {

    const { track_id, name, type, duration, creator, url, description, subtitle, url_image } =
        req.body;

    try {
        if (!name || !type || !duration || !url || !creator) {
            return res
                .status(400)
                .json({ message: "Informe todos os dados obrigatórios" });
        }


        const trackExists = await knex('tracks').where({ id: track_id }).first();

        if (!trackExists) return res.status(404).json({ message: "Triha não cadastrada." });

        if (
            (type === "Artigo" && !description) ||
            (type === "Artigo" && !url_image)
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

        return res.status(500).json({ message: "Erro no servidor." });
    }
};

const DeleteTrack = async (req, res) => {
    const { id } = req.params;

    console.log(id);

    try {
        var trackExists = await knex("tracks").where({ id }).first();
        if (!trackExists) {
            return res.status(401).send({ message: "Trilha não encontrado." });
        }

        await knex("tracks").where({ id }).del();
        await knex("user_contents").where({ track_id: id }).del();
        await knex("contents")
            .where({ track_id: id })
            .del();
        await knex("user_tracks").where({ track_id: id }).del();


        return res
            .status(201)
            .json({ message: "Trilha deletada com sucesso!" });
    } catch (error) {

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

        await knex("contents").where({ id }).del();

        return res
            .status(201)
            .json({ message: "Conteúdo deletada com sucesso!" });
    } catch (error) {

        return res.status(500).json({ message: "Erro no servidor." });
    }
};


const AdminSignUp = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);

        await knex("admins")
            .insert({ name, email, password: encryptedPassword })
            .returning("*");

        return res
            .status(201)
            .json({ message: "Cadastro realizado com sucesso!" });
    } catch (error) {
        return res.status(500).json({ message: "Erro no servidor." });
    }
};

const UpdateTrack = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        if (!name) {
            return res
                .status(400)
                .json({ message: "Informe o novo nome da trilha." });
        }

        await knex('tracks').update({ name }).where({ id }).returning('*');

        return res.status(200).json({ message: "Trilha atualizada com sucesso!" });
    } catch (error) {
        return res.status(500).json({ message: "Erro no servidor." });
    }
}

const UpdateContent = async (req, res) => {
    const { id } = req.params;
    const { track_id, name, type, duration, url, description, url_image, creator, subtitle } = req.body;

    try {
        if (!name || !track_id || !type || !duration || !creator || !subtitle, !url) {
            return res
                .status(400)
                .json({ message: "Informe todos os dados obrigatórios." });
        }

        if (type !== 'Video' && !url_image || type !== 'Video' && !subtitle || type !== 'Video' && !description) {
            return res
                .status(400)
                .json({ message: "A URL de uma imagem, descrição e subtítulo são necessários caso o conteúdo não seja em vídeo" });
        }

        const existingTrack = await knex('tracks').where({ id: track_id }).first();
        if (!existingTrack) {
            return res
                .status(404)
                .json({ message: "Trilha informada não cadastrada." });
        }

        await knex('contents').update({ track_id, name, type, duration, url, description, url_image, creator, subtitle }).where({ id }).returning('*');

        return res.status(200).json({ message: "Conteúdo atualizada com sucesso!" });
    } catch (error) {
        return res.status(500).json({ message: "Erro no servidor." });
    }
}

const GetAllContent = async (req, res) => {
    try {
        const allContent = await knex('contents');
        if (!allContent) {
            return res
                .status(404)
                .json({ message: "Nenhum conteúdo cadastrado" });
        }

        return res.status(200).json(allContent);
    } catch (error) {
        return res.status(500).json({ message: "Erro no servidor." });
    }
}

module.exports = {
    AdminLogin,
    AdminAddTrack,
    AdminAddTrackContent,
    DeleteContent,
    DeleteTrack,
    AdminSignUp
    UpdateTrack,
    UpdateContent,
    GetAllContent
};

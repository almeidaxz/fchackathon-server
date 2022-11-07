const knex = require("../database/dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

module.exports = {
    GetTracks,
    GetContentsToTrack,
    DeleteTrack,
};

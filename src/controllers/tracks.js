const knex = require("../database/dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

module.exports = {
    SignToTrack,
    GetTracks,
    GetContentsToTrack,
};

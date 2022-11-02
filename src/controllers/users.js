const knex = require('../database/dbConnect');

const SignUp = async (req, res) => {
    const { name, email, password, study_tracks } = req.body;

    try {
        const teste = await knex('users').insert({ name, email, password, study_tracks }).returning('*');

        return res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
}

module.exports = {
    SignUp
}
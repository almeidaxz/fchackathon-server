require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const cors = require('cors');

const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const app = express();

const port = process.env.PGPORT || 3000;

app.use(express.json());
app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));
app.use(routes);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;

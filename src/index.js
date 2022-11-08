require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const app = express();

const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(routes);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;

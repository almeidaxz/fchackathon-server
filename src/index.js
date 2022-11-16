const express = require("express");
const routes = require("./routes");
const cors = require('cors');
require("dotenv").config();

const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.options("*", cors)
app.use(express.json());
app.use(routes);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;

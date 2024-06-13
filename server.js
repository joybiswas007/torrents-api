require("dotenv").config();
const express = require("express");

const app = express();
const helmet = require("helmet");
const cors = require("cors");

const logger = require("./api/configs/logger");

const { PORT } = process.env;
const port = PORT || 21000;

app.use(helmet());
app.use(express.json());
app.use(cors());

// Import routes
const routes = require("./api/routes/routes");
const search = require("./api/routes/searchDB");

// Use routes
app.use("/torrents/api/v1", routes);
app.use("/search", search);

app.get("*", (req, res) => {
  res.status(405).send({
    statuseCode: 405,
    error: `Method ${req.method} not allowed`
  });
});

app.post("*", (req, res) => {
  res.status(400).send({
    statuseCode: 400,
    error: "Bad request"
  });
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.port || 10000;
app.use(express.json());

//Import routes
const _1337x = require("./routes/_1337x");

//Use routes
app.use("/torrents/api/v1/1337x", _1337x);

app.get("*", (req, res) => {
  res.status(405).send(`${req.method} Method NOT Allowed!`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

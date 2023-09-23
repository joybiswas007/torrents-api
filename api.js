require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.port || 10000;
app.use(express.json());

//Import routes
const _1337x = require("./routes/_1337x");
const bitsearch = require("./routes/bitsearch");
const knaben = require("./routes/knaben");
const torlock = require("./routes/torlock");

//Use routes
app.use("/torrents/api/v1/1337x", _1337x);
app.use("/torrents/api/v1/bitsearch", bitsearch);
app.use("/torrents/api/v1/knaben", knaben);
app.use("/torrents/api/v1/torlock", torlock);

app.get("*", (req, res) => {
  res.status(405).send(`${req.method} Method NOT Allowed!`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

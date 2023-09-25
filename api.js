require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.port || 10000;
app.use(express.json());

//Import routes
const one337x = require("./routes/one337x");
const bitsearch = require("./routes/bitsearch");
const knaben = require("./routes/knaben");
const torlock = require("./routes/torlock");
const torrentGalaxy = require("./routes/torrentGalaxy");
const pcGamesTorrents = require("./routes/pcGamesTorrents");
const zooqle = require("./routes/zooqle");
const MagnetDL = require("./routes/magnetDL");

//Use routes
app.use("/torrents/api/v1/1337x", one337x);
app.use("/torrents/api/v1/bitsearch", bitsearch);
app.use("/torrents/api/v1/knaben", knaben);
app.use("/torrents/api/v1/torlock", torlock);
app.use("/torrents/api/v1/torrentgalaxy", torrentGalaxy);
app.use("/torrents/api/v1/pcgamestorrents", pcGamesTorrents);
app.use("/torrents/api/v1/zooqle", zooqle);
app.use("/torrents/api/v1/magnetdl", MagnetDL);

app.get("*", (req, res) => {
  res.status(405).send(`${req.method} Method NOT allowed!`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

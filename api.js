require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 10000;
app.use(express.json());

//Import routes
const one337x = require("./api/routes/one337x");
const bitsearch = require("./api/routes/bitsearch");
const knaben = require("./api/routes/knaben");
const torlock = require("./api/routes/torlock");
const torrentGalaxy = require("./api/routes/torrentGalaxy");
const pcGamesTorrents = require("./api/routes/pcGamesTorrents");
const zooqle = require("./api/routes/zooqle");
const MagnetDL = require("./api/routes/magnetDL");
const kickassTorrents = require("./api/routes/kickassTorrents");
const thePirateBay = require("./api/routes/thePirateBay");
const gloTorrents = require("./api/routes/gloTorrents");

//Use routes
app.use("/torrents/api/v1/1337x", one337x);
app.use("/torrents/api/v1/bitsearch", bitsearch);
app.use("/torrents/api/v1/knaben", knaben);
app.use("/torrents/api/v1/torlock", torlock);
app.use("/torrents/api/v1/torrentgalaxy", torrentGalaxy);
app.use("/torrents/api/v1/pcgamestorrents", pcGamesTorrents);
app.use("/torrents/api/v1/zooqle", zooqle);
app.use("/torrents/api/v1/magnetdl", MagnetDL);
app.use("/torrents/api/v1/kickasstorrents", kickassTorrents);
app.use("/torrents/api/v1/thepiratebay", thePirateBay);
app.use("/torrents/api/v1/glotorrents", gloTorrents);

app.get("*", (req, res) => {
  res.status(405).send(`${req.method} Method NOT allowed!`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 10000;
app.use(express.json());

//Import routes
const _1337x = require("./api/routes/_1337x");
const bitsearch = require("./api/routes/bitsearch");
const knaben = require("./api/routes/knaben");
const torlock = require("./api/routes/torlock");
const torrentGalaxy = require("./api/routes/torrentGalaxy");
const zooqle = require("./api/routes/zooqle");
const magnetdl = require("./api/routes/magnetDL");
const kickassTorrents = require("./api/routes/kickassTorrents");
const thePirateBay = require("./api/routes/thePirateBay");
const gloTorrents = require("./api/routes/gloTorrents");
const limeTorrents = require("./api/routes/limeTorrents");
const pirateiro = require("./api/routes/pirateiro");
const nyaa = require("./api/routes/nyaa");
const anidex = require("./api/routes/anidex");
const yts = require("./api/routes/yts");
const PCGAMES = require("./api/routes/pcGamesTorrents");

//Use routes
app.use("/torrents/api/v1/1337x", _1337x);
app.use("/torrents/api/v1/bitsearch", bitsearch);
app.use("/torrents/api/v1/knaben", knaben);
app.use("/torrents/api/v1/torlock", torlock);
app.use("/torrents/api/v1/torrentgalaxy", torrentGalaxy);
app.use("/torrents/api/v1/zooqle", zooqle);
app.use("/torrents/api/v1/magnetdl", magnetdl);
app.use("/torrents/api/v1/kickasstorrents", kickassTorrents);
app.use("/torrents/api/v1/thepiratebay", thePirateBay);
app.use("/torrents/api/v1/glotorrents", gloTorrents);
app.use("/torrents/api/v1/limetorrents", limeTorrents);
app.use("/torrents/api/v1/pirateiro", pirateiro);
app.use("/torrents/api/v1/nyaa", nyaa);
app.use("/torrents/api/v1/anidex", anidex);
app.use("/torrents/api/v1/yts", yts);
app.use("/torrents/api/v1/pcgamestor", PCGAMES);

app.get("*", (req, res) => {
  res.status(405).send({
    method: req.method,
    error: "Method Not Allowed",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

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

const bitsearch = require("./api/routes/bitSearch/bitsearch");
const knaben = require("./api/routes/knaben/knaben");
const torlock = require("./api/routes/torlock/torlock");
const torrentGalaxy = require("./api/routes/torrentGalaxy/torrentGalaxy");
const zooqle = require("./api/routes/zooqle/zooqle");
const magnetdl = require("./api/routes/magnetDL/magnetDL");
const thePirateBay = require("./api/routes/thePirateBay/thePirateBay");
const pirateiro = require("./api/routes/pirateiro/pirateiro");
const gloTorrents = require("./api/routes/gloTorrents/gloTorrents");
const limeTorrents = require("./api/routes/limeTorrents/limeTorrents");
const nyaa = require("./api/routes/nyaa/nyaa");
const anidex = require("./api/routes/anidex/anidex");
const animeTosho = require("./api/routes/animeTosho/animeTosho");
const torrentz2 = require("./api/routes/torrentz2/torrentz2");
const gkTorrent = require("./api/routes/gkTorrent/gkTorrent");
const linuxTracker = require("./api/routes/linuxTracker/linuxTracker");
const search = require("./api/routes/searchDB");

// Use routes
app.use("/torrents/api/v1/bitsearch", bitsearch);
app.use("/torrents/api/v1/knaben", knaben);
app.use("/torrents/api/v1/torlock", torlock);
app.use("/torrents/api/v1/torrentgalaxy", torrentGalaxy);
app.use("/torrents/api/v1/zooqle", zooqle);
app.use("/torrents/api/v1/magnetdl", magnetdl);
app.use("/torrents/api/v1/thepiratebay", thePirateBay);
app.use("/torrents/api/v1/pirateiro", pirateiro);
app.use("/torrents/api/v1/glotorrents", gloTorrents);
app.use("/torrents/api/v1/limetorrents", limeTorrents);
app.use("/torrents/api/v1/nyaa", nyaa);
app.use("/torrents/api/v1/anidex", anidex);
app.use("/torrents/api/v1/animetosho", animeTosho);
app.use("/torrents/api/v1/torrentz2", torrentz2);
app.use("/torrents/api/v1/gktorrent", gkTorrent);
app.use("/torrents/api/v1/linuxtracker", linuxTracker);
app.use("/search", search);

app.get("*", (req, res) => {
  res.status(403).send({
    error: `Method ${req.method} not allowed`
  });
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

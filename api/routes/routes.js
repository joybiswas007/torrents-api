const router = require("express").Router();

const one337x = require("./one337x/one337x");
const bitsearch = require("./bitSearch/bitsearch");
const knaben = require("./knaben/knaben");
const torlock = require("./torlock/torlock");
const torrentGalaxy = require("./torrentGalaxy/torrentGalaxy");
const zooqle = require("./zooqle/zooqle");
const magnetdl = require("./magnetDL/magnetDL");
const thePirateBay = require("./thePirateBay/thePirateBay");
const pirateiro = require("./pirateiro/pirateiro");
const gloTorrents = require("./gloTorrents/gloTorrents");
const limeTorrents = require("./limeTorrents/limeTorrents");
const nyaa = require("./nyaa/nyaa");
const anidex = require("./anidex/anidex");
const animeTosho = require("./animeTosho/animeTosho");
const torrentz2 = require("./torrentz2/torrentz2");
const gkTorrent = require("./gkTorrent/gkTorrent");
const linuxTracker = require("./linuxTracker/linuxTracker");
const rutor = require("./rutor/rutor");

// Grouping the routes
router.use("/1337x", one337x);
router.use("/bitsearch", bitsearch);
router.use("/knaben", knaben);
router.use("/torlock", torlock);
router.use("/torrentgalaxy", torrentGalaxy);
router.use("/zooqle", zooqle);
router.use("/magnetdl", magnetdl);
router.use("/thepiratebay", thePirateBay);
router.use("/pirateiro", pirateiro);
router.use("/glotorrents", gloTorrents);
router.use("/limetorrents", limeTorrents);
router.use("/nyaa", nyaa);
router.use("/anidex", anidex);
router.use("/animetosho", animeTosho);
router.use("/torrentz2", torrentz2);
router.use("/gktorrent", gkTorrent);
router.use("/linuxtracker", linuxTracker);
router.use("/rutor", rutor);

module.exports = router;
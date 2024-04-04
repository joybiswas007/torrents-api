const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const scrapeTorrent = require("./scrapeTorrent");
const headers = require("./headers");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const { TORRENT_GALAXY } = process.env;
    const { search } = req.body;
    const response = await axios.get(`${TORRENT_GALAXY}/torrents.php`, {
      params: {
        search,
        lang: 0,
        nox: 2
      },
      headers
    });
    const $ = cheerio.load(response.data);
    const torrentTable = $(".tgxtable");
    console.log(torrentTable.html());
    const torrents = [];
    for (const torrent of torrentTable.find(".tgxtablerow")) {
      const torrentDetails = scrapeTorrent(torrent, $);
      torrents.push(torrentDetails);
    }
    filterTorrents(res, torrents);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

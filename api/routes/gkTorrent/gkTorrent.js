const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const scrapeTorrent = require("./scrapeTorrent");
const headers = require("../../utils/headers");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const { GK_TORRENT } = process.env;
    const { search } = req.body;
    const encodedSearchString = encodeURIComponent(search);
    const searchUrl = `${GK_TORRENT}/recherche/${encodedSearchString}`;

    const response = await axios.get(searchUrl, { headers });
    const $ = cheerio.load(response.data);
    const $element = $("table tbody");
    const torrents = [];
    for (const torrent of $element.find("tr")) {
      const torrentDetails = await scrapeTorrent(torrent, $);
      torrents.push(torrentDetails);
    }
    filterTorrents(res, torrents);
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

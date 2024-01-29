const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const headers = require("../../utils/headers");
const scrapeTorrent = require("./scrapeTorrent");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const { LIME_TORRENTS } = process.env;
    const { search } = req.body;
    const searchUrl = `${LIME_TORRENTS}/search/all/${search}/`;
    const response = await axios.get(searchUrl, headers);
    const $ = cheerio.load(response.data);
    const $element = $(".table2 tbody");
    const torrents = [];
    for (const torrent of $element.find("tr:not(:first-child)")) {
      const torrentDeatils = await scrapeTorrent(LIME_TORRENTS, torrent, $);
      torrents.push(torrentDeatils);
    }
    filterTorrents(res, torrents);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

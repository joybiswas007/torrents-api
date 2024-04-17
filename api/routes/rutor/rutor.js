const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const scrapeTorrent = require("./scrapeTorrent");
const headers = require("../../utils/headers");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const { RUTOR } = process.env;
    const { search } = req.body;
    const response = await axios.get(`${RUTOR}/search/0/0/010/0/${search}`, {
      headers
    });
    const $ = cheerio.load(response.data);
    const $element = $("#index");
    const torrents = [];
    for (const torrent of $element.find("table tbody tr:not(:first-child)")) {
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

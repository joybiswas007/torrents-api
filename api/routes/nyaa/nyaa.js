const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../filterTorrents");
const headers = require("../../headers");
const scrapeTorrent = require("./scrapeTorrent");
const logger = require("../../../logger");

router.post("/", async (req, res) => {
  try {
    const { NYAA } = process.env;
    const { search } = req.body;
    const searchUrl = `${NYAA}/?q=${search}&f=0&c=0_0`;
    const response = await axios.get(searchUrl, headers);
    const $ = cheerio.load(response.data);
    const $element = $("table tbody");
    const torrents = [];
    for (const torrent of $element.find("tr")) {
      const torrentDetails = scrapeTorrent(NYAA, torrent, $);
      torrents.push(torrentDetails);
    }
    filterTorrents(res, torrents);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

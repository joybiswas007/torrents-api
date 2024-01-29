const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const headers = require("../../utils/headers");
const scrapeTorrent = require("./scrapeTorrent");
const logger = require("../../config/logger");

router.post("/", async (req, res) => {
  try {
    const { TORRENTZ2 } = process.env;
    const { search } = req.body;
    const searchUrl = `${TORRENTZ2}/search?q=${search}`;
    const response = await axios.get(searchUrl, headers);
    const $ = cheerio.load(response.data);
    const $element = $(".results");
    const torrents = [];
    for (const torrent of $element.find("dl")) {
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

const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const scrapeTorrent = require("./scrapeTorrent");
const headers = require("./headers");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const { search } = req.body;
    const { ONE337X } = process.env;
    const searchUrl = `${ONE337X}/search/${search}/1/`;
    const response = await axios.get(searchUrl, headers);
    const $ = cheerio.load(response.data);
    const torrents = [];
    const torrentTable = $(".table-list tbody tr");
    for (let i = 0; i < torrentTable.length; i++) {
      const tr = torrentTable[i];
      const torrentDetails = await scrapeTorrent(tr, $);
      torrents.push(torrentDetails);
    }

    filterTorrents(res, torrents);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

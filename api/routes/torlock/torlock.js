const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const headers = require("../../utils/headers");
const scrapeTorrent = require("./scrapeTorrent");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const startTime = new Date();
    const { TOR_LOCK } = process.env;
    const { search } = req.body;
    const response = await axios.get(`${TOR_LOCK}/`, {
      params: {
        qq: "1",
        q: search
      },
      headers
    });

    const $ = cheerio.load(response.data);
    const $element = $("article div.table-responsive tbody").last();
    const torrents = [];
    for (const torrent of $element.find("tr")) {
      const torrentDetails = await scrapeTorrent(torrent, $);
      torrents.push(torrentDetails);
    }
    const endTime = new Date();
    // Time taken in milliseconds
    const timeTaken = endTime - startTime;

    filterTorrents(res, 1, timeTaken, torrents);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ statusCode: 500, error: error.message });
  }
});

module.exports = router;

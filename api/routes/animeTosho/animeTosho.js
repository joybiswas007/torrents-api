const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const scrapeTorrent = require("./scrapeTorrent");
const headers = require("../../utils/headers");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const startTime = new Date();
    const { ANIME_TOSHO } = process.env;
    const { search } = req.body;

    const response = await axios.get(`${ANIME_TOSHO}/search`, {
      params: {
        q: search
      },
      headers
    });
    const $ = cheerio.load(response.data);
    const $element = $("#content");
    const torrents = [];
    for (const torrent of $element.find(".home_list_entry")) {
      const torrentDetails = scrapeTorrent(torrent, $);
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

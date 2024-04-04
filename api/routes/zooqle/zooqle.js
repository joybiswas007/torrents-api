const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const scrapeTorrent = require("./scrapeTorrent");
const headers = require("../../utils/headers");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const { ZOOQLE } = process.env;
    const { search } = req.body;

    const response = await axios.post(
      `${ZOOQLE}/search/`,
      new URLSearchParams({
        q: search
      }),
      {
        headers
      }
    );
    const $ = cheerio.load(response.data);
    const $element = $("section table tbody");
    const torrents = [];
    for (const torrent of $element.find("tr")) {
      const torrentDetails = await scrapeTorrent(torrent, $);
      torrents.push(torrentDetails);
    }

    if (torrents[0].Magnet === undefined) {
      return res.status(404).send({ error: "No magnets found :(" });
    }
    filterTorrents(res, torrents);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

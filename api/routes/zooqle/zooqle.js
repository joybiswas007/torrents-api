const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const scrapeTorrent = require("./scrapeTorrent");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const { ZOOQLE, USER_AGENT } = process.env;
    const { search } = req.body;
    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": USER_AGENT
      }
    };
    const response = await axios.post(
      `${ZOOQLE}/search/`,
      new URLSearchParams({
        q: search
      }),
      headers
    );
    const $ = cheerio.load(response.data);
    const $element = $("section table tbody");
    const torrents = [];
    for (const torrent of $element.find("tr")) {
      const torrentDetails = await scrapeTorrent(ZOOQLE, torrent, $, headers);
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

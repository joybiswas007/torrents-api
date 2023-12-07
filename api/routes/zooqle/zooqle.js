const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../filterTorrents");
const scrapeTorrent = require("./scrapeTorrent");

// eslint-disable-next-line consistent-return
router.post("/", async (req, res) => {
  try {
    const { ZOOQLE, USER_AGENT } = process.env;
    const { search } = req.body;
    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": USER_AGENT,
      },
    };
    const response = await axios.post(
      `${ZOOQLE}/search/`,
      {
        q: search,
      },
      headers,
    );
    const $ = cheerio.load(response.data);
    const $element = $("section table tbody");
    const torrents = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const torrent of $element.find("tr")) {
      // eslint-disable-next-line no-await-in-loop
      const torrentDetails = await scrapeTorrent(ZOOQLE, torrent, $, headers);
      torrents.push(torrentDetails);
    }

    if (torrents[0].Magnet === undefined) {
      return res.status(404).send({ error: "No magnets found :(" });
    }
    filterTorrents(res, torrents);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

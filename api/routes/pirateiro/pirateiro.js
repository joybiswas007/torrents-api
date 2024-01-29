const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const scrapeTorrent = require("./scrapeTorrent");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const { PIRATEIRO, PIRATEIRO_COOKIE, USER_AGENT } = process.env;
    const { search } = req.body;
    const headers = {
      headers: {
        Cookie: PIRATEIRO_COOKIE,
        "User-Agent": USER_AGENT
      }
    };
    const searchUrl = `${PIRATEIRO}/search`;
    const response = await axios.get(searchUrl, {
      params: {
        query: search
      },
      headers
    });
    const $ = cheerio.load(response.data);
    const $element = $("ul");
    const torrents = [];
    for (const torrent of $element.find("a")) {
      const torrentDetails = await scrapeTorrent(torrent, $, headers);
      torrents.push(torrentDetails);
    }
    filterTorrents(res, torrents);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

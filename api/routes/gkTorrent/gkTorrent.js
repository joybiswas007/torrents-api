const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const scrapeTorrent = require("./scrapeTorrent");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const { GK_TORRENT, GK_TORRENT_COOKIE, USER_AGENT } = process.env;
    const { search } = req.body;
    const encodedSearchString = encodeURIComponent(search);
    const searchUrl = `${GK_TORRENT}/recherche/${encodedSearchString}`;
    const headers = {
      headers: {
        Cookie: GK_TORRENT_COOKIE,
        "User-Agent": USER_AGENT
      }
    };
    const response = await axios.get(searchUrl, headers);
    const $ = cheerio.load(response.data);
    const $element = $("table tbody");
    const torrents = [];
    for (const torrent of $element.find("tr")) {
      const torrentDetails = await scrapeTorrent(
        GK_TORRENT,
        torrent,
        $,
        headers
      );
      torrents.push(torrentDetails);
    }
    filterTorrents(res, torrents);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

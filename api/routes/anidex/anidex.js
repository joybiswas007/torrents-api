const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const scrapeTorrent = require("./scrapeTorrent");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const { ANIDEX, ANIDEX_COOKIE, USER_AGENT } = process.env;
    const { search } = req.body;
    const searchUrl = `${ANIDEX}/?page=search&id=0&lang_id=&group_id=0&q=${search}`;
    const response = await axios.get(searchUrl, {
      headers: {
        Cookie: ANIDEX_COOKIE,
        "User-Agent": USER_AGENT
      }
    });
    const $ = cheerio.load(response.data);
    const $element = $("table tbody");
    const torrents = [];
    for (const torrent of $element.find("tr")) {
      const torrentDetails = scrapeTorrent(ANIDEX, torrent, $);
      torrents.push(torrentDetails);
    }
    filterTorrents(res, torrents);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

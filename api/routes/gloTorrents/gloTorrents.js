const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const filterEmptyObjects = require("../../utils/filterEmptyObjects");
const headers = require("../../utils/headers");
const scrapeTorrent = require("./scrapeTorrent");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const { GLO_TORRENTS } = process.env;
    const { search } = req.body;
    const response = await axios.get(`${GLO_TORRENTS}/search_results.php`, {
      params: {
        search,
        incldead: "Search"
      },
      headers
    });
    const $ = cheerio.load(response.data);
    const $element = $(".ttable_headinner tbody");
    const torrents = [];
    for (const torrent of $element.find("tr")) {
      const torrentDetails = scrapeTorrent(torrent, $);
      torrents.push(torrentDetails);
    }
    filterTorrents(res, filterEmptyObjects(torrents));
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

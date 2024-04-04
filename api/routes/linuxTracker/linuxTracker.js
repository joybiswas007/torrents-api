const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const filterEmptyObjects = require("../../utils/filterEmptyObjects");
const scrapeTorrent = require("./scrapeTorrent");
const headers = require("../../utils/headers");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const { LINUX_TRACKER } = process.env;
    const { search } = req.body;
    const response = await axios.get(`${LINUX_TRACKER}/index.php`, {
      params: {
        page: "torrents",
        search,
        category: "0",
        active: "1"
      },
      headers
    });
    const $ = cheerio.load(response.data);
    const $element = $("table").eq(12);
    const torrents = [];
    for (const torrent of $element.find("tr:not(:first-child)")) {
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

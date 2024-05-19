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
    const startTime = new Date();
    const { GLO_TORRENTS } = process.env;
    const { search } = req.body;
    const response = await axios.get(`${GLO_TORRENTS}/search_results.php`, {
      params: {
        search,
        cat: "0",
        incldead: "0",
        inclexternal: "0",
        lang: "0",
        sort: "id",
        order: "desc"
        // page: page > 1 ? page - 1 : page
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
    const endTime = new Date();
    // Time taken in milliseconds
    const timeTaken = endTime - startTime;

    filterTorrents(res, 1, timeTaken, filterEmptyObjects(torrents));
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ statusCode: 500, error: error.message });
  }
});

module.exports = router;

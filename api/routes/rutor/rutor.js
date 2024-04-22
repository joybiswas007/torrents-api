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
    const { RUTOR } = process.env;
    const { page = 0, search } = req.body;
    const response = await axios.get(
      `${RUTOR}/search/${page}/0/010/0/${search}`,
      {
        headers
      }
    );
    const $ = cheerio.load(response.data);
    const $element = $("#index");
    const totalPagesElement = $element.find(
      "table tbody tr:not(:first-child)"
    ).length;
    let pageCount = 1;
    const searchResultsPattern = /Результатов поиска (\d+)/;
    const match = $element.text().match(searchResultsPattern);
    if (match && match[1]) {
      const totalPages = (parseInt(match[1], 10) / totalPagesElement).toFixed();
      pageCount = parseInt(totalPages, 10);
    }
    const torrents = [];
    for (const torrent of $element.find("table tbody tr:not(:first-child)")) {
      const torrentDetails = scrapeTorrent(torrent, $);
      torrents.push(torrentDetails);
    }
    const endTime = new Date();
    // Time taken in milliseconds
    const timeTaken = endTime - startTime;

    filterTorrents(res, pageCount, timeTaken, torrents);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ statusCode: 500, error: error.message });
  }
});

module.exports = router;

const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const headers = require("../../utils/headers");
const scrapeTorrent = require("./scrapeTorrent");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const startTime = new Date();
    const { LIME_TORRENTS } = process.env;
    const { page = 1, search } = req.body;
    const response = await axios.get(
      `${LIME_TORRENTS}/search/all/${search}//${page}/`,
      {
        headers
      }
    );
    const $ = cheerio.load(response.data);
    const totalPagesElement = $(".search_stat a");
    // Array index starts from 0. Depends on the lists length the desired data we need is on index no length - 2 so need to minus 2
    const totalPages = totalPagesElement.length
      ? totalPagesElement.eq(totalPagesElement.length - 2).text()
      : null;
    let pageCount = 1;

    if (totalPages) {
      pageCount = parseInt(totalPages, 10);
    }
    const $element = $(".table2 tbody");
    const torrents = [];
    for (const torrent of $element.find("tr:not(:first-child)")) {
      const torrentDeatils = await scrapeTorrent(torrent, $);
      torrents.push(torrentDeatils);
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

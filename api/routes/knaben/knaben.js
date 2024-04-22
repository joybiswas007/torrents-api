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
    const { KNABEN } = process.env;
    const { page = 1, search } = req.body;
    const response = await axios.get(
      `${KNABEN}/search/${search}/0/${page}/seeders?unsafe=true`,
      {
        headers
      }
    );
    const $ = cheerio.load(response.data);
    const $element = $(".table tbody");
    const totalPagesElement = $(".table caption p").text();
    let pageCount = 1;
    if (totalPagesElement) {
      const totalPages = totalPagesElement.replace("Total hits: ", "").trim();
      pageCount = (totalPages / $element.find("tr").length).toFixed();
      pageCount = parseInt(pageCount, 10);
    }
    const torrents = [];
    for (const torrent of $element.find("tr")) {
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

const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const scrapeTorrent = require("./scrapeTorrent");
const headers = require("./headers");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const startTime = new Date();
    const { page = 1, search } = req.body;
    const { ONE337X } = process.env;
    const searchUrl = `${ONE337X}/search/${search}/${page}/`;
    const response = await axios.get(searchUrl, headers);
    const $ = cheerio.load(response.data);
    const torrents = [];
    const totalPagesElement = $(".pagination ul li.last a");
    const totalPages = totalPagesElement.length
      ? totalPagesElement.attr("href")
      : null;
    let pageCount = 1;

    if (totalPages) {
      pageCount = totalPages.split("/");
      pageCount = parseInt(pageCount[3], 10);
    }

    const torrentTable = $(".table-list tbody tr");
    for (let i = 0; i < torrentTable.length; i++) {
      const tr = torrentTable[i];
      const torrentDetails = await scrapeTorrent(tr, $);
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

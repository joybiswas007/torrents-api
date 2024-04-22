const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const filterEmptyObjects = require("../../utils/filterEmptyObjects");
const headers = require("../../utils/headers");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const startTime = new Date();
    const { BIT_SEARCH } = process.env;
    const { page = 1, search } = req.body;
    const response = await axios.get(`${BIT_SEARCH}/search`, {
      params: {
        q: search,
        page
      },
      headers
    });
    const $ = cheerio.load(response.data);
    const $element = $("li.search-result");
    const totalPages = $(".search-stats span").find("b").eq(0).text();
    let pageCount = 1;
    if (totalPages) {
      pageCount = parseInt(totalPages, 10);
      pageCount = parseInt((pageCount / $element.length).toFixed(), 10);
    }
    const torrents = $element
      .map((i, torrent) => ({
        Name: $(torrent).find("h5 a").text().trim(),
        Size: $(torrent).find('img[alt="Size"]').parent().text().trim(),
        Seeders: parseInt(
          $(torrent).find('img[alt="Seeder"]').parent().text().trim(),
          10
        ),
        Leechers: parseInt(
          $(torrent).find('img[alt="Leecher"]').parent().text().trim(),
          10
        ),
        Url: `${BIT_SEARCH}${$(torrent).find("h5 a").attr("href")}`,
        Magnet: $(torrent).find(".links a.dl-magnet").attr("href")
      }))
      .get();

    const endTime = new Date();
    // Time taken in milliseconds
    const timeTaken = endTime - startTime;

    filterTorrents(res, pageCount, timeTaken, filterEmptyObjects(torrents));
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ statusCode: 500, error: error.message });
  }
});

module.exports = router;

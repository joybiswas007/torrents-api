const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const filterEmptyObjects = require("../../utils/filterEmptyObjects");
const headers = require("../../utils/headers");
const logger = require("../../config/logger");

router.post("/", async (req, res) => {
  try {
    const { BIT_SEARCH } = process.env;
    const { search } = req.body;
    const searchUrl = `${BIT_SEARCH}/search?q=${search}`;
    const response = await axios.get(searchUrl, headers);
    const $ = cheerio.load(response.data);
    const torrents = $("li.search-result")
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
    filterTorrents(res, filterEmptyObjects(torrents));
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

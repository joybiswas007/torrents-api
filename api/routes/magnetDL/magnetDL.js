const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const filterEmptyObjects = require("../../utils/filterEmptyObjects");
const headers = require("./headers");
const scrapeTorrent = require("./scrapeTorrent");
const logger = require("../../configs/logger");

router.post("/", async (req, res) => {
  try {
    const startTime = new Date();
    const { MAGNET_DL } = process.env;
    const { page = 1, search } = req.body;
    /*
    search.toLowerCase().substr(0, 1) was used because with each
    search query magnetdl use 1st letter of the search query to make dynamic route
    and it add '-' if you search for a long query
    Guardians of the Galaxy becomes https://magnetdl.com/g/guardians-of-the-galaxy
    Tenet 2020 becomes https://magnetdl.com/t/tenet-2020/
    */
    const searchUrl = `${MAGNET_DL}/${search
      .toLowerCase()
      .substr(0, 1)}/${search.replace(/\s+/g, "-").toLowerCase()}/${page}/`;
    const response = await axios.get(searchUrl, { headers });
    const $ = cheerio.load(response.data);
    const torrents = [];
    const $element = $(".download tbody");
    const pageCount = 1;
    for (const torrent of $element.find("tr")) {
      const torrrentDetails = scrapeTorrent(torrent, $);
      torrents.push(torrrentDetails);
    }
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

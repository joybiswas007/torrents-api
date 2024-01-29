const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../utils/filterTorrents");
const filterEmptyObjects = require("../../utils/filterEmptyObjects");
const headers = require("../../utils/headers");
const scrapeTorrent = require("./scrapeTorrent");
const logger = require("../../config/logger");

router.post("/", async (req, res) => {
  try {
    const { MAGNET_DL } = process.env;
    const { search } = req.body;
    /*
    search.toLowerCase().substr(0, 1) was used because with each
    search query magnetdl use 1st letter of the search query to make dynamic route
    and it add '-' if you search for a long query
    Guardians of the Galaxy becomes https://magnetdl.com/g/guardians-of-the-galaxy
    Tenet 2020 becomes https://magnetdl.com/t/tenet-2020/
    */
    const searchUrl = `${MAGNET_DL}/${search
      .toLowerCase()
      .substr(0, 1)}/${search.replace(/\s+/g, "-").toLowerCase()}/`;
    const response = await axios.get(searchUrl, headers);
    const $ = cheerio.load(response.data);
    const torrents = [];
    const $element = $(".download tbody");
    for (const torrent of $element.find("tr")) {
      const torrrentDetails = scrapeTorrent(MAGNET_DL, torrent, $);
      torrents.push(torrrentDetails);
    }
    filterTorrents(res, filterEmptyObjects(torrents));
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

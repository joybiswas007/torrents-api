const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../filterTorrents");
const filterEmptyObjects = require("../../filterEmptyObjects");
const headers = require("../../headers");
const scrapeTorrent = require("./scrapeTorrent");

router.post("/", async (req, res) => {
  try {
    const { GLO_TORRENTS } = process.env;
    const { search } = req.body;
    const searchUrl = `${GLO_TORRENTS}/search_results.php?search=${search}&incldead=Search`;
    const response = await axios.get(searchUrl, headers);
    const $ = cheerio.load(response.data);
    const $element = $(".ttable_headinner tbody");
    const torrents = [];
    for (const torrent of $element.find("tr")) {
      const torrentDetails = scrapeTorrent(GLO_TORRENTS, torrent, $);
      torrents.push(torrentDetails);
    }
    filterTorrents(res, filterEmptyObjects(torrents));
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

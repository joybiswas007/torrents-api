const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../filterTorrents");
const headers = require("../../headers");
const scrapeTorrent = require("./scrapeTorrent");

router.post("/", async (req, res) => {
  try {
    const { LIME_TORRENTS } = process.env;
    const { search } = req.body;
    const searchUrl = `${LIME_TORRENTS}/search/all/${search}/`;
    const response = await axios.get(searchUrl, headers);
    const $ = cheerio.load(response.data);
    const $element = $(".table2 tbody");
    const torrents = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const torrent of $element.find("tr:not(:first-child)")) {
      // eslint-disable-next-line no-await-in-loop
      const torrentDeatils = await scrapeTorrent(LIME_TORRENTS, torrent, $);
      torrents.push(torrentDeatils);
    }
    filterTorrents(res, torrents);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

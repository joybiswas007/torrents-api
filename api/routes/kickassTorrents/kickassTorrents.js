const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../filterTorrents");
const headers = require("../../headers");
const scrapeTorrent = require("./scrapeTorrent");
const logger = require("../../../logger");

router.post("/", async (req, res) => {
  try {
    const { KICKASS } = process.env;
    const { search } = req.body;
    const searchUrl = `${KICKASS}/usearch/${search}/`;
    const response = await axios.get(searchUrl, headers);
    const $ = cheerio.load(response.data);
    const $element = $("table.data tbody");
    const torrents = [];
    // Ignore the first tr as we don't need any info from there
    for (const torrent of $element.find("tr:not(.firstr)")) {
      const torrentDetails = await scrapeTorrent(KICKASS, torrent, $);
      torrents.push(torrentDetails);
    }
    filterTorrents(res, torrents);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

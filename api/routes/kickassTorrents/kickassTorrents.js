const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../../filterTorrents");
const headers = require("../../headers");
const scrapeTorrent = require("./scrapeTorrent");

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
    // eslint-disable-next-line no-restricted-syntax
    for (const torrent of $element.find("tr:not(.firstr)")) {
      // eslint-disable-next-line no-await-in-loop
      const torrentDetails = await scrapeTorrent(KICKASS, torrent, $);
      torrents.push(torrentDetails);
    }
    filterTorrents(res, torrents);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

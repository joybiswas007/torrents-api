const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
const headers = require("../headers");

router.post("/", async (req, res) => {
  const { search } = req.body;
  const LIME_TORRENTS = process.env.LIME_TORRENTS;
  try {
    const search_url = `${LIME_TORRENTS}/search/all/${search}/`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    const $element = $(".table2 tbody");
    const torrents = [];
    for (const torrent of $element.find("tr:not(:first-child)")) {
      const Name = $(torrent).find("a").last().text().trim();
      const torrent_url = $(torrent).find("a").last().attr("href");
      const Size = $(torrent).find(".tdnormal").last().text().trim();
      const Seeders = parseInt($(torrent).find(".tdseed").text().trim());
      const Leechers = parseInt($(torrent).find(".tdleech").text().trim());
      //Got to torrent details page and find magnet
      const magnetPage = `${LIME_TORRENTS}${torrent_url}`;
      const magnetLink = await axios.get(magnetPage);
      const magnetData = cheerio.load(magnetLink.data);
      const Magnet = magnetData('a[href^="magnet:?xt=urn:btih"]').attr("href");
      torrents.push({
        Name,
        Size,
        Seeders,
        Leechers,
        Magnet,
      });
    }
    filterTorrents(res, torrents);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

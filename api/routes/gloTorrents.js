const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
const filterEmptyObjects = require("../filterEmptyObjects");
const headers = require("../headers");

router.post("/", async (req, res) => {
  const { search } = req.body;
  try {
    const search_url = `${process.env.GLO_TORRENTS}/search_results.php?search=${search}&incldead=Search`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    const $element = $(".ttable_headinner tbody");
    const torrents = [];
    for (const torrent of $element.find("tr")) {
      const Name = $(torrent).find("a[title]").attr("title");
      const Magnet = $(torrent)
        .find('a[href^="magnet:?xt=urn:btih"]')
        .attr("href");
      const Size = $(torrent).find("td").eq(4).text().trim();
      const Seeders = parseInt($(torrent).find("td").eq(5).text().trim());
      const Leechers = parseInt($(torrent).find("td").eq(6).text().trim());
      torrents.push({
        Name,
        Size,
        Seeders,
        Leechers,
        Magnet,
      });
    }
    filterTorrents(res, filterEmptyObjects(torrents));
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
const filterEmptyObjects = require("../filterEmptyObjects");

router.post("/", async (req, res) => {
  const { search } = req.body;
  const GLO_TORRENTS = process.env.GLO_TORRENTS;
  try {
    const search_url = `${GLO_TORRENTS}/search_results.php?search=${search}&incldead=Search`;
    const response = await axios.get(search_url);
    const $ = cheerio.load(response.data);
    const $element = $(".ttable_headinner tbody");
    let torrents = [];
    for (const torrent of $element.find("tr")) {
      const torrent_name = $(torrent).find("a[title]").attr("title");
      const Magnet = $(torrent)
        .find('a[href^="magnet:?xt=urn:btih"]')
        .attr("href");
      const Size = $(torrent).find("td").eq(4).text().trim();
      const Seeders = $(torrent).find("td").eq(5).text().trim();
      const Leechers = $(torrent).find("td").eq(6).text().trim();
      torrents.push({
        Name: torrent_name,
        Magnet,
        Size,
        Seeders,
        Leechers,
      });
    }
    filterTorrents(res, filterEmptyObjects(torrents));
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");

router.post("/", async (req, res) => {
  const { search } = req.body;
  const NYAA = process.env.NYAA;
  try {
    const search_url = `${NYAA}/?q=${search}&f=0&c=0_0`;
    const response = await axios.get(search_url);
    const $ = cheerio.load(response.data);
    const $element = $("table tbody");
    let torrents = [];
    for (const torrent of $element.find("tr")) {
      const torrent_name = $(torrent).find("a:not(.comments)").text().trim();
      const Magnet = $(torrent)
        .find('a[href^="magnet:?xt=urn:btih"]')
        .attr("href");
      const Size = $(torrent).find("td").eq(3).text().trim();
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
    filterTorrents(res, torrents);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

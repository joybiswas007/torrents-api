const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
const headers = require("../headers");

router.post("/", async (req, res) => {
  const { search } = req.body;
  try {
    const search_url = `${process.env.NYAA}/?q=${search}&f=0&c=0_0`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    const $element = $("table tbody");
    let torrents = [];
    for (const torrent of $element.find("tr")) {
      const Name = $(torrent).find("a:not(.comments)").text().trim();
      const Magnet = $(torrent)
        .find('a[href^="magnet:?xt=urn:btih"]')
        .attr("href");
      const Size = $(torrent).find("td").eq(3).text().trim();
      const Seeders = $(torrent).find("td").eq(5).text().trim();
      const Leechers = $(torrent).find("td").eq(6).text().trim();
      torrents.push({
        Name,
        Magnet,
        Size,
        Seeders,
        Leechers,
      });
    }
    filterTorrents(res, torrents);
  } catch (error) {
    res.status(error.response.status).send({ error: error.message });
  }
});

module.exports = router;

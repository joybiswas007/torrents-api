const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
const headers = require("../headers");

router.post("/", async (req, res) => {
  const { search } = req.body;
  try {
    const search_url = `${process.env.TPB}/search/${search}/1/99/0`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    const $element = $("table tbody");
    const torrents = [];
    for (const torrent of $element.find("tr:not(:last-child)")) {
      const Name = $(torrent).find(".detName .detLink").text().trim();
      const Magnet = $(torrent)
        .find('a[href^="magnet:?xt=urn:btih"]')
        .attr("href");
      const Seeders = parseInt($(torrent).find("td").eq(2).text().trim());
      const Leechers = parseInt($(torrent).find("td").eq(3).text().trim());
      const size_info = $(torrent).find(".detDesc").text().trim();
      const Size = size_info.split(",")[1].replace("Size", "").trim();
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

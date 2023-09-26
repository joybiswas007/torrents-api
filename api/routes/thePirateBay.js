const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterDeadTorrents = require("../filterDeadTorrents");

router.post("/", async (req, res) => {
  const { search } = req.body;
  const TPB = process.env.TPB;
  try {
    const search_url = `${TPB}/search/${search}/1/99/0`;
    const response = await axios.get(search_url);
    const $ = cheerio.load(response.data);
    const $element = $("table tbody");
    let torrents = [];
    for (const torrent of $element.find("tr:not(:last-child)")) {
      const torrent_name = $(torrent).find(".detName .detLink").text().trim();
      const Magnet = $(torrent)
        .find('a[href^="magnet:?xt=urn:btih"]')
        .attr("href");
      const Seeders = $(torrent).find("td").eq(2).text().trim();
      const Leechers = $(torrent).find("td").eq(3).text().trim();
      const size_info = $(torrent).find(".detDesc").text().trim();
      const Size = size_info.split(",")[1].replace("Size", "").trim();
      torrents.push({
        Name: torrent_name,
        Magnet,
        Size,
        Seeders,
        Leechers,
      });
    }

    filterDeadTorrents(res, torrents);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

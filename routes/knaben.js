const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.post("/", async (req, res) => {
  const { search, mode } = req.body;
  const KNABEN = process.env.KNABEN;
  try {
    const search_url = `${KNABEN}/search/index.php?cat=000000000&q=${search}&search=${mode}`;
    const response = await axios.get(search_url);
    const $ = cheerio.load(response.data);
    const $element = $(".table tbody");
    let torrents = [];
    for (const torrent of Array.from($element.find("tr"))) {
      const torrent_name = $(torrent).find(".text-wrap a").text().trim();
      const Magnet = $(torrent).find(".text-wrap a").attr("href");
      const Size = $(torrent).find(".text-nowrap td").eq(2).text();
      const Seeders = $(torrent).find(".text-nowrap td").eq(4).text();
      const Leechers = $(torrent).find(".text-nowrap td").eq(5).text();
      torrents.push({
        Name: torrent_name,
        Magnet,
        Size,
        Seeders,
        Leechers,
      });
    }
    if (torrents.length > 0) {
      res.status(202).send(torrents);
    } else {
      res.status(404).send({ error: "No magnets found :(" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

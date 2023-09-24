const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.post("/", async (req, res) => {
  const { search } = req.body;
  const ONE337X = process.env.ONE337X;
  try {
    const search_url = `${ONE337X}/srch?search=${search}`;
    const response = await axios.get(search_url);
    const $ = cheerio.load(response.data);
    let torrents = [];
    const $torrent_table = $(".table-list tbody tr");

    for (let i = 0; i < $torrent_table.length; i++) {
      const tr = $torrent_table[i];
      const torrent_name = $(tr).find(".coll-1.name a").last().text().trim();
      const url = `${ONE337X}${$(tr)
        .find(".coll-1.name a")
        .last()
        .attr("href")}`;
      const Seeders = $(tr).find(".coll-2.seeds").text().trim();
      const Leechers = $(tr).find(".coll-3.leeches").text().trim();
      const Size = $(tr)
        .find(".coll-4.size")
        .text()
        .trim()
        .replace(Seeders, "");

      const $magnet_url = await axios.get(url);
      const $magnet_data = cheerio.load($magnet_url.data);
      const Magnet = $magnet_data('a[href^="magnet:?xt=urn:btih"]').attr(
        "href"
      );

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

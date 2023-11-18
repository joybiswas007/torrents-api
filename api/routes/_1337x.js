const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
const headers = require("../headers");

router.post("/", async (req, res) => {
  const { search } = req.body;
  const ONE337X = process.env.ONE337X;
  try {
    const search_url = `${ONE337X}/srch?search=${search}`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    let torrents = [];
    const $torrent_table = $(".table-list tbody tr");

    for (let i = 0; i < $torrent_table.length; i++) {
      const tr = $torrent_table[i];
      const Name = $(tr).find(".coll-1.name a").last().text().trim();
      const url = `${ONE337X}${$(tr)
        .find(".coll-1.name a")
        .last()
        .attr("href")}`;
      const Seeders = parseInt($(tr).find(".coll-2.seeds").text().trim());
      const Leechers = parseInt($(tr).find(".coll-3.leeches").text().trim());
      const Size = $(tr)
        .find(".coll-4.size")
        .text()
        .trim()
        .replace(Seeders, "");

      const magnetPage = await axios.get(url);
      const magnetLink = cheerio.load(magnetPage.data);
      const Magnet = magnetLink('a[href^="magnet:?xt=urn:btih"]').attr("href");

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

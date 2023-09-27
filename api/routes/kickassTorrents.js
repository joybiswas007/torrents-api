const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");

router.post("/", async (req, res) => {
  const { search } = req.body;
  const KICKASS = process.env.KICKASS;
  try {
    const search_url = `${KICKASS}/usearch/${search}/`;
    const response = await axios.get(search_url);
    const $ = cheerio.load(response.data);
    const $element = $("table.data tbody");
    let torrents = [];
    //Ignore the first tr as we don't need any info from there
    for (const torrent of $element.find("tr:not(.firstr)")) {
      const torrent_name = $(torrent)
        .find("td .torrentname div a")
        .eq(0)
        .text()
        .trim();
      const torrent_url = $(torrent)
        .find("td .torrentname div a")
        .eq(0)
        .attr("href");
      const Size = $(torrent).find("td").eq(1).text().trim();
      const Seeders = $(torrent).find("td").eq(4).text().trim();
      const Leechers = $(torrent).find("td").eq(5).text().trim();
      const $magnet_url = await axios.get(`${KICKASS}${torrent_url}`);
      const $magnet = cheerio.load($magnet_url.data);
      const Magnet = $magnet('a[href^="magnet:?xt=urn:btih"]').attr("href");
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

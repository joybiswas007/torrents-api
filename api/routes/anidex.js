const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");

router.post("/", async (req, res) => {
  const { search } = req.body;
  try {
    const search_url = `${process.env.ANIDEX}/?page=search&id=0&lang_id=&group_id=0&q=${search}`;
    const response = await axios.get(search_url, {
      headers: {
        Cookie: process.env.ANIDEX_COOKIE,
        "User-Agent": process.env.USER_AGENT,
      },
    });
    const $ = cheerio.load(response.data);
    const $element = $("table tbody");
    const torrents = [];
    for (const torrent of $element.find("tr")) {
      const Name = $(torrent).find(".torrent .span-1440").attr("title");
      const Magnet = $(torrent)
        .find('a[href^="magnet:?xt=urn:btih"]')
        .attr("href");
      const Size = $(torrent).find("td").eq(6).text().trim();
      const Seeders = parseInt($(torrent).find("td").eq(8).text().trim());
      const Leechers = parseInt($(torrent).find("td").eq(9).text().trim());
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

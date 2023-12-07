const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
const headers = require("../headers");

router.post("/", async (req, res) => {
  const { search } = req.body;
  const TOKYO_TOSHOKAN = process.env.TOKYO_TOSHOKAN;
  try {
    const search_url = `${TOKYO_TOSHOKAN}/rss.php?terms=${search}&type=0&searchName=true&size_min=&size_max=&username=`;
    const response = await axios.get(search_url);
    const $ = cheerio.load(response.data, {
      xmlMode: true,
      normalizeWhitespace: true,
      decodeEntities: false,
    });
    const torrents = [];
    const elements = $("channel");
    for (const element of elements.find("item")) {
      const Name = $(element).find("title").text();
      const description = $(element).find("description").text();
      const links = cheerio.load(description);
      const Magnet = links("a").eq(1).attr("href");
      const link = links("a").eq(2).attr("href");
      const info = await axios.get(link, headers);
      const $SL = cheerio.load(info.data);
      const Size = $SL("li.detailsright").eq(4).text();
      const Seeders = $SL("li.detailsright").eq(9).text();
      const Leechers = $SL("li.detailsright").eq(10).text();
      if (
        Seeders !== "Torrent not authorized or does not exist" &&
        Leechers !== "Torrent not authorized or does not exist" &&
        Seeders !== "/scrape timed out (5s) or refused" &&
        Leechers !== "/scrape timed out (5s) or refused"
      ) {
        torrents.push({
          Name,
          Size,
          Seeders: parseInt(Seeders),
          Leechers: parseInt(Leechers),
          Magnet,
        });
      }
    }
    filterTorrents(res, torrents);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

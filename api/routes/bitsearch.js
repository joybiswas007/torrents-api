const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
const headers = require("../headers");

router.post("/", async (req, res) => {
  const { search } = req.body;
  try {
    const search_url = `${process.env.BIT_SEARCH}/search?q=${search}`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    const torrents = $("li.search-result")
      .map((i, torrent) => ({
        Name: $(torrent).find("h5").text().trim(),
        Size: $(torrent).find('img[alt="Size"]').parent().text().trim(),
        Seeders: parseInt(
          $(torrent).find('img[alt="Seeder"]').parent().text().trim()
        ),
        Leechers: parseInt(
          $(torrent).find('img[alt="Leecher"]').parent().text().trim()
        ),
        Magnet: $(torrent).find(".links a.dl-magnet").attr("href"),
      }))
      .get();
    filterTorrents(res, torrents);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

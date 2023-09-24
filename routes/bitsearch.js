const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.post("/", async (req, res) => {
  const { search } = req.body;
  try {
    const search_url = `${process.env.BITSEARCH}/search?q=${search}`;
    const response = await axios.get(search_url);
    const $ = cheerio.load(response.data);

    //cheking for total search results. Every page has 20 parents.
    const stats = parseInt($(".search-stats b").text().trim());
    let torrents = [];
    let totalPage;

    //If search page has less than or equal 20 torrents then it'll look for first page only
    if (stats <= 20) {
      totalPage = 1;
      //else search result is more than 20 then divide the total result by 20 and get the total pagination
    } else {
      totalPage = Math.floor(stats / 20);
    }

    for (let page = 1; page <= totalPage; page++) {
      //Go through all pages
      const pageUrl = `${search_url}&page=${page}`;
      const $torrents = await axios.get(pageUrl);
      const $torrents_data = cheerio.load($torrents.data);
      const $search = $torrents_data("li.search-result");
      //for every torrents find specific information
      for (let i = 0; i < $search.length; i++) {
        const torrent = $search[i];
        const torrent_name = $(torrent).find("h5").text().trim();
        const magnet = $(torrent).find(".links a.dl-magnet").attr("href");
        const size = $(torrent).find('img[alt="Size"]').parent().text().trim();
        const seeders = $(torrent)
          .find('img[alt="Seeder"]')
          .parent()
          .text()
          .trim();
        const leechers = $(torrent)
          .find('img[alt="Leecher"]')
          .parent()
          .text()
          .trim();
        torrents.push({
          torrent_name,
          magnet,
          size,
          seeders,
          leechers,
        });
      }
    }
    if (torrents.length > 0) {
      res.status(202).send(torrents);
    } else {
      res.status(404).send("No magnets found :(");
    }
  } catch (error) {
    res.status(500).send({ error: "Something went wrong. Please try again!" });
  }
});

module.exports = router;

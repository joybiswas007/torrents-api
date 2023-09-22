const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.post("/", async (req, res) => {
  const { search } = req.body;
  try {
    const search_url = `${process.env._1337x}${search}`;
    const response = await axios.get(search_url);
    const $ = cheerio.load(response.data);

    //find if search results are in multiple pages
    const lastPage = $(".pagination ul li.last").find("a").attr("href");
    let totalPages = 1;

    //check if search result has one page
    if (lastPage) {
      totalPages = parseInt(lastPage.split("/")[3]);
    }
    let torrents = [];

    for (let page = 1; page <= totalPages; page++) {
      const pageUrl = `${process.env._1337X_URL}/search/${search}/${page}/`;
      const pageResponse = await axios.get(pageUrl);
      const $page = cheerio.load(pageResponse.data);
      const $torrent_table = $page(".table-list tbody tr");

      for (let i = 0; i < $torrent_table.length; i++) {
        const tr = $torrent_table[i];
        const torrent_name = $(tr).find(".coll-1.name a").last().text().trim();
        const url = `${process.env._1337X_URL}${$(tr)
          .find(".coll-1.name a")
          .last()
          .attr("href")}`;
        const seeds = $(tr).find(".coll-2.seeds").text().trim();
        const leeches = $(tr).find(".coll-3.leeches").text().trim();
        const size = $(tr)
          .find(".coll-4.size")
          .text()
          .trim()
          .replace(seeds, "");

        const $magnet_url = await axios.get(url);
        const $magnet_data = cheerio.load($magnet_url.data);
        const magnet = $magnet_data('a[href^="magnet:?xt=urn:btih"]').attr(
          "href"
        );

        torrents.push({
          torrent_name,
          magnet,
          url,
          seeds,
          leeches,
          size,
        });
      }
    }

    if (torrents.length > 0) {
      res.status(200).send(torrents);
    } else {
      res.status(404).send("No Torrent(s) Found!");
    }
  } catch (error) {
    console.log(error.error);
    res.status(500).send(error.errors);
  }
});

module.exports = router;

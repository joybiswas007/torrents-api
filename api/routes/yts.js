const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.post("/", async (req, res) => {
  const { search } = req.body;
  const YTS = process.env.YTS;
  let torrents = [];
  try {
    const search_url = `${YTS}/api/v2/list_movies.json?query_term=${search}`;
    const response = await axios.get(search_url);
    //Check if api gives any movie(s) in return if not then stop executing else execute rest of the code
    if (response.data.data.movie_count === 0) {
      return res.status(404).send({ error: "No magnets found :(" });
    }
    //Get only the torrent url from the array and map it
    const urls = response.data.data.movies.map((movie) => movie.url);
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const movie = await axios.get(url);
      const $ = cheerio.load(movie.data);
      const $element = $(".modal-download .modal-torrent");
      for (let i = 0; i < $element.length; i++) {
        const torrent = $element[i];
        const Resolution = $(torrent).find(".modal-quality").text().trim();
        const Medium = $(torrent).find(".quality-size").eq(0).text().trim();
        const Size = $(torrent).find(".quality-size").eq(1).text().trim();
        const Magnet = $(torrent)
          .find('a[href^="magnet:?xt=urn:btih"]')
          .attr("href");
        const hash = $(torrent)
          .find(".button-green-download2-big")
          .attr("href")
          .replace(`${YTS}/torrent/download/`, "")
          .trim();
        torrents.push({
          Magnet,
          Size,
          Resolution,
          Medium,
          hash,
        });
      }
    }
    res.status(202).send(torrents);
  } catch (error) {
    res.status(error.response.status).send({ error: error.message });
  }
});

module.exports = router;

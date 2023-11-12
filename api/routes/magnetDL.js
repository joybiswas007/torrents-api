const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const filterTorrents = require("../filterTorrents");
const filterEmptyObjects = require("../filterEmptyObjects");
const headers = require("../headers");

router.post("/", async (req, res) => {
  const { search } = req.body;
  try {
    /* 
    search.toLowerCase().substr(0, 1) was used because with each
    search query magnetdl use 1st letter of the search query to make dynamic route
    and it add '-' if you search for a long query
    Guardians of the Galaxy becomes https://magnetdl.com/g/guardians-of-the-galaxy
    Tenet 2020 becomes https://magnetdl.com/t/tenet-2020/
    */
    const search_url = `${process.env.MAGNET_DL}/${search
      .toLowerCase()
      .substr(0, 1)}/${search.replace(/\s+/g, "-").toLowerCase()}/`;
    const response = await axios.get(search_url, headers);
    const $ = cheerio.load(response.data);
    let torrents = [];
    const $element = $(".download tbody");
    for (const magnet of $element.find("tr")) {
      const Name = $(magnet).find(".n a").attr("title");
      const Magnet = $(magnet).find(".m a").attr("href");
      const Size = $(magnet).find("td").eq(5).text().trim();
      const Seeders = $(magnet).find("td").eq(6).text().trim();
      const Leechers = $(magnet).find("td").eq(7).text().trim();

      torrents.push({
        Name,
        Magnet,
        Size,
        Seeders,
        Leechers,
      });
    }
    filterTorrents(res, filterEmptyObjects(torrents));
  } catch (error) {
    res.status(error.response.status).send({ error: error.message });
  }
});

module.exports = router;

const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.post("/", async (req, res) => {
  const { search } = req.body;
  const MAGNET_DL = process.env.MAGNET_DL;
  try {
    /* 
    search.toLowerCase().substr(0, 1) was used because with each
    search query magnetdl use 1st letter of the search query to make dynamic route
    and it add '-' if you search for a long query
    Guardians of the Galaxy becomes https://magnetdl.com/g/guardians-of-the-galaxy
    Tenet 2020 becomes https://magnetdl.com/t/tenet-2020/
    */
    const search_url = `${MAGNET_DL}/${search
      .toLowerCase()
      .substr(0, 1)}/${search.replace(/\s+/g, "-").toLowerCase()}/`;
    const response = await axios.get(search_url);
    const $ = cheerio.load(response.data);
    let torrents = [];
    const $element = $(".download tbody");
    for (const magnet of $element.find("tr")) {
      const torrent_name = $(magnet).find(".n a").attr("title");
      const Magnet = $(magnet).find(".m a").attr("href");
      const Size = $(magnet).find("td").eq(5).text().trim();
      const Seeders = $(magnet).find("td").eq(6).text().trim();
      const Leechers = $(magnet).find("td").eq(7).text().trim();

      torrents.push({
        Name: torrent_name,
        Magnet,
        Size,
        Seeders,
        Leechers,
      });
    }

    //Filter torrents array and remove empty objects
    const filteredTorrents = torrents.filter((torrent) => {
      return (
        torrent.Name !== undefined &&
        torrent.Name !== "" &&
        torrent.Magnet !== undefined &&
        torrent.Magnet !== "" &&
        torrent.Size !== undefined &&
        torrent.Size !== "" &&
        torrent.Seeders !== undefined &&
        torrent.Seeders !== "" &&
        torrent.Leechers !== undefined &&
        torrent.Leechers !== ""
      );
    });

    if (filteredTorrents.length > 0) {
      res.status(202).send(filteredTorrents);
    } else {
      res.status(404).send({ error: "No magnets found :(" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

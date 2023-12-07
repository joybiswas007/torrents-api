const axios = require("axios");
const cheerio = require("cheerio");

const scrapeTorrent = async (ZOOQLE, torrent, $, headers) => {
  const Name = $(torrent).find("a").text().trim();
  const Size = $(torrent).find("td").eq(1).text()
    .trim();
  const Seeders = parseInt($(torrent).find("td").eq(2).text()
    .trim(), 10);
  const Leechers = parseInt($(torrent).find("td").eq(3).text()
    .trim(), 10);
  const id = $(torrent).find("form input").attr("value");
  const page = await axios.post(`${ZOOQLE}/torrent-page/`, { id }, headers);
  const magnetLink = cheerio.load(page.data);
  const Magnet = magnetLink("a[href^=\"magnet:?xt=urn:btih\"]").attr("href");

  return {
    Name,
    Size,
    Seeders,
    Leechers,
    Magnet,
  };
};

module.exports = scrapeTorrent;

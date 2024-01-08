const axios = require("axios");
const cheerio = require("cheerio");

const scrapeTorrent = async (KICKASS, torrent, $) => {
  const Name = $(torrent).find("td .torrentname div a").eq(0).text().trim();
  const torrentUrl = $(torrent)
    .find("td .torrentname div a")
    .eq(0)
    .attr("href");
  const Size = $(torrent).find("td").eq(1).text().trim();
  const Seeders = parseInt($(torrent).find("td").eq(4).text().trim(), 10);
  const Leechers = parseInt($(torrent).find("td").eq(5).text().trim(), 10);
  const Url = `${KICKASS}${torrentUrl}`;
  const magnetPage = await axios.get(Url);
  const magnetLink = cheerio.load(magnetPage.data);
  const Magnet = magnetLink('a[href^="magnet:?xt=urn:btih"]').attr("href");
  return {
    Name,
    Size,
    Seeders,
    Leechers,
    Url,
    Magnet
  };
};

module.exports = scrapeTorrent;

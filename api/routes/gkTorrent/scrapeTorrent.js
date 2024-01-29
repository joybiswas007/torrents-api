const axios = require("axios");
const cheerio = require("cheerio");

const scrapeTorrent = async (GK_TORRENT, torrent, $, headers) => {
  const findUrl = $(torrent).find(".liste-accueil-nom a").attr("href");
  const Url = `${GK_TORRENT}${findUrl}`;
  const Name = $(torrent).find(".liste-accueil-nom").text();
  const Size = $(torrent).find(".liste-accueil-taille").text().trim();
  const Seeders = parseInt(
    $(torrent).find(".liste-accueil-sources").text().trim(),
    10
  );
  const Leechers = parseInt(
    $(torrent).find(".liste-accueil-clients").text().trim(),
    10
  );
  const page = await axios.get(Url, headers);
  const magnetData = cheerio.load(page.data);
  const Magnet = magnetData(".btn-magnet a").attr("href");
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

const { TORRENT_GALAXY } = process.env;

const scrapeTorrent = (torrent, $) => {
  const Name = $(torrent).find("a").eq(1).attr("title");
  const Magnet = $(torrent).find('a[href^="magnet:"]').attr("href");
  const Size = $(torrent).find("table tbody tr td span").eq(2).text().trim();
  const SL = $(torrent).find("table tbody tr td").eq(3);
  const Seeders = parseInt($(SL).find("b").eq(0).text().trim(), 10);
  const Leechers = parseInt($(SL).find("b").eq(1).text().trim(), 10);
  const findUrl = $(torrent).find("a").eq(1).attr("href");
  const Url = `${TORRENT_GALAXY}${findUrl}`;
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

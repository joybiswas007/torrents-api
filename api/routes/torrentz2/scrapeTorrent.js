const scrapeTorrent = (torrent, $) => {
  const Name = $(torrent).find("dt a").text().trim();
  const Magnet = $(torrent).find("dd a").attr("href");
  const Size = $(torrent).find("dd span").eq(2).text()
    .trim();
  const Seeders = parseInt($(torrent).find("dd span").eq(3).text()
    .trim(), 10);
  const Leechers = parseInt($(torrent).find("dd span").eq(4).text()
    .trim(), 10);
  return {
    Name,
    Size,
    Seeders,
    Leechers,
    Magnet,
  };
};

module.exports = scrapeTorrent;

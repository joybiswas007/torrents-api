const { MAGNET_DL } = process.env;

const scrapeTorrent = (torrent, $) => {
  const Name = $(torrent).find(".n a").attr("title");
  const findUrl = $(torrent).find(".n a").attr("href");
  const Url = `${MAGNET_DL}${findUrl}`;
  const Magnet = $(torrent).find(".m a").attr("href");
  const Size = $(torrent).find("td").eq(5).text().trim();
  const Seeders = parseInt($(torrent).find("td").eq(6).text().trim(), 10);
  const Leechers = parseInt($(torrent).find("td").eq(7).text().trim(), 10);

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

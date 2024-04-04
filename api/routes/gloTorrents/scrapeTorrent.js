const { GLO_TORRENTS } = process.env;

const scrapeTorrent = (torrent, $) => {
  const Name = $(torrent).find("td").eq(1).find("a").eq(1).attr("title");
  const Magnet = $(torrent).find('a[href^="magnet:?xt=urn:btih"]').attr("href");
  const Size = $(torrent).find("td").eq(4).text().trim();
  const Seeders = parseInt($(torrent).find("td").eq(5).text().trim(), 10);
  const Leechers = parseInt($(torrent).find("td").eq(6).text().trim(), 10);
  const findUrl = $(torrent).find("td").eq(1).find("a").eq(1).attr("href");
  let Url = "";
  if (findUrl !== undefined) {
    Url = `${GLO_TORRENTS}${findUrl}`;
  }
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

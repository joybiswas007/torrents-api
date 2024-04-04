const { ANIDEX } = process.env;

const scrapeTorrent = (torrent, $) => {
  const findUrl = $(torrent).find(".torrent").attr("href");
  const Url = `${ANIDEX}${findUrl}`;
  const Name = $(torrent).find(".torrent .span-1440").attr("title");
  const Magnet = $(torrent).find('a[href^="magnet:?xt=urn:btih"]').attr("href");
  const Size = $(torrent).find("td").eq(6).text().trim();
  const Seeders = parseInt($(torrent).find("td").eq(8).text().trim(), 10);
  const Leechers = parseInt($(torrent).find("td").eq(9).text().trim(), 10);
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

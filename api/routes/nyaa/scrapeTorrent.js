const scrapeTorrent = (NYAA, torrent, $) => {
  const Name = $(torrent)
    .find("td")
    .eq(1)
    .find("a:not(.comments)")
    .text()
    .trim();
  const Magnet = $(torrent).find('a[href^="magnet:?xt=urn:btih"]').attr("href");
  const Size = $(torrent).find("td").eq(3).text().trim();
  const Seeders = parseInt($(torrent).find("td").eq(5).text().trim(), 10);
  const Leechers = parseInt($(torrent).find("td").eq(6).text().trim(), 10);
  const findUrl = $(torrent)
    .find("td")
    .eq(1)
    .find("a:not(.comments)")
    .attr("href");
  const Url = `${NYAA}${findUrl}`;
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

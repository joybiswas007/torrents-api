const { RUTOR } = process.env;

const scrapeTorrent = (torrent, $) => {
  const Name = $(torrent).find("td").eq(1).find("a").eq(2).text().trim();
  const torrentUrl = $(torrent).find("td").eq(1).find("a").eq(2).attr("href");
  const Url = `${RUTOR}${torrentUrl}`;
  const Magnet = $(torrent)
    .find("td")
    .eq(1)
    .find('a[href^="magnet:?xt=urn:btih"]')
    .attr("href");
  let Size;
  const sizeElement = $(torrent).find("td");
  if ($(sizeElement).find('img[alt="C"]').length > 0) {
    Size = $(sizeElement).eq(3).text().trim();
  } else {
    Size = $(sizeElement).eq(2).text().trim();
  }
  const SL = $(torrent).find("td");
  const Seeders = parseInt($(SL).find(".green").text().trim(), 10);
  const Leechers = parseInt($(SL).find(".red").text().trim(), 10);
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

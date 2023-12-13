const scrapeTorrent = (torrent, $) => {
  const Name = $(torrent).find(".detName .detLink").text().trim();
  const Url = $(torrent).find(".detName .detLink").attr("href");
  const Magnet = $(torrent).find("a[href^=\"magnet:?xt=urn:btih\"]").attr("href");
  const Seeders = parseInt($(torrent).find("td").eq(2).text().trim(), 10);
  const Leechers = parseInt($(torrent).find("td").eq(3).text().trim(), 10);
  const sizeInfo = $(torrent).find(".detDesc").text().trim();
  const Size = sizeInfo.split(",")[1].replace("Size", "").trim();
  return {
    Name,
    Size,
    Seeders,
    Leechers,
    Url,
    Magnet,
  };
};

module.exports = scrapeTorrent;

const scrapeTorrent = (torrent, $) => {
  const Name = $(torrent).find(".text-wrap a").text().trim();
  const Magnet = $(torrent).find(".text-wrap a").attr("href");
  const Size = $(torrent).find(".text-nowrap td").eq(2).text();
  const Seeders = parseInt($(torrent).find(".text-nowrap td").eq(4).text(), 10);
  const Leechers = parseInt(
    $(torrent).find(".text-nowrap td").eq(5).text(),
    10,
  );
  const Url = $(torrent).find(".text-nowrap td").eq(6).find("a")
    .attr("href");
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

const scrapeTorrent = (torrent, $) => {
  const Name = $(torrent).find(".link a").text().trim();
  const Url = $(torrent).find(".link a").attr("href");
  const Size = $(torrent).find(".size").text().trim();
  const Magnet = $(torrent).find("a[href^=\"magnet:?xt=urn:btih\"]").attr("href");
  const SL = $(torrent).find("span[style*=\"color: #808080;\"]").text().trim();
  // Regular expression to match numbers and arrows
  const regex = /(\d+)\s*↑\/\s*(\d+)\s*↓/;

  // Match the regular expression against the span content
  const match = SL.match(regex);

  // Extract seeders and leechers
  const Seeders = match ? parseInt(match[1], 10) : 0;
  const Leechers = match ? parseInt(match[2], 10) : 0;

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

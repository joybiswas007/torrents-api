const { PIRATEIRO_COOKIE, USER_AGENT } = process.env;

const headers = {
  "User-Agent": USER_AGENT,
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  DNT: "1",
  "Sec-GPC": "1",
  Connection: "keep-alive",
  Cookie: PIRATEIRO_COOKIE,
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1",
  TE: "trailers"
};

module.exports = headers;

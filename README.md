## Torrents API

Unofficial public torrent trackers API written in Express.js.

## Available routes

| Route                            | Description     | Category |
| -------------------------------- | --------------- | -------- |
| /torrents/api/v1/1337x           | 1337x           | General  |
| /torrents/api/v1/bitsearch       | Bitsearch       | General  |
| /torrents/api/v1/torlock         | Torlock         | General  |
| /torrents/api/v1/knaben          | Knaben          | General  |
| /torrents/api/v1/torrentgalaxy   | TorrentGalaxy   | General  |
| /torrents/api/v1/zooqle          | Zooqle          | General  |
| /torrents/api/v1/magnetdl        | MagnetDL        | General  |
| /torrents/api/v1/kickasstorrents | KickassTorrents | General  |
| /torrents/api/v1/thepiratebay    | The Pirate Bay  | General  |
| /torrents/api/v1/glotorrents     | GloTorrents     | General  |
| /torrents/api/v1/limetorrents    | LimeTorrents    | General  |
| /torrents/api/v1/pirateiro       | Pirateiro       | General  |
| /torrents/api/v1/nyaa            | Nyaa            | Anime    |
| /torrents/api/v1/anidex          | Anidex          | Anime    |
| /torrents/api/v1/animetosho      | Anime Tosho     | Anime    |
| /torrents/api/v1/torrentz2       | Torrentz2       | General  |
| /torrents/api/v1/tokyotoshokan   | TokyoToshokan   | General  |

## Usage

Api doesn't show any dead torrents in search result.

Payload examples:

```
*routes:
method: POST
Content-Type: application/json

{
    "search": "search query"
}

Knaben route payload example:

{
    "search": "search query",
    "mode: "fast" or "live" // Optional
}
```

On Knaben's few search results you'll see
`https://knaben.eu/live/dl/rutracker/?` this types of links
well fret NOT just add them to your client and it'll automatically
starts downloading like other magnet urls.
On the TorrentGalaxy api endpoint you can search query via imdb id or or regular search query.

## Requirements

Navigate to the cloned directory

Install dependencies: `npm install`

Create a `.env` file inside the directory and fill in all the details.

Example `.env` file:

```
PORT=AnyPortYouLike //If NO port is set then port 10000 is used.
USER_AGENT="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
MONGODB_URI="add mongodb uri here"
ONE337X=https://1337x.to
BIT_SEARCH=https://bitsearch.to
KNABEN=https://knaben.eu
TOR_LOCK=https://www.torlock.com
TORRENT_GALAXY=https://torrentgalaxy.mx
TGX_COOKIE="Cookies here"
ZOOQLE=https://zooqle.skin
MAGNET_DL=https://www.magnetdl.com
KICKASS=https://katcr.to
TPB=https://pirateproxy.live
GLO_TORRENTS=https://glodls.to
NYAA=https://nyaa.si
ANIDEX=https://anidex.info
ANIDEX_COOKIE="Cookies here"
LIME_TORRENTS=https://www.limetorrents.lol
PIRATEIRO=https://pirateiro.com
PIRATEIRO_COOKIE="cookies here"
ANIME_TOSHO=https://animetosho.org
TORRENTZ2=https://torrentz2.nz
TOKYO_TOSHOKAN=https://www.tokyotosho.info
```

Added MongoDB support. Make sure to fill `MONGDB_URI`. NO data duplications. If a user 
search for something that is already present in db it won't be saved into db.

Anidex and Pirateiro has some kind of protection enabled. To bypass that
need cookies from their sites. So, visit Anidex and Pirateiro open network tab
search for something and get the Cookie value and save them in .env file.

TorrentGalaxy shows captcha when you search for something. After completing the captcha open
network tab and search for something and grab the Cookie value also make sure Cookie value includes `fencekey`

Use any user-agent you like.

Sites status page:
https://thekickasstorrents.to
https://proxygalaxy.me

### Start server

To run the server locally, use the following command: `npm run dev`
<br>On server: `npm run start`

## Tech Stack

The Torrents API is built using the following technologies:

- Node.js
- Express.js
- Axios
- Cheerio
- dotenv

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

Show your support by starring [⭐️](https://github.com/joybiswas007/torrents-api/stargazers) this project!

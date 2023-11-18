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
| /torrents/api/v1/yts             | yts             | Movie    |
| /torrents/api/v1/pcgamestorrents | PCGamesTorrents | PC Games |
| /torrents/api/v1/animetosho      | Anime Tosho     | Anime    |
| /torrents/api/v1/torrentz2       | Torrentz2       | General  |

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
ONE337X=https://1337x.to
BIT_SEARCH=https://bitsearch.to
KNABEN=https://knaben.eu
TOR_LOCK=https://www.torlock.com
TORRENT_GALAXY=https://torrentgalaxy.mx
ZOOQLE=https://zooqle.skin
MAGNET_DL=https://www.magnetdl.com
KICKASS=https://katcr.to
TPB=https://pirateproxy.live
GLO_TORRENTS=https://glodls.to
NYAA=https://nyaa.si
ANIDEX=https://anidex.info
ANIDEX_COOKIE="Cookies here"
LIME_TORRENTS=https://www.limetorrents.lol
YTS=https://yts.mx
PIRATEIRO=https://pirateiro.com
PC_GAMES_TOR=https://pcgamestorrents.org
PC_GAMES_MAGNET=https://dl.pcgamestorrents.org/get-url.php
ANIME_TOSHO=https://animetosho.org
TORRENTZ2=https://torrentz2.nz
```

Visit Anidex, open the network tab and search for anything
and grab the Cookie value and paste it in the .env file.

Use any user-agent you like.

Sites status page:
https://thekickasstorrents.to
https://proxygalaxy.me

### Start server

To run the server locally, use the following command: `npm run dev`
<br>On server: `npm run start`

PCGamesTorrents, Pirateiro and Anidex requires Puppeteer for scraping.
If you face anykind issue with Puppeteer on linux servers:

```
https://pptr.dev/troubleshooting
https://stackoverflow.com/questions/64361897/puppeteer-not-working-on-vps-but-running-locally

```

## Tech Stack

The Torrents API is built using the following technologies:

- Node.js
- Express.js
- Axios
- Cheerio
- dotenv
- Puppeteer

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

Show your support by starring [⭐️](https://github.com/joybiswas007/torrents-api/stargazers) this project!

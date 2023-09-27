## Torrents API

Unofficial public torrent trackers API written in Express.js.


## Available routes
```
| Route | Description | Category |
|-------|-------------|----------|
| /torrents/api/v1/1337x | 1337x API endpoint | General |
| /torrents/api/v1/bitsearch | Bitsearch API endpoint | General |
| /torrents/api/v1/torlock | Torlock API endpoint | General |
| /torrents/api/v1/knaben | Knaben API endpoint | General |
| /torrents/api/v1/torrentgalaxy | TorrentGalaxy API endpoint | General |
| /torrents/api/v1/pcgamestorrents | PCGamesTorrents API endpoint | PC Games |
| /torrents/api/v1/zooqle | Zooqle API endpoint | General |
| /torrents/api/v1/magnetdl | MagnetDL API endpoint | General |
| /torrents/api/v1/kickasstorrents | KickassTorrents API endpoint | General |
| /torrents/api/v1/thepiratebay | The Pirate Bay API endpoint | Torrent Trackers |
| /torrents/api/v1/glotorrents | GloTorrents API endpoint | General |
| /torrents/api/v1/nyaa | Nyaa API endpoint | Anime |
| /torrents/api/v1/anidex | Anidex API endpoint | Anime |

```


## Usage

Api doesn't show any dead torrents in search.

And request method must be `POST`. and request body should be like this:

```
{
    "search": "search query"
}

Knaben route payload example:

{
    "search": "search query",
    "mode: "fast" or "live"
}
```
Between Fast and Live mode try it out :p
And when searching on knaben on few search results you'll see
`https://knaben.eu/live/dl/rutracker/?` this types of links
well fret NOT just add them to your client and it'll automatically
starts downloading like other magnet urls.

On the TorrentGalaxy api endpoint you can search query via imdb id or or regular search query.

pctorrentsgames api endpoint gives magnet link download page url
cause the cheerio can't click on buttons and that site use ads you
need to grab magnet link manually from the link.

## Requirements

Navigate to the cloned directory

Install dependencies: `npm install`

Create a `.env` file inside the directory and fill in all the details.

Example `.env` file:

```
PORT=PORT //IF NO port is set then default port is 10000
ONE337X=https://1337x.to
BIT_SEARCH=https://bitsearch.to
TOR_LOCK=https://www.torlock.com
KNABEN=https://knaben.eu
TORRENT_GALAXY=https://tgx.rs
PC_GAMES_TORRENTS=https://pcgamestorrents.com
ZOOQLE=https://zooqle.xyz
MAGNET_DL=https://www.magnetdl.com
KICKASS=https://kickasstorrents.to
TPB=https://pirateproxy.live
GLO_TORRENTS=https://www.gtdb.to
NYAA=https://nyaa.si
ANIDEX=https://anidex.info
```

### Start server

To run the server locally, use the following command: `npm run dev`

or if you want to install in the production server then make sure
you've `pm2` installed globally or install `npm install -g pm2`.
then run `npm run deploy`.
check `pm2 logs` for logs.

## Tech Stack

The Torrents API is built using the following technologies:

- Node.js
- Express.js
- Puppeteer
- Cheerio (for web scraping)
- Axios (for making HTTP requests)
- dotenv (for managing environment variables)

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

Show your support by starring [⭐️](https://github.com/joybiswas007/torrents-api/stargazers) this project!

## Torrents API

Unofficial public torrent trackers Api written in Expressjs.

## Available routes

```
http://localhost:10000/torrents/api/v1/1337x
http://localhost:10000/torrents/api/v1/bitsearch
http://localhost:10000/torrents/api/v1/torlock
http://localhost:10000/torrents/api/v1/knaben
http://localhost:10000/torrents/api/v1/torrentgalaxy
http://localhost:10000/torrents/api/v1/pcgamestorrents
http://localhost:10000/torrents/api/v1/zooqle
http://localhost:10000/torrents/api/v1/magnetdl
http://localhost:10000/torrents/api/v1/kickasstorrents
http://localhost:10000/torrents/api/v1/thepiratebay
http://localhost:10000/torrents/api/v1/glotorrents

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
Between Fast and Live mode try it out :p
```

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
```

### Start server

To run the server locally, use the following command: `npm run dev`

or if you want to install in the production server then make sure
you've `pm2` installed globally or install `npm install -g pm2`.
then run `npm run deploy`.
check `pm2 logs` for logs.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

Show your support by [⭐️](https://github.com/joybiswas007/torrents-api/stargazers) this project!

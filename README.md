# Torrents API
A collection of public torrents trackers API written in JavaScript;

## WIP

Lots of more public trackers api will be added soon; Feel free to send pull requests;

## Requirements

Navigate to the cloned directory

Install dependencies: `npm install`

Create a `.env` file inside the directory and fill in all the details.

Example `.env` file:

```
PORT=PORTNUMBER //IF NO port is set then default port is 10000;
_1337X=https://1337x.to
BITSEARCH=https://bitsearch.to
TOR_LOCK=https://www.torlock.com
KNABEN=https://knaben.eu

```

## Usage

To run the api locally, use the following command: `npm run dev`
And request method must be POST; and request body should be like this:

```
{
    "search": "search query"
}

http://localhost:10000/torrents/api/v1/knaben
Knaben route takes two properties

{
    "search": "search query",
    "mode: "fast" or "live"
}

Between Fast and Live mode try it out :p
and when searching on knaben on few search results you'll see `https://knaben.eu/live/dl/rutracker/?` this types of links well fret NOT just add them to your client and it'll automatically starts downloading like other magnet urls;

```

## Available routes

```
http://localhost:10000/torrents/api/v1/1337x
http://localhost:10000/torrents/api/v1/bitsearch
http://localhost:10000/torrents/api/v1/torlock
http://localhost:10000/torrents/api/v1/knaben
```

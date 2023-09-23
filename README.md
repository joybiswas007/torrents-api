# Torrents API
A collection of bunch of public trackers api;

## WIP
Added Knaben but need to be fix other than that all routes work fine;
Lots of more public trackers api will be added soon; Feel free to send pull requests;

## Requirements
Navigate to the cloned directory

Install dependencies: ``` npm install ```

Create a `.env` file inside the directory and fill in all the details.

Example `.env` file:

```
PORT=PORTNUMBER //IF NO port is set then default port is 10000;
_1337X=https://1337x.to
BITSEARCH=https://bitsearch.to
TOR_LOCK=https://www.torlock.com

```

## Usage
To run the api locally, use the following command: ``` npm run dev ```

## Available routes
```
http://localhost:10000/torrents/api/v1/1337x
http://localhost:10000/torrents/api/v1/bitsearch
http://localhost:10000/torrents/api/v1/torlock
http://localhost:10000/torrents/api/v1/knaben
```

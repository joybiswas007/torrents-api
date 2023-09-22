# Torrents API
A collection of bunch of public trackers api;

## WIP
Lots of more public trackers api will be added soon; Feel free to send pull requests;

## Requirements
Navigate to the cloned directory

Install dependencies: ``` npm install ```

Create a `.env` file inside the directory and fill in all the details.

Example `.env` file:

```
PORT=PORTNUMBER //IF NO port is set then default port is 10000;
_1337x=https://1337x.to/srch?search=
_1337X_URL=https://1337x.to

```

## Usage
To run the api, use the following command: ``` npm run dev ```
and navigate to url : `http:(s)//localhost:10000/torrents/api/v1/1337x`
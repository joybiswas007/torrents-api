require("dotenv").config({ path: "../.env" });

const headers = {
  headers: {
    "Content-Type": "text/html",
    "User-Agent": process.env.USER_AGENT
  }
};

module.exports = headers;

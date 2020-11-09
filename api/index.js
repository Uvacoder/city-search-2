const express = require("express");
const { matchSorter } = require("match-sorter");
const cities = require("../cities");

const port = process.env.PORT || 3030;
const app = express();
app.get("/api", allowCors(handler));
app.listen(port, () =>
  console.log(`Server running on ${port}, http://localhost:${port}`)
);

function allowCors(fn) {
  return async function (req, res) {
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }
    return await fn(req, res);
  };
}

function handler(req, res) {
  let queryKeys = getQueryKeys(getRawQuery(req.url));
  if (queryKeys.length < 1) {
    res.json([]);
    return;
  }

  let term = queryKeys[0];
  let results = matchSorter(cities, decodeURIComponent(term), {
    keys: [(item) => `${item.city}, ${item.state}`],
  });
  res.json(results.slice(0, 10));
}

function getRawQuery(url) {
  return url.includes("?") ? url.substring(url.indexOf("?")) : "";
}

function getQueryKeys(queryString) {
  return Array.from(new URLSearchParams(queryString).keys());
}

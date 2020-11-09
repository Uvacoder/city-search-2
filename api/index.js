const express = require("express");
const matchSorter = require("match-sorter");
const cities = require("../cities");

const app = express();
app.get("/api", allowCors(handler));
module.exports = app;

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
  let term = req.url.substr(2, req.url.length - 3);
  let results = matchSorter(cities, decodeURIComponent(term), {
    keys: [(item) => `${item.city}, ${item.state}`],
  });
  res.json(results.slice(0, 10));
}

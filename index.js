const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();
const port = 3000;

app.use(cors());

function getPrice() {
  return fetch("https://api.binance.com/api/v3/ticker/price?symbol=SLPUSDT")
    .then((res) => res.json())
    .then((res) => Number(res.price));
}

app.get("/", async (req, res) => {
  const price = await getPrice();
  const response = await fetch(
    "https://gist.githubusercontent.com/alejoortizd/5673799a736de56bc81ebf7942840670/raw/a5b326ffd64bc7c7f6aeb57c5c0e0ed20be4a5d7/file.txt"
  )
    .then((res) => res.text())
    .then((res) => res.split("\n"))
    .then((res) =>
      res.map((account) => ({
        name: account.split(" ")[0],
        ronin: account.replace(/^.*ronin:/g, "0x"),
      }))
    )
    .then((res) =>
      Promise.all(
        res.map(({ name, ronin }) =>
          fetch(`https://game-api.skymavis.com/game-api/clients/${ronin}/items/1`)
            .then((res) => res.json())
            .then((res) => ({
              name,
              ronin,
              total: res.total,
              last_claimed_item_at: res.last_claimed_item_at,
              usd: res.total * price,
            }))
        )
      )
    )
    .catch(console.log);
  res.json(response);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const express = require("express");
require("dotenv").config();
var cors = require("cors");
const bodyParser = require("body-parser");
var app = express();
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(cors());
const PORT = 8000;

const stripe = require("stripe")(process.env.STRIPE_KEY);
app.post("/create-checkout-session", async (req, res) => {
  const data = req.body.data;
  let amount = data.amount;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Donation",
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}`,
    cancel_url: `${process.env.CLIENT_URL}`,
  });
  console.log(session);
  res.send({ url: session.url });
});

app.listen(PORT, () => {
  console.log("Server is listening at PORT", PORT);
});

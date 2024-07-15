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
  const { products } = req.body;
  // console.log(products);
  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.title,
      },
      unit_amount: product.price * 100,
    },
    quantity: product.count,
  }));
  console.log(lineItems);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}`,
    cancel_url: `${process.env.CLIENT_URL}`,
  });
  res.json({ id: session.id });
});

app.listen(PORT, () => {
  console.log("Server is listening at PORT", PORT);
});

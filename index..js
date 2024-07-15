const express = require("express");
require("dotenv").config();
var cors = require("cors");
const bodyParser = require("body-parser");
var app = express();
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(cors());
const PORT = 8000;

// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqLktLSfEF7GijU1FWPR9V3guf3FZ8RFE",
  authDomain: "fruitybackend-29de7.firebaseapp.com",
  projectId: "fruitybackend-29de7",
  storageBucket: "fruitybackend-29de7.appspot.com",
  messagingSenderId: "722380318409",
  appId: "1:722380318409:web:994cea46666ff2a36ccf18"
};

// Initialize Firebase
const a = initializeApp(firebaseConfig);


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

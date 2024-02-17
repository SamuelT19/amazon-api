const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors({ origin: true }));

app.use(express.json());

const port = process.env.PORT;

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`server listening in port:${port} : http://localhost:4444/`);
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "success",
  });
});
app.post("/payment", async (req, res) => {
  const total = req.query.t;
  if (total > 0) {
    const payment = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });
    console.log(payment);
    res.status(200).json({
      clientSecret: payment.client_secret,
    });
  } else {
    res.status(404).json({
      message: "value must be greater than 0",
    });
  }
});

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public")); // Serve static files from the "public" directory
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  getTotal() {
    let total = 0.0;
    for (const item of this.items) {
      total += item.price;
    }
    return total;
  }

  getItems() {
    return this.items;
  }
}

class Item {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
}

const cart = new ShoppingCart();

app.get("/", (req, res) => {
  const items = cart.getItems();
  res.render("index", { items: items });
});

app.post("/add-to-cart", (req, res) => {
  const name = req.body.name;
  const price = parseFloat(req.body.price);

  const item = new Item(name, price);
  cart.addItem(item);

  res.redirect("/");
});

app.get("/cart", (req, res) => {
  const items = cart.getItems();
  const total = cart.getTotal();
  res.render("cart", { items: items, total: total });
});

app.post("/checkout", (req, res) => {
  const items = cart.getItems();
  // Process payment here and send confirmation email
  // ...
  cart.items = []; // Empty the cart
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

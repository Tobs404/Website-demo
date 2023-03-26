import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
const express = require "express";
const ejs = require "ejs";
const _ = require "lodash";

app.listen(3000, function() {
  console.log("Server started on port 3000");
});


public class AddToCartServlet extends HttpServlet {
    private ShoppingCart cart;

    public AddToCartServlet() {
        cart = new ShoppingCart();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String name = request.getParameter("name");
        double price = Double.parseDouble(request.getParameter("price"));

        Item item = new Item(name, price);
        cart.addItem(item);
         response.sendRedirect("index.html");
    }
}

class ShoppingCart {
    private ArrayList<Item> items;

    public ShoppingCart() {
        items = new ArrayList<Item>();
    }

    public void addItem(Item item) {
        items.add(item);
    }

    public void removeItem(Item item) {
        items.remove(item);
    }

    public double getTotal() {
        double total = 0.0;
        for (Item item : items) {
            total += item.getPrice();
        }
        return total;
    }

    public ArrayList<Item> getItems() {
        return items;
    }
}

class Item {
    private String name;
    private double price;

    public Item(String name, double price) {
        this.name = name;
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }
}

const cart = document.getElementById("shopping-cart");
const cartItems = document.getElementById("cart-items");
const checkoutBtn = document.getElementById("checkout-btn");
const itemCards = document.getElementsByClassName("item-card");

// Initialize the cart and total
let cartTotal = 0.00;
let cartItemsArray = [];

// Add event listeners to all item cards
for (let i = 0; i < itemCards.length; i++) {
  const itemCard = itemCards[i];
  const addToCartBtn = itemCard.getElementsByClassName("add-to-cart-btn")[0];
  const itemName = itemCard.getElementsByTagName("h2")[0].innerText;
  const itemPrice = parseFloat(itemCard.getElementsByClassName("item-price")[0].innerText.replace("$", ""));

  // Add event listener to add-to-cart button
  addToCartBtn.addEventListener("click", () => {
    // Add item to cart
    const item = { name: itemName, price: itemPrice };
    cartItemsArray.push(item);

    // Update cart UI
    const cartItemEl = document.createElement("li");
    cartItemEl.innerText = `${item.name}: $${item.price.toFixed(2)}`;
    cartItems.appendChild(cartItemEl);
    cartTotal += item.price;
    document.getElementById("cart-total").innerText = `Total: $${cartTotal.toFixed(2)}`;

    // Disable button to prevent multiple clicks
    addToCartBtn.disabled = true;
    addToCartBtn.innerText = "Added";
  });
}

// Add event listener to checkout button
checkoutBtn.addEventListener("click", () => {
  // Send cart items to server for checkout
  fetch("/checkout", {
    method: "POST",
    body: JSON.stringify(cartItemsArray),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(() => {
    // Empty cart and update UI
    cartItemsArray = [];
    cartItems.innerHTML = "";
    cartTotal = 0.00;
    document.getElementById("cart-total").innerText = `Total: $${cartTotal.toFixed(2)}`;

    // Re-enable add-to-cart buttons
    for (let i = 0; i < itemCards.length; i++) {
      const addToCartBtn = itemCards[i].getElementsByClassName("add-to-cart-btn")[0];
      addToCartBtn.disabled = false;
      addToCartBtn.innerText = "Add to Cart";
    }

    alert("Thank you for your purchase!");
  }).catch((error) => {
    console.error(error);
    alert("An error occurred during checkout. Please try again.");
  });
});

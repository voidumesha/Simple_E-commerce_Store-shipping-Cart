import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.use(cors());

const PORT = process.env.PORT;
const MONGOURL = process.env.MONGO_URI;

if (!MONGOURL) {
  console.error("MONGO_URI environment variable is not defined.");
  process.exit(1);
}

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Connected to the Database successfully");
    app.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

const productSchema = new mongoose.Schema({
  id: Number,
  image: String,
  title: String,
  price: Number,
  count: { type: Number, default: 1 },
});

const Product = mongoose.model("Product", productSchema);

const orderSchema = new mongoose.Schema({
  items: [
    {
      id: Number,
      title: String,
      price: Number,
      count: Number,
    },
  ],
  total: Number,
  date: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

app.post("/add-to-cart", async (req, res) => {
  const product = req.body;

  try {
    let cartItem = await Product.findOne({ id: product.id });

    if (cartItem) {
      cartItem.count += 1;
      await cartItem.save();
    } else {
      cartItem = new Product(product);
      await cartItem.save();
    }

    res.status(200).send("Product added to cart successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding product to cart");
  }
});

app.put("/increment-item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await Product.findOneAndUpdate(
      { id: parseInt(id) },
      { $inc: { count: 1 } },
      { new: true }
    );
    if (cartItem) {
      res.status(200).json(cartItem);
    } else {
      res.status(404).send("Item not found");
    }
  } catch (error) {
    console.error("Error incrementing item:", error);
    res.status(500).send("Error incrementing item");
  }
});

app.put("/decrement-item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await Product.findOne({ id: parseInt(id) });

    if (cartItem) {
      if (cartItem.count > 1) {
        cartItem.count -= 1;
        await cartItem.save();
        res.status(200).json(cartItem);
      } else {
        await cartItem.deleteOne();
        res
          .status(200)
          .json({ message: "Item removed from cart", id: cartItem.id });
      }
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    console.error("Error decrementing item:", error);
    res.status(500).json({ error: "Error decrementing item" });
  }
});

app.get("/get-cart", async (req, res) => {
  try {
    const cartItems = await Product.find();
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).send("Error fetching cart items");
  }
});

app.post("/place-order", async (req, res) => {
  const { items, total } = req.body;

  if (!items || !total) {
    return res.status(400).send("Invalid order data");
  }

  const order = new Order({
    items,
    total,
  });

  try {
    await order.save();

    await Product.deleteMany({});

    res.status(201).send("Order placed successfully");
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).send("Error placing order");
  }
});

app.delete("/remove-item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await Product.findOneAndRemove({ id: parseInt(id) });

    if (cartItem) {
      res.status(200).json({ message: "Item removed from cart" });
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Error removing item from cart" });
  }
});

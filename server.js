import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URI;

if (!MONGOURL) {
    console.error('MONGO_URI environment variable is not defined.');
    process.exit(1);
}

mongoose.connect(MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to the Database successfully');
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
    count: { type: Number, default: 1 }
});

const Product = mongoose.model('Product', productSchema);

app.post('/add-to-cart', async (req, res) => {
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
  
      res.status(200).send('Product added to cart successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error adding product to cart');
    }
  });


app.put('/increment-item/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await Product.findOneAndUpdate(
      { id: parseInt(id) },
      { $inc: { count: 1 } },
      { new: true }
    );

    if (cartItem) {
      res.status(200).send(cartItem);
    } else {
      res.status(404).send('Item not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error incrementing item');
  }
});
  
app.put('/decrement-item/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const cartItem = await Product.findOneAndUpdate(
        { id: parseInt(id) },
        { $inc: { count: -1 } },
        { new: true }
      );
  
      if (cartItem) {
        if (cartItem.count <= 0) {
          await Product.findOneAndDelete({ id: parseInt(id) });
        }
        res.status(200).send(cartItem);
      } else {
        res.status(404).send('Item not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error decrementing item');
    }
  });
  
app.get('/get-cart', async (req, res) => {
    try {
        const cartItems = await Product.find();
        res.json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).send('Internal Server Error');
    }
});

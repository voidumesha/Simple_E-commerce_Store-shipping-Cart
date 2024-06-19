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
    price: Number
});

const Product = mongoose.model('Product', productSchema);

app.post('/add-to-cart', (req, res) => {
    const product = req.body;
    const newProduct = new Product(product);
    newProduct.save()
        .then(() => res.status(200).json({ message: 'Product added to cart successfully' }))
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error adding product to cart');
        });
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

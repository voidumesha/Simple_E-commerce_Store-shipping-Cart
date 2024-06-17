document.addEventListener('DOMContentLoaded', () => {
    fetch('/products')
        .then(response => response.json())
        .then(products => {
            const productsDiv = document.getElementById('products');
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>Price: $${product.price}</p>
                    <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})">Add to Cart</button>
                `;
                productsDiv.appendChild(productDiv);
            });
        });
});

const cart = [];

function addToCart(id, name, price) {
    const product = { id, name, price, quantity: 1 };
    const existingProduct = cart.find(item => item.id === id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push(product);
    }
    renderCart();
}

function renderCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = '';
    cart.forEach(item => {
        cartDiv.innerHTML += `<p>${item.name} - $${item.price} x ${item.quantity}</p>`;
    });
}

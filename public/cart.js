const product = [
    {
      id: 0,
      image: "image/b1.png",
      title: "Lion King",
      price: 120,
    },
    {
      id: 1,
      image: "image/b2.png",
      title: "banana",
      price: 60,
    },
    {
      id: 2,
      image: "image/b3.png",
      title: "flower",
      price: 230,
    },
    {
      id: 3,
      image: "image/b4.png",
      title: "lemon",
      price: 100,
    },
    {
      id: 4,
      image: "image/b5.png",
      title: "free",
      price: 180,
    },
    {
      id: 5,
      image: "image/b6.png",
      title: "lime",
      price: 190,
    },
    {
      id: 6,
      image: "image/b7.png",
      title: "Hotdog",
      price: 110,
    },
    {
      id: 7,
      image: "image/b8.png",
      title: "familypack",
      price: 200,
    },
    {
      id: 8,
      image: "image/b9.png",
      title: "pen",
      price: 240,
    },
    {
      id: 9,
      image: "image/b10.png",
      title: "memoryCard",
      price: 1200,
    },
    {
      id: 10,
      image: "image/b11.png",
      title: "charger",
      price: 800,
    },
    {
      id: 11,
      image: "image/b12.png",
      title: "phone",
      price: 1660,
    },
  ];
  
  const categories = [...new Set(product.map((item) => item))];
  let i = 0;
  
  document.getElementById("root").innerHTML = product
    .map((item) => {
      const { image, title, price } = item;
      return (
        `<div class='box'>
          <div class='img-box'>
            <img class='images' src=${image}></img>
          </div>
          <div class='bottom'>
            <p>${title}</p>
            <h2>LKR ${price}.00</h2>` +
        `<button onclick='addtocart(${JSON.stringify(item)})'>Add to cart</button>` +
        `</div>
        </div>`
      );
    })
    .join("");
  
  var cart = [];
  
  function showSuccessMessage() {
    const successMessage = document.getElementById("success-message");
    successMessage.innerHTML = "added successfully!";
    successMessage.style.display = "block";
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 3000);
  }
  
  function addtocart(item) {
    fetch('/add-to-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        cart.push(item);
        displaycart();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  function delElement(index) {
    cart.splice(index, 1);
    displaycart();
  }
  
  function displaycart() {
    let total = 0;
    const cartItemElement = document.getElementById("cartItem");
    const totalElement = document.getElementById("total");
    const cartBoxElement = document.querySelector(".cartBox");
  
    if (cart.length === 0) {
      cartItemElement.innerHTML = "Your cart is empty";
      totalElement.textContent = "LKR 0.00";
      cartBoxElement.classList.add("empty");
    } else {
      cartItemElement.innerHTML = cart
        .map((item, index) => {
          const { image, title, price } = item;
          total += price;
          return `
            <div class='cart-item'>
              <div class='row-img'>
                <img class='rowimg' src=${image}>
              </div>
              <p style='font-size:12px;'>${title}</p>
              <h2 style='font-size: 15px;'>LKR ${price}.00</h2>
              <i class='fa-solid fa-trash' onclick='delElement(${index})'></i>
            </div>
          `;
        })
        .join("");
  
      totalElement.textContent = `LKR ${total}.00`;
      cartBoxElement.classList.remove("empty");
    }
  }
  
  function placeOrder() {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
  
    const orderDetails = cart.map(item => ({
      title: item.title,
      count: 1, 
      price: item.price
    }));
  
    const orderData = {
      items: orderDetails,
      total: cart.reduce((sum, item) => sum + item.price, 0),
    };
  
    fetch('/place-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Order placed successfully:', data);
        alert("Order placed successfully!");
        cart = [];
        displaycart();
      })
      .catch((error) => {
        console.error('Error placing order:', error);
        alert("Failed to place order.");
      });
  }
  
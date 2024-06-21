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

function delElement(a) {
  cart.splice(a, 1);
  displaycart();
}

function displaycart() {
  let j = 0, total = 0;
  document.getElementById("count").innerHTML = cart.length;
  if (cart.length === 0) {
    document.getElementById("cartItem").innerHTML = "Your cart is empty";
    document.getElementById("total").innerHTML = "LKR 0.00";
  } else {
    document.getElementById("cartItem").innerHTML = cart
      .map((item) => {
        const { image, title, price } = item;
        total += price;
        return (
          `<div class='cart-item'>
            <div class='row-img'>
              <img class='rowimg' src=${image}>
            </div>
            <p style='font-size:12px;'>${title}</p>
            <h2 style='font-size: 15px;'>LKR ${price}.00</h2>` +
          `<i class='fa-solid fa-trash' onclick='delElement(${j++})'></i></div>`
        );
      })
      .join("");
    document.getElementById("total").innerHTML = `LKR ${total}.00`;
  }
}




import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

//setUp  pages suing usestate

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [page, setPage] = useState("home");


//useEffect
  useEffect(() => {
    axios.get("http://localhost:3000/api/products")
      .then(res => setProducts(res.data.products))
      .catch(err => console.log(err));
  },[]);



//login
  function login(e) {e.preventDefault();
    axios.post("http://localhost:3000/api/auth/login", {
      email: email,
      password: password
    })
    .then(res => {
      setToken(res.data.token);
      alert("Login successful!");
      setPage("home");
    })
    .catch(err => alert("Login failed try again"));
  }

  //cart 
  function addToCart(product) {
    setCart([...cart, product]);
    alert("Product added to cart");
  }
  function placeOrder() {
    axios.post("http://localhost:3000/api/orders", {
      items: cart.map(item => ({product: item._id,quantity: 1})),
      shippingAddress: "My Address", paymentMethod: "COD" || "Gpay"}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert("Order placed!");
      setCart([]);
    })
    .catch(err => alert("Please login first"));
  }

  return (
    <div>
      <h1>Mini E-Commerce App</h1>
      <button onClick={() => setPage("home")}>Home</button>
      <button onClick={() => setPage("login")}>Login</button>
      <button onClick={() => setPage("cart")}>Cart ({cart.length})</button>
      {page === "home" && (
        <div>
          <h2>Products</h2>
          {products.map(product => (
            <div className="card" key={product._id}>
              <img src={`http://localhost:3000/${product.image}`} alt={product.name}/>

              {/* product details */}

              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
              <p>Stock: {product.stockQuantity}</p>
              <button onClick={() => addToCart(product)}> Add to Cart  </button>
            </div>
          ))}
        </div>
      )}

{/* login page */}

      {page === "login" && (
        <form onSubmit={login}>
          <h2>Login</h2>
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}  required />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}  required  />
          <button type="submit">Login</button>
        </form>
      )}

      {/* cart */}

      {page ==="cart" && (
        <div>
          <h2>My Cart</h2>
          {cart.map((item, index) => (
            <p key={index}> {item.name} - ₹{item.price} </p>
          ))}
          {/* total    placeto order */} 
<h3> Total:₹{cart.reduce((total,item) => total + item.price, 0)}</h3>

<button onClick={placeOrder}>oredr placed</button>
        </div>
      )}
    </div>
  );
}






export default App;

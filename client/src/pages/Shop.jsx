import { Link } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import UseTitle from "../hooks/useTitle";
import { useCart } from "../layouts/CartContext";
import "./Shop.css";

export default function Shop() {
  const { addToCart } = useCart();

    UseTitle("Shop | ShopLite");


  return (
    <div>
      <h2 className="page-title">Shop</h2>
      <p className="page-sub">Browse products and add to cart.</p>

      <div className="grid">
        {PRODUCTS.map((p) => (
          <div className="card" key={p.id}>
            <div className="card-title">{p.title}</div>
            <div className="card-desc">{p.desc}</div>
            <div className="row">
              <span className="price">${p.price.toFixed(2)}</span>
              <div className="actions">
                <Link className="btn ghost" to={`/app/product/${p.id}`}>View</Link>
                <button className="btn primary" onClick={() => addToCart(p)}>Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



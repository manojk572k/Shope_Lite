import { useParams, Link } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import { useCart } from "../layouts/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return <div>Product not found</div>;

  return (
    <div>
      <h2>{p.title}</h2>
      <p style={{ color: "rgba(248,250,252,0.70)" }}>{p.desc}</p>
      <p style={{ fontWeight: 800 }}>${p.price.toFixed(2)}</p>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => addToCart(p)} style={btnPrimary}>Add to cart</button>
        <Link to="/app/shop" style={btnGhost}>Back</Link>
      </div>
    </div>
  );
}

const btnPrimary = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(99,102,241,0.55)",
  background: "rgba(99,102,241,0.95)",
  color: "white",
  cursor: "pointer",
  textDecoration: "none"
};

const btnGhost = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "transparent",
  color: "white",
  cursor: "pointer",
  textDecoration: "none"
};

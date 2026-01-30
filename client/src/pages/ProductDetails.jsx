import { useParams, Link } from "react-router-dom";
import { ALL_PRODUCTS } from "../data/products";
import { useCart } from "../layouts/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const p = ALL_PRODUCTS.find((x) => x.id === id);
  if (!p) return <div>Product not found</div>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 18 }}>
      <Link to="/app/shop" style={{ color: "rgba(248,250,252,0.7)" }}>
        ← Back to Shop
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 18, marginTop: 16 }}>
        <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
          <img
            src={p.image}
            alt={p.title}
            style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }}
          />
        </div>

        <div>
          <h2 style={{ margin: "0 0 8px" }}>{p.title}</h2>
          <h3 style={{ margin: "0 0 8px",color: "rgba(248,250,252,0.70)" }}>{p.brand}</h3>
          <p style={{ color: "rgba(248,250,252,0.70)", marginTop: 0 }}>{p.desc}</p>

          <p style={{ fontWeight: 900, fontSize: 20 }}>${Number(p.price).toFixed(2)}</p>

          {typeof p.rating === "number" && (
            <p style={{ color: "rgba(248,250,252,0.70)", marginTop: 4 }}>
              ⭐ {p.rating.toFixed(1)} {typeof p.reviews === "number" ? `(${p.reviews.toLocaleString()} reviews)` : ""}
            </p>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button onClick={() => addToCart(p)} style={btnPrimary}>
              Add to cart
            </button>
            <Link to="/app/cart" style={btnGhost}>
              Go to Cart
            </Link>
          </div>
        </div>
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
  textDecoration: "none",
};

const btnGhost = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "transparent",
  color: "white",
  cursor: "pointer",
  textDecoration: "none",
};

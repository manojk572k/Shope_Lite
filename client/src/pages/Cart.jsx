import { Link, useNavigate } from "react-router-dom";
import UseTitle from "../hooks/useTitle";
import { useCart } from "../layouts/CartContext";


export default function Cart() {
  const { items, total, removeFromCart, changeQty } = useCart();
  const nav = useNavigate();
  UseTitle("Cart | ShopLite");


  if (items.length === 0) {
    return (
      <div>
        <h2>Cart</h2>
        <p style={{ color: "rgba(248,250,252,0.70)" }}>Your cart is empty.</p>
        <Link to="/app/shop" style={{ color: "#a5b4fc" }}>Go to shop</Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Cart</h2>

      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        {items.map((x) => (
          <div key={x.id} style={rowStyle}>
            <div>
              <div style={{ fontWeight: 700 }}>{x.title}</div>
              <div style={{ color: "rgba(248,250,252,0.70)", fontSize: 13 }}>
                ${x.price.toFixed(2)}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => changeQty(x.id, x.qty - 1)} style={miniBtn}>-</button>
              <span>{x.qty}</span>
              <button onClick={() => changeQty(x.id, x.qty + 1)} style={miniBtn}>+</button>
              <button onClick={() => removeFromCart(x.id)} style={dangerBtn}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, fontWeight: 800 }}>
        Total: ${total.toFixed(2)}
      </div>

      <button onClick={() => nav("/app/checkout")} style={{ ...primaryBtn, marginTop: 12 }}>
        Checkout
      </button>
    </div>
  );
}

const rowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: 12,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.05)"
};

const miniBtn = {
  width: 34,
  height: 34,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  cursor: "pointer"
};

const dangerBtn = {
  padding: "8px 10px",
  borderRadius: 12,
  border: "1px solid rgba(220,38,38,0.35)",
  background: "rgba(220,38,38,0.20)",
  color: "white",
  cursor: "pointer"
};

const primaryBtn = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(99,102,241,0.55)",
  background: "rgba(99,102,241,0.95)",
  color: "white",
  cursor: "pointer"
};

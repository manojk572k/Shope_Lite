import { useNavigate } from "react-router-dom";
import { useCart } from "../layouts/CartContext";
import UseTitle from "../hooks/useTitle";

export default function Checkout() {
  const { total, clearCart } = useCart();
  const nav = useNavigate();

  function placeOrder() {
    clearCart();
    nav("/app/shop");
  }

  return (
    <div>
      <h2>Checkout</h2>
      <p style={{ color: "rgba(248,250,252,0.70)" }}>
        This is a demo checkout (no payment).
      </p>
      <div style={{ fontWeight: 800 }}>Payable: ${total.toFixed(2)}</div>

      <button onClick={placeOrder} style={primaryBtn}>
        Place Order
      </button>
    </div>
  );
}

const primaryBtn = {
  marginTop: 12,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(99,102,241,0.55)",
  background: "rgba(99,102,241,0.95)",
  color: "white",
  cursor: "pointer"
};

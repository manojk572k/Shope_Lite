import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UseTitle from "../hooks/useTitle";
import { useCart } from "../layouts/CartContext";
import "./Checkout.css";

export default function Checkout() {
  UseTitle("Checkout | ShopLite");
  const nav = useNavigate();
  const { items, total, clearCart } = useCart();

  // ---- Pricing ----
  const [shippingMethod, setShippingMethod] = useState("standard"); // standard | express

  const shipping = useMemo(() => {
    if (!items?.length) return 0;
    if (shippingMethod === "express") return 14.99;
    return total >= 99 ? 0 : 7.99;
  }, [items?.length, shippingMethod, total]);

  const tax = useMemo(() => (items?.length ? total * 0.0825 : 0), [items?.length, total]);
  const grandTotal = useMemo(() => total + shipping + tax, [total, shipping, tax]);

  // ---- Form ----
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    payment: "card", // card | cod
    notes: "",
  });

  const [touched, setTouched] = useState({});
  const [placing, setPlacing] = useState(false);

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const errors = useMemo(() => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.address1.trim()) e.address1 = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!form.zip.trim()) e.zip = "ZIP is required";
    if (form.zip && !/^\d{5}(-\d{4})?$/.test(form.zip)) e.zip = "Enter a valid ZIP";
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const placeOrder = async () => {
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      address1: true,
      city: true,
      state: true,
      zip: true,
    });

    if (!items?.length) return;
    if (!isValid) return;

    setPlacing(true);

    // demo: simulate processing
    await new Promise((r) => setTimeout(r, 600));

    clearCart();
    nav("/app/shop", { replace: true });
  };

  if (!items || items.length === 0) {
    return (
      <div className="coPage">
        <div className="coHead">
          <h2 className="coTitle">Checkout</h2>
        </div>

        <div className="coEmpty">
          <div className="coEmptyIcon">✅</div>
          <h3>No items to checkout</h3>
          <p>Your cart is empty. Add products to continue.</p>
          <Link className="coBtn primary" to="/app/shop">
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="coPage">
      <div className="coHead">
        <h2 className="coTitle">Checkout</h2>
        <p className="coSub">Demo checkout — no real payments.</p>
      </div>

      <div className="coLayout">
        {/* LEFT: FORM */}
        <section className="coForm">
          <div className="coCard">
            <h3 className="coCardTitle">Contact</h3>

            <div className="coGrid2">
              <Field
                label="Full name"
                value={form.fullName}
                onChange={(v) => setField("fullName", v)}
                onBlur={() => setTouched((p) => ({ ...p, fullName: true }))}
                error={touched.fullName ? errors.fullName : ""}
                placeholder="Manoj Kumar"
              />
              <Field
                label="Email"
                value={form.email}
                onChange={(v) => setField("email", v)}
                onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                error={touched.email ? errors.email : ""}
                placeholder="manoj@email.com"
              />
            </div>

            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => setField("phone", v)}
              onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
              error={touched.phone ? errors.phone : ""}
              placeholder="(940) 000-0000"
            />
          </div>

          <div className="coCard">
            <h3 className="coCardTitle">Shipping address</h3>

            <Field
              label="Address line 1"
              value={form.address1}
              onChange={(v) => setField("address1", v)}
              onBlur={() => setTouched((p) => ({ ...p, address1: true }))}
              error={touched.address1 ? errors.address1 : ""}
              placeholder="123 Main St"
            />

            <Field
              label="Address line 2 (optional)"
              value={form.address2}
              onChange={(v) => setField("address2", v)}
              placeholder="Apt / Suite"
            />

            <div className="coGrid3">
              <Field
                label="City"
                value={form.city}
                onChange={(v) => setField("city", v)}
                onBlur={() => setTouched((p) => ({ ...p, city: true }))}
                error={touched.city ? errors.city : ""}
                placeholder="Denton"
              />
              <Field
                label="State"
                value={form.state}
                onChange={(v) => setField("state", v)}
                onBlur={() => setTouched((p) => ({ ...p, state: true }))}
                error={touched.state ? errors.state : ""}
                placeholder="TX"
              />
              <Field
                label="ZIP"
                value={form.zip}
                onChange={(v) => setField("zip", v)}
                onBlur={() => setTouched((p) => ({ ...p, zip: true }))}
                error={touched.zip ? errors.zip : ""}
                placeholder="76201"
              />
            </div>
          </div>

          <div className="coCard">
            <h3 className="coCardTitle">Delivery</h3>

            <label className={`coRadio ${shippingMethod === "standard" ? "active" : ""}`}>
              <input
                type="radio"
                name="ship"
                checked={shippingMethod === "standard"}
                onChange={() => setShippingMethod("standard")}
              />
              <div className="coRadioBody">
                <div className="coRadioRow">
                  <span className="coRadioTitle">Standard (3–5 days)</span>
                  <span className="coRadioPrice">{total >= 99 ? "Free" : "$7.99"}</span>
                </div>
                <div className="coRadioHint">Free shipping on orders $99+</div>
              </div>
            </label>

            <label className={`coRadio ${shippingMethod === "express" ? "active" : ""}`}>
              <input
                type="radio"
                name="ship"
                checked={shippingMethod === "express"}
                onChange={() => setShippingMethod("express")}
              />
              <div className="coRadioBody">
                <div className="coRadioRow">
                  <span className="coRadioTitle">Express (1–2 days)</span>
                  <span className="coRadioPrice">$14.99</span>
                </div>
                <div className="coRadioHint">Faster delivery</div>
              </div>
            </label>
          </div>

          <div className="coCard">
            <h3 className="coCardTitle">Payment</h3>

            <div className="coPayRow">
              <button
                type="button"
                className={`coPayBtn ${form.payment === "card" ? "active" : ""}`}
                onClick={() => setField("payment", "card")}
              >
                💳 Card (Demo)
              </button>
              <button
                type="button"
                className={`coPayBtn ${form.payment === "cod" ? "active" : ""}`}
                onClick={() => setField("payment", "cod")}
              >
                💵 Cash on Delivery
              </button>
            </div>

            {form.payment === "card" && (
              <div className="coPayHint">This is a demo UI. No real card fields are collected.</div>
            )}

            <label className="coLabel">
              Notes (optional)
              <textarea
                className="coTextarea"
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                placeholder="Any delivery instructions..."
              />
            </label>
          </div>
        </section>

        {/* RIGHT: SUMMARY */}
        <aside className="coSummary">
          <div className="coCard sticky">
            <h3 className="coCardTitle">Order Summary</h3>

            <div className="coMiniList">
              {items.slice(0, 4).map((it) => (
                <div className="coMiniItem" key={it.id}>
                  <img
                    className="coMiniImg"
                    src={it.image}
                    alt={it.title}
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/200x200.png?text=No+Image";
                    }}
                  />
                  <div className="coMiniInfo">
                    <div className="coMiniTitle" title={it.title}>
                      {it.title}
                    </div>
                    <div className="coMiniMeta">
                      Qty {it.qty} • ${Number(it.price).toFixed(2)}
                    </div>
                  </div>
                  <div className="coMiniLine">
                    ${(Number(it.price) * Number(it.qty)).toFixed(2)}
                  </div>
                </div>
              ))}

              {items.length > 4 && <div className="coMore">+ {items.length - 4} more items</div>}
            </div>

            <div className="coDivider" />

            <div className="coRow">
              <span>Items</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="coRow">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="coRow">
              <span>Estimated tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="coDivider" />

            <div className="coRow total">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            <button
              className="coBtn primary full"
              type="button"
              disabled={!isValid || placing}
              onClick={placeOrder}
            >
              {placing ? "Placing order..." : "Place Order"}
            </button>

            <Link className="coBtn ghost full" to="/app/cart">
              Back to cart
            </Link>

            {!isValid && (
              <div className="coErrorBox">Please fill the required fields to place the order.</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, onBlur, error, placeholder }) {
  return (
    <label className="coLabel">
      {label}
      <input
        className={`coInput ${error ? "error" : ""}`}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
      />
      {error ? <div className="coErr">{error}</div> : null}
    </label>
  );
}

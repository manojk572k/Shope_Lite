import { Link, useNavigate } from "react-router-dom";
import UseTitle from "../hooks/useTitle";
import { useCart } from "../layouts/CartContext";
import "./Cart.css";

function StarRow({ value }) {
  const v = Number(value || 0);
  const full = Math.floor(v);
  const half = v - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span className="cStars" aria-label={`${v.toFixed(1)} stars`}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(empty)}
    </span>
  );
}

export default function Cart() {
  UseTitle("Cart | ShopLite");
  const { items, total, removeFromCart, changeQty } = useCart();
  const nav = useNavigate();

  const shipping = total > 0 ? (total >= 99 ? 0 : 7.99) : 0;
  const tax = total > 0 ? total * 0.0825 : 0;
  const grandTotal = total + shipping + tax;

  if (!items || items.length === 0) {
    return (
      <div className="cartPage">
        <div className="cartHead">
          <h2 className="cartTitle">Cart</h2>
          <span className="cartCount">0 items</span>
        </div>

        <div className="emptyCart">
          <div className="emptyIcon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add items from the shop to see them here.</p>
          <Link className="cBtn primary" to="/app/shop">
            Go to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cartPage">
      <div className="cartHead">
        <h2 className="cartTitle">Cart</h2>
        <span className="cartCount">{items.reduce((s, x) => s + (x.qty || 0), 0)} items</span>
      </div>

      <div className="cartLayout">
        {/* LEFT: ITEMS */}
        <section className="cartItems">
          {items.map((item) => {
            const unit = Number(item.price || 0);
            const qty = Number(item.qty || 0);
            const lineTotal = unit * qty;

            return (
              <article className="cartItem" key={item.id}>
                <div className="ciImgWrap">
                  <img
                    className="ciImg"
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/900x600.png?text=Image+Not+Available";
                    }}
                  />
                </div>

                <div className="ciBody">
                  <div className="ciTop">
                    <div className="ciInfo">
                      <h3 className="ciTitle" title={item.title}>
                        {item.title}
                      </h3>

                      <div className="ciMeta">
                        {(item.brand || item.category) && (
                          <span className="ciTag">{item.brand ? item.brand : item.category}</span>
                        )}

                        {typeof item.rating !== "undefined" && (
                          <span className="ciRating">
                            <StarRow value={item.rating} />
                            <span className="ciRatingNum">
                              {Number(item.rating || 0).toFixed(1)}
                            </span>
                          </span>
                        )}
                      </div>

                      {item.desc && <p className="ciDesc">{item.desc}</p>}
                    </div>

                    <div className="ciPrice">
                      <div className="ciUnit">${unit.toFixed(2)}</div>
                      <div className="ciLine">
                        Subtotal: <b>${lineTotal.toFixed(2)}</b>
                      </div>
                    </div>
                  </div>

                  <div className="ciBottom">
                    {/* Qty stepper */}
                    <div className="qtyBox" aria-label="Quantity">
                      <button
                        className="qtyBtn"
                        type="button"
                        disabled={qty <= 1}
                        onClick={() => changeQty(item.id, qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span className="qtyVal">{qty}</span>

                      <button
                        className="qtyBtn"
                        type="button"
                        onClick={() => changeQty(item.id, qty + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="cBtn danger"
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>

                    <Link className="cBtn ghost" to={`/app/product/${item.id}`}>
                      View
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* RIGHT: SUMMARY */}
        <aside className="cartSummary">
          <h3 className="sumTitle">Order Summary</h3>

          <div className="sumRow">
            <span>Items</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="sumRow">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div className="sumRow">
            <span>Estimated tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="sumDivider" />

          <div className="sumRow total">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          <button className="cBtn primary full" type="button" onClick={() => nav("/app/checkout")}>
            Checkout
          </button>

          <Link className="cBtn ghost full" to="/app/shop">
            Continue shopping
          </Link>

          <p className="sumHint">Free shipping on orders $99+.</p>
        </aside>
      </div>
    </div>
  );
}

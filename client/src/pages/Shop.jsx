import { Link } from "react-router-dom";
import UseTitle from "../hooks/useTitle";
import { useCart } from "../layouts/CartContext";
import { useSearch } from "../layouts/SearchContext";
import { useEffect, useMemo, useRef, useState } from "react";
import "./Shop.css";

import { ELECTRONICS, TOYS_GAMES, HOME_LIVING, TRENDING } from "../data/products";

function StarRow({ value }) {
  const v = Number(value || 0);
  const full = Math.floor(v);
  const half = v - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span className="stars" aria-label={`${v.toFixed(1)} stars`}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(empty)}
    </span>
  );
}

function SectionCarousel({ title, items, onAdd, onZoom }) {
  const trackRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const t = trackRef.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    setCanLeft(t.scrollLeft > 4);
    setCanRight(t.scrollLeft < max - 4);
  };

  useEffect(() => {
    updateArrows();
    // also update when window resizes
    const onResize = () => updateArrows();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [items.length]);

  const scrollByCards = (dir) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector(".pCard");
    const gap = 16;
    const w = card ? card.getBoundingClientRect().width : 320;
    t.scrollBy({ left: dir * (w + gap) * 3, behavior: "smooth" });
  };

  return (
    <section className="section">
      <div className="sectionHead">
        <h3 className="sectionTitle">{title}</h3>
        <div className="sectionControls">
          <button
            className="arrowBtn"
            disabled={!canLeft}
            onClick={() => scrollByCards(-1)}
            type="button"
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            className="arrowBtn"
            disabled={!canRight}
            onClick={() => scrollByCards(1)}
            type="button"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="emptyMini">No items match the current filters.</div>
      ) : (
        <div className="track" ref={trackRef} onScroll={updateArrows}>
          {items.map((p) => (
            <article className="pCard" key={p.id}>
              <div className="imgWrap">
                <img
                  className="img"
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/900x600.png?text=Image+Not+Available";
                  }}
                />

                {/* Hover overlay */}
                <div className="quickView">
                  <button
                    type="button"
                    className="quickViewBtn"
                    onClick={() => onZoom(p)}
                  >
                    🔍 Quick View
                  </button>
                </div>
              </div>

              <div className="cardBody">
                <h4 className="pTitle" title={p.title}>
                  {p.brand}
                </h4>
                <p className="ratingRow">{p.title}</p>
                <div className="ratingRow">
                  <StarRow value={p.rating} />
                  <span className="ratingText">{Number(p.rating || 0).toFixed(1)}</span>
                  {typeof p.reviews === "number" && (
                    <span className="reviews">({p.reviews.toLocaleString()})</span>
                  )}
                </div>

                <p className="pDesc">{p.desc}</p>

                <div className="row">
                  <span className="price">${Number(p.price).toFixed(2)}</span>
                  <div className="actions">
                   <Link className="viewTag" to={`/app/product/${p.id}`}>
                      View 
                    </Link>
                    <button className="btn primary" onClick={() => onAdd(p)}>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default function Shop() {
  UseTitle("Shop | ShopLite");
  const { addToCart } = useCart();
  const { query } = useSearch();

  // ✅ Quick view modal state (THIS was missing in your code)
  const [zoomProduct, setZoomProduct] = useState(null);

  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState("featured");

  const applyFilters = (list) => {
    let out = [...list];

    const q = String(query ?? "").trim().toLowerCase();
    if (q) {
      out = out.filter((p) => {
        const text = `${p.title || ""} ${p.desc || ""}`.toLowerCase();
        return text.includes(q);
      });
    }

    out = out.filter((p) => Number(p.price || 0) <= maxPrice);
    out = out.filter((p) => Number(p.rating || 0) >= minRating);

    if (sortBy === "rating_desc") out.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    if (sortBy === "price_asc") out.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (sortBy === "price_desc") out.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));

    return out;
  };


  const electronics = useMemo(() => applyFilters(ELECTRONICS), [query, minRating, maxPrice, sortBy]);
  const toysGames = useMemo(() => applyFilters(TOYS_GAMES), [query, minRating, maxPrice, sortBy]);
  const homeLiving = useMemo(() => applyFilters(HOME_LIVING), [query, minRating, maxPrice, sortBy]);
  const trending = useMemo(() => applyFilters(TRENDING), [query, minRating, maxPrice, sortBy]);

  const total = electronics.length + toysGames.length + homeLiving.length + trending.length;

  useEffect(() => {
    if (!zoomProduct) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setZoomProduct(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomProduct]);

  return (
    <div className="shopLayout">
      <aside className="filters">
        <h3 className="filtersTitle">Filters</h3>

        <div className="filterBlock">
          <div className="filterLabel">Minimum rating</div>

          <label className="radioRow">
            <input type="radio" name="minRating" checked={minRating === 0} onChange={() => setMinRating(0)} />
            <span>All ratings</span>
          </label>

          {[4.5, 4, 3].map((r) => (
            <label className="radioRow" key={r}>
              <input type="radio" name="minRating" checked={minRating === r} onChange={() => setMinRating(r)} />
              <span>
                <StarRow value={r} /> &amp; up
              </span>
            </label>
          ))}
        </div>

        <div className="filterBlock">
          <div className="filterLabel">Max price: ${maxPrice}</div>
          <input
            className="range"
            type="range"
            min="0"
            max="2000"
            step="50"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div className="filterBlock">
          <div className="filterLabel">Sort by</div>
          <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="rating_desc">Rating: High → Low</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>

        <button
          className="btn ghost full"
          onClick={() => {
            setMinRating(0);
            setMaxPrice(2000);
            setSortBy("featured");
          }}
        >
          Clear filters
        </button>
      </aside>

      <main className="shopPage">
        <h2 className="page-title">Shop</h2>
        <p className="page-sub">Search, filter, and browse categories.</p>

        <div className="resultsBar">
          <span>
            Showing <b>{total}</b> items
          </span>
          <span className="hint">
            {String(query ?? "").trim()
              ? `Search: “${String(query).trim()}”`
              : "Tip: try searching in navbar"}
          </span>
        </div>

        {/* ✅ IMPORTANT: use FILTERED arrays here */}
        <SectionCarousel title="Electronics" items={electronics} onAdd={addToCart} onZoom={setZoomProduct} />
        <SectionCarousel title="Toys & Games" items={toysGames} onAdd={addToCart} onZoom={setZoomProduct} />
        <SectionCarousel title="Home & Living" items={homeLiving} onAdd={addToCart} onZoom={setZoomProduct} />
        <SectionCarousel title="Trending Picks" items={trending} onAdd={addToCart} onZoom={setZoomProduct} />
      </main>

      {/* ✅ Quick View Modal */}
      {zoomProduct && (
        <div className="modalBackdrop" onClick={() => setZoomProduct(null)} role="presentation">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalImgWrap">
              <img className="modalImg" src={zoomProduct.image} alt={zoomProduct.title} />
            </div>

            <div className="modalBody">
              <div>
                <h4 className="modalTitle">{zoomProduct.brand}</h4>
                <div className="modalMeta">
                  <span className="price">${Number(zoomProduct.price).toFixed(2)}</span>
                  <span className="modalRating">
                    <StarRow value={zoomProduct.rating} /> {Number(zoomProduct.rating || 0).toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="modalActions">
                <button className="btn primary" onClick={() => addToCart(zoomProduct)}>
                  Add
                </button>
                <button className="modalClose" onClick={() => setZoomProduct(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

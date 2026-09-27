import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

/* ── product data ── */
const PRODUCTS = [
  { id: 1, name: "Sony WH-1000XM5",    category: "Headphones",  rating: 4.8, reviews: "2.3k", price: 279,   original: 349,  badge: "-20%", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
  { id: 2, name: "MacBook Air M3",      category: "Laptop",      rating: 4.9, reviews: "1.1k", price: 1099,  original: null, badge: "New",  img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80" },
  { id: 3, name: "iPhone 15 Pro",       category: "Smartphone",  rating: 4.7, reviews: "4.5k", price: 999,   original: null, badge: null,   img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80" },
  { id: 4, name: "Samsung 4K OLED TV",  category: "Display",     rating: 4.6, reviews: "890",  price: 1499,  original: 1799, badge: "-17%", img: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80" },
  { id: 5, name: "AirPods Pro 2",       category: "Audio",       rating: 4.8, reviews: "6.2k", price: 229,   original: 249,  badge: "Sale", img: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=400&q=80" },
  { id: 6, name: "Logitech MX Master 3",category: "Accessories", rating: 4.7, reviews: "3.1k", price: 89,    original: null, badge: null,   img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80" },
];

/* ── star renderer ── */
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"
          fill={i <= Math.round(rating) ? "#C9A84C" : "none"}
          stroke="#C9A84C" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

/* ── product card ── */
function ProductCard({ product }) {
  return (
    <div className="bg-[#1B2E45] rounded-xl border border-[#C9A84C]/15 overflow-hidden
                    hover:border-[#C9A84C]/50 transition-all duration-200 group flex flex-col">
      {/* image */}
      <div className="relative h-52 bg-[#0D1B2A] overflow-hidden">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <span className="absolute top-3 right-3 bg-[#C9A84C] text-[#0D1B2A] text-[11px]
                           font-bold px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </div>

      {/* body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[15px] font-semibold text-[#F5F0E8]">{product.name}</p>
        <p className="text-[12px] text-[#9A9490] mt-0.5 mb-2">{product.category}</p>

        <div className="flex items-center gap-2 mb-3">
          <Stars rating={product.rating} />
          <span className="text-[12px] text-[#9A9490]">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-auto mb-4">
          <span className="text-[18px] font-bold text-[#C9A84C]">
            ${product.price.toLocaleString()}
          </span>
          {product.original && (
            <span className="text-[13px] text-[#9A9490] line-through">
              ${product.original.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* add to cart — outside body padding, snaps to card bottom */}
      <button className="w-full py-3 bg-[#C9A84C] text-[#0D1B2A] text-[14px] font-medium
                         rounded-b-xl hover:bg-[#E8D5A3] active:scale-[0.98]
                         transition-all duration-150 flex-shrink-0">
        Add to cart
      </button>
    </div>
  );
}

/* ── main page ── */
export default function HomePage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <main className="bg-[#0D1B2A] min-h-screen pt-[68px] font-['Inter',sans-serif]">
      <Navbar/>

      {/* ════════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-68px)] flex flex-col items-center justify-center px-6 text-center overflow-hidden">

        {/* circuit grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,168,76,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center max-w-3xl w-full">

          {/* pill badge */}
          <span className="mb-8 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full
                           border border-[#C9A84C]/50 text-[#C9A84C] text-[13px] tracking-wide">
            New arrivals just dropped ✦
          </span>

          {/* heading */}
          <h1 className="font-['Playfair_Display',serif] text-[80px] leading-[1.05] font-bold
                         text-[#F5F0E8] mb-5 tracking-tight">
            Power. Precision.<br />
            <em>Delivered.</em>
          </h1>

          {/* subheading */}
          <p className="text-[18px] text-[#9A9490] mb-10">
            Premium tech, curated for those who demand more.
          </p>

          {/* search bar */}
          <form onSubmit={handleSearch} className="w-full max-w-[600px]">
            <div className="flex items-center bg-[#1B2E45] border border-[#C9A84C]/30
                            rounded-xl overflow-hidden h-[52px]">
              <div className="pl-4 pr-2 text-[#9A9490] flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for laptops, phones, audio..."
                className="flex-1 bg-transparent text-[14px] text-[#F5F0E8] placeholder-[#9A9490]
                           outline-none h-full px-2"
              />
              <button
                type="submit"
                className="h-full px-6 bg-[#C9A84C] text-[#0D1B2A] text-[14px] font-medium
                           hover:bg-[#E8D5A3] transition-colors flex-shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* popular links */}
          <p className="mt-4 text-[13px] text-[#9A9490]">
            Popular:{" "}
            {["AirPods Pro", "MacBook Air", "Sony WH-1000XM5"].map((term, i, arr) => (
              <span key={term}>
                <Link
                  to={`/shop?q=${encodeURIComponent(term)}`}
                  className="text-[#C9A84C] hover:text-[#E8D5A3] underline underline-offset-2 transition-colors"
                >
                  {term}
                </Link>
                {i < arr.length - 1 && <span className="mx-1.5">·</span>}
              </span>
            ))}
          </p>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-24 h-px bg-[#C9A84C]/30" />
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="#C9A84C"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 1l7 7 7-7"/>
          </svg>
        </div>
      </section>

      {/* section divider */}
      <div className="h-px bg-[#C9A84C]/12 mx-8" />

      {/* ════════════════════════════════════
          WHY VOLTEX
      ════════════════════════════════════ */}
      <section className="py-28 px-8 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-['Playfair_Display',serif] text-[36px] font-bold text-[#F5F0E8] mb-3">
            Why Voltex?
          </h2>
          <p className="text-[14px] text-[#9A9490]">Everything you need, nothing you don't.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "Verified Authentic",
              desc: "Every product is sourced directly from authorized distributors.",
              icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C9A84C"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
              ),
            },
            {
              title: "Fast Delivery",
              desc: "Same-day dispatch on orders placed before 3 PM.",
              icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C9A84C"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="1" y="3" width="15" height="13"/>
                  <path d="M16 8h4l3 3v5h-7V8z"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              ),
            },
            {
              title: "24/7 Support",
              desc: "Expert tech support around the clock, whenever you need it.",
              icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C9A84C"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
                  <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                </svg>
              ),
            },
          ].map(({ title, desc, icon }) => (
            <div
              key={title}
              className="bg-[#1B2E45] rounded-xl border border-[#C9A84C]/15 p-8
                         hover:border-[#C9A84C]/50 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="mb-5">{icon}</div>
              <h3 className="text-[16px] font-semibold text-[#F5F0E8] mb-2">{title}</h3>
              <p className="text-[14px] text-[#9A9490] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* section divider */}
      <div className="h-px bg-[#C9A84C]/12 mx-8" />

      {/* ════════════════════════════════════
          TRENDING NOW
      ════════════════════════════════════ */}
      <section className="py-28 px-8 max-w-6xl mx-auto">
        {/* header row */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-['Playfair_Display',serif] text-[36px] font-bold text-[#F5F0E8] mb-1">
              Trending Now
            </h2>
            <p className="text-[14px] text-[#9A9490]">Handpicked for performance and style.</p>
          </div>
          <Link
            to="/shop"
            className="h-9 px-4 text-[13px] font-medium text-[#C9A84C] border border-[#C9A84C]
                       rounded-lg hover:bg-[#C9A84C]/10 transition-colors flex items-center gap-1.5"
          >
            See all <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* 3×2 product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <Footer/>
    </main>
  );
}
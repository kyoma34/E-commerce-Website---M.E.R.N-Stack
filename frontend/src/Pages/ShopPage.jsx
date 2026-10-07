import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import { useCart } from "../context/CartContext";

const CATEGORIES = ["All", "Headphones", "Laptop", "Smartphone", "Display", "Audio", "Accessories"];
const SORT_OPTIONS = [
  { label: "Newest",        value: "newest" },
  { label: "Price: Low→High", value: "price_asc" },
  { label: "Price: High→Low", value: "price_desc" },
  { label: "Name A→Z",      value: "name_asc" },
];
const PER_PAGE = 9;

/* ── star renderer ── */
function Stars({ rating = 0 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
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
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link to={`/product/${product._id}`}
      className="bg-[#1B2E45] rounded-xl border border-[#C9A84C]/15 overflow-hidden
                 hover:border-[#C9A84C]/50 transition-all duration-200 group flex flex-col">
      <div className="relative h-48 bg-[#0D1B2A] overflow-hidden">
        {product.image
          ? <img src={product.image} alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-[#9A9490] text-[12px]">No image</div>
        }
        {product.state === "Out of stock" && (
          <div className="absolute inset-0 bg-[#0D1B2A]/70 flex items-center justify-center">
            <span className="text-[12px] text-[#9A9490] font-medium">Out of stock</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[14px] font-semibold text-[#F5F0E8] mb-0.5">{product.name}</p>
        <p className="text-[11px] text-[#9A9490] mb-2">{product.category}</p>
        <div className="flex items-center gap-1.5 mb-3">
          <Stars rating={4.5} />
          <span className="text-[11px] text-[#9A9490]">4.5</span>
        </div>
        <div className="mt-auto mb-3">
          <span className="text-[16px] font-bold text-[#C9A84C]">
            ${Number(product.price).toLocaleString()}
          </span>
        </div>
      </div>

      <button onClick={handleAdd} disabled={product.state === "Out of stock"}
        className={`w-full py-2.5 text-[13px] font-medium rounded-b-xl flex-shrink-0
                    transition-all duration-150 active:scale-[0.98]
                    ${added
                      ? "bg-emerald-500 text-white"
                      : product.state === "Out of stock"
                        ? "bg-[#243D57] text-[#9A9490] cursor-not-allowed"
                        : "bg-[#C9A84C] text-[#0D1B2A] hover:bg-[#E8D5A3]"}`}>
        {added ? "✓ Added" : product.state === "Out of stock" ? "Out of stock" : "Add to cart"}
      </button>
    </Link>
  );
}

/* ── skeleton ── */
function SkeletonCard() {
  return (
    <div className="bg-[#1B2E45] rounded-xl border border-[#C9A84C]/10 overflow-hidden animate-pulse">
      <div className="h-48 bg-[#243D57]" />
      <div className="p-4 space-y-2">
        <div className="h-3.5 bg-[#243D57] rounded w-3/4" />
        <div className="h-3 bg-[#243D57] rounded w-1/2" />
        <div className="h-4 bg-[#243D57] rounded w-1/4 mt-3" />
      </div>
      <div className="h-10 bg-[#243D57]" />
    </div>
  );
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  // read initial query from URL (from homepage search bar)
  const [search, setSearch]   = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState("All");
  const [sort, setSort]         = useState("newest");
  const [page, setPage]         = useState(1);

  useEffect(() => {
    api.get("/api/products")
      .then(({ data }) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // sync URL q param → search input
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  // reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [search, category, sort]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.state !== "Draft");

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    // category
    if (category !== "All")
      list = list.filter((p) => p.category === category);

    // sort
    switch (sort) {
      case "price_asc":  list = [...list].sort((a, b) => a.price - b.price); break;
      case "price_desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "name_asc":   list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      default:           list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [products, search, category, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(search.trim() ? { q: search.trim() } : {});
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] font-['Inter',sans-serif]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 pt-24 pb-20">

        {/* ── page header ── */}
        <div className="mb-8">
          <h1 className="font-['Playfair_Display',serif] text-[36px] font-bold text-[#F5F0E8] mb-1">
            Shop
          </h1>
          <p className="text-[14px] text-[#9A9490]">
            {loading ? "Loading..." : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* ── search + sort bar ── */}
        <form onSubmit={handleSearch}
          className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9490]"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full h-10 pl-9 pr-4 bg-[#1B2E45] border border-[#C9A84C]/20
                         rounded-lg text-[14px] text-[#F5F0E8] placeholder-[#9A9490]
                         outline-none focus:border-[#C9A84C] transition-colors"
            />
          </div>

          <button type="submit"
            className="h-10 px-5 bg-[#C9A84C] text-[#0D1B2A] text-[13px] font-medium
                       rounded-lg hover:bg-[#E8D5A3] transition-colors flex-shrink-0">
            Search
          </button>

          {/* sort */}
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="h-10 px-3 bg-[#1B2E45] border border-[#C9A84C]/20 rounded-lg
                       text-[13px] text-[#F5F0E8] outline-none focus:border-[#C9A84C]
                       transition-colors cursor-pointer flex-shrink-0">
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </form>

        {/* ── category pills ── */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`h-8 px-4 rounded-full text-[12px] font-medium transition-colors
                ${category === c
                  ? "bg-[#C9A84C] text-[#0D1B2A]"
                  : "bg-[#1B2E45] border border-[#C9A84C]/15 text-[#9A9490] hover:text-[#F5F0E8] hover:border-[#C9A84C]/40"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* ── grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
          {loading
            ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : paginated.length === 0
              ? (
                <div className="col-span-full flex flex-col items-center py-20 gap-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9A9490" strokeWidth="1.2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <p className="text-[#9A9490] text-[15px]">No products found.</p>
                  <button onClick={() => { setSearch(""); setCategory("All"); }}
                    className="text-[13px] text-[#C9A84C] hover:text-[#E8D5A3] transition-colors underline">
                    Clear filters
                  </button>
                </div>
              )
              : paginated.map((p) => <ProductCard key={p._id} product={p} />)
          }
        </div>

        {/* ── pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="h-9 w-9 rounded-lg border border-[#C9A84C]/20 text-[#9A9490]
                         hover:border-[#C9A84C] hover:text-[#F5F0E8] disabled:opacity-30
                         transition-colors flex items-center justify-center">
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)}
                className={`h-9 w-9 rounded-lg text-[13px] font-medium transition-colors
                  ${page === n
                    ? "bg-[#C9A84C] text-[#0D1B2A]"
                    : "border border-[#C9A84C]/20 text-[#9A9490] hover:border-[#C9A84C] hover:text-[#F5F0E8]"}`}>
                {n}
              </button>
            ))}

            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="h-9 w-9 rounded-lg border border-[#C9A84C]/20 text-[#9A9490]
                         hover:border-[#C9A84C] hover:text-[#F5F0E8] disabled:opacity-30
                         transition-colors flex items-center justify-center">
              →
            </button>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import { useCart } from "../context/CartContext";

function Stars({ rating = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? "#C9A84C" : "none"}
          stroke="#C9A84C" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function ProductPage() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]         = useState(1);
  const [added, setAdded]     = useState(false);

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0D1B2A] pt-[68px]">
      <Navbar />
      <div className="flex items-center justify-center h-[80vh]">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#0D1B2A] font-['Inter',sans-serif]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-8 pt-28 pb-20">

        {/* breadcrumb */}
        <p className="text-[13px] text-[#9A9490] mb-8">
          <button onClick={() => navigate("/")} className="hover:text-[#C9A84C] transition-colors">Home</button>
          <span className="mx-2">·</span>
          <span className="text-[#F5F0E8]">{product.name}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* image */}
          <div className="bg-[#1B2E45] rounded-2xl border border-[#C9A84C]/15 overflow-hidden h-[420px] flex items-center justify-center">
            {product.image
              ? <img src={product.image} alt={product.name} className="w-full h-full object-contain p-6" />
              : <span className="text-[#9A9490] text-[14px]">No image</span>
            }
          </div>

          {/* details */}
          <div className="flex flex-col">
            <span className="text-[12px] text-[#C9A84C] uppercase tracking-widest font-medium mb-2">
              {product.category}
            </span>
            <h1 className="font-['Playfair_Display',serif] text-[36px] font-bold text-[#F5F0E8] mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <Stars rating={4.5} />
              <span className="text-[13px] text-[#9A9490]">4.5 · No reviews yet</span>
            </div>

            <p className="text-[14px] text-[#9A9490] leading-relaxed mb-6">
              {product.description || "Premium quality product from Voltex."}
            </p>

            {/* price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-[32px] font-bold text-[#C9A84C]">
                ${Number(product.price).toLocaleString()}
              </span>
            </div>

            {/* stock badge */}
            <div className="mb-6">
              {product.state === "Active"
                ? <span className="text-[12px] text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">In stock</span>
                : <span className="text-[12px] text-red-400 bg-red-400/10 px-3 py-1 rounded-full">Out of stock</span>
              }
            </div>

            {/* qty + add to cart */}
            {product.state === "Active" && (
              <div className="flex items-center gap-3 mt-auto">
                {/* qty picker */}
                <div className="flex items-center bg-[#1B2E45] border border-[#C9A84C]/20 rounded-lg overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-12 text-[#9A9490] hover:text-[#F5F0E8] hover:bg-[#243D57] transition-colors text-lg">
                    −
                  </button>
                  <span className="w-10 text-center text-[#F5F0E8] text-[14px] font-medium">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    className="w-10 h-12 text-[#9A9490] hover:text-[#F5F0E8] hover:bg-[#243D57] transition-colors text-lg">
                    +
                  </button>
                </div>

                <button onClick={handleAdd}
                  className={`flex-1 h-12 rounded-xl text-[15px] font-medium transition-all duration-150 active:scale-[0.98]
                    ${added ? "bg-emerald-500 text-white" : "bg-[#C9A84C] text-[#0D1B2A] hover:bg-[#E8D5A3]"}`}>
                  {added ? "✓ Added to cart" : "Add to cart"}
                </button>
              </div>
            )}

            {/* go to checkout shortcut */}
            {product.state === "Active" && (
              <button onClick={() => { addItem(product); navigate("/cart"); }}
                className="mt-3 w-full h-12 rounded-xl border border-[#C9A84C]/30 text-[#C9A84C]
                           text-[15px] font-medium hover:bg-[#C9A84C]/10 transition-colors">
                Buy now
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
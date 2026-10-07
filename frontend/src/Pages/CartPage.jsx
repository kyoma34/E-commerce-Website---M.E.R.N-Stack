import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) { navigate("/auth"); return; }
    navigate("/checkout");
  };

  if (items.length === 0) return (
    <div className="min-h-screen bg-[#0D1B2A] font-['Inter',sans-serif]">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9A9490" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <p className="text-[#9A9490] text-[16px]">Your cart is empty.</p>
        <Link to="/" className="h-10 px-6 bg-[#C9A84C] text-[#0D1B2A] text-[14px] font-medium rounded-lg hover:bg-[#E8D5A3] transition-colors flex items-center">
          Continue shopping
        </Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D1B2A] font-['Inter',sans-serif]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-8 pt-28 pb-20">
        <h1 className="font-['Playfair_Display',serif] text-[32px] font-bold text-[#F5F0E8] mb-8">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item._id}
                className="flex items-center gap-4 bg-[#1B2E45] rounded-xl border border-[#C9A84C]/15 p-4">

                {/* image */}
                <div className="w-20 h-20 bg-[#0D1B2A] rounded-lg overflow-hidden flex-shrink-0">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                    : <div className="w-full h-full flex items-center justify-center text-[#9A9490] text-[10px]">No img</div>
                  }
                </div>

                {/* info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#F5F0E8] truncate">{item.name}</p>
                  <p className="text-[12px] text-[#9A9490]">{item.category}</p>
                  <p className="text-[14px] font-bold text-[#C9A84C] mt-1">
                    ${Number(item.price).toLocaleString()}
                  </p>
                </div>

                {/* qty */}
                <div className="flex items-center bg-[#0D1B2A] border border-[#C9A84C]/15 rounded-lg overflow-hidden">
                  <button onClick={() => updateQty(item._id, item.qty - 1)}
                    className="w-8 h-9 text-[#9A9490] hover:text-[#F5F0E8] transition-colors">−</button>
                  <span className="w-8 text-center text-[#F5F0E8] text-[13px]">{item.qty}</span>
                  <button onClick={() => updateQty(item._id, item.qty + 1)}
                    className="w-8 h-9 text-[#9A9490] hover:text-[#F5F0E8] transition-colors">+</button>
                </div>

                {/* subtotal */}
                <p className="text-[14px] font-bold text-[#F5F0E8] w-20 text-right flex-shrink-0">
                  ${(item.price * item.qty).toLocaleString()}
                </p>

                {/* remove */}
                <button onClick={() => removeItem(item._id)}
                  className="text-[#9A9490] hover:text-red-400 transition-colors flex-shrink-0 ml-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}

            <button onClick={clearCart}
              className="text-[12px] text-[#9A9490] hover:text-red-400 transition-colors mt-2">
              Clear cart
            </button>
          </div>

          {/* summary */}
          <div className="bg-[#1B2E45] rounded-xl border border-[#C9A84C]/15 p-6 h-fit sticky top-24">
            <h2 className="text-[15px] font-semibold text-[#F5F0E8] mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4 text-[13px]">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-[#9A9490]">
                  <span className="truncate mr-2">{item.name} ×{item.qty}</span>
                  <span className="flex-shrink-0">${(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#C9A84C]/10 pt-3 mb-5 flex justify-between">
              <span className="text-[14px] font-semibold text-[#F5F0E8]">Total</span>
              <span className="text-[18px] font-bold text-[#C9A84C]">${totalPrice.toLocaleString()}</span>
            </div>

            <button onClick={handleCheckout}
              className="w-full h-12 bg-[#C9A84C] text-[#0D1B2A] text-[15px] font-medium rounded-xl
                         hover:bg-[#E8D5A3] active:scale-[0.98] transition-all">
              Proceed to checkout
            </button>

            <Link to="/" className="block text-center text-[13px] text-[#9A9490] hover:text-[#F5F0E8] mt-3 transition-colors">
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
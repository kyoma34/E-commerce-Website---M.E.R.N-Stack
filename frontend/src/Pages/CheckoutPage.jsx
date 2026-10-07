import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ address: "", city: "", country: "", zipCode: "" });
  const [errors, setErrors]   = useState({});
  const [placing, setPlacing] = useState(false);
  const [serverError, setServerError] = useState("");

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.address) e.address = "Required.";
    if (!form.city)    e.city    = "Required.";
    if (!form.country) e.country = "Required.";
    return e;
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!user) { navigate("/auth"); return; }

    try {
      setPlacing(true);
      setServerError("");

      const orderItems = items.map((item) => ({
        product:  item._id,
        name:     item.name,
        image:    item.image ?? "",
        price:    item.price,
        quantity: item.qty,
      }));

      const { data } = await api.post("/api/orders", {
        orderItems,
        shippingAddress: form,
        totalPrice,
      });

      clearCart();
      navigate(`/order-confirm/${data._id}`);
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong. Try again.");
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    navigate("/");
    return null;
  }

  const inputCls = (name) =>
    `w-full h-11 px-3.5 bg-[#0D1B2A] rounded-lg border text-[14px] text-[#F5F0E8]
     placeholder-[#9A9490] outline-none transition-all
     ${errors[name]
       ? "border-[#E05C5C] ring-2 ring-[#E05C5C]/20"
       : "border-white/10 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20"}`;

  return (
    <div className="min-h-screen bg-[#0D1B2A] font-['Inter',sans-serif]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-8 pt-28 pb-20">
        <h1 className="font-['Playfair_Display',serif] text-[32px] font-bold text-[#F5F0E8] mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* shipping form */}
          <form onSubmit={placeOrder} className="lg:col-span-2 space-y-5">
            <div className="bg-[#1B2E45] rounded-xl border border-[#C9A84C]/15 p-6">
              <h2 className="text-[15px] font-semibold text-[#F5F0E8] mb-5">Shipping Address</h2>

              {serverError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] px-4 py-3 rounded-lg mb-4">
                  {serverError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#9A9490] mb-1.5">Street Address</label>
                  <input name="address" value={form.address} onChange={change}
                    placeholder="123 Main Street" className={inputCls("address")} />
                  {errors.address && <p className="text-[11px] text-[#E05C5C] mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#9A9490] mb-1.5">City</label>
                    <input name="city" value={form.city} onChange={change}
                      placeholder="Tunis" className={inputCls("city")} />
                    {errors.city && <p className="text-[11px] text-[#E05C5C] mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#9A9490] mb-1.5">Zip Code</label>
                    <input name="zipCode" value={form.zipCode} onChange={change}
                      placeholder="1000" className={inputCls("zipCode")} />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#9A9490] mb-1.5">Country</label>
                  <input name="country" value={form.country} onChange={change}
                    placeholder="Tunisia" className={inputCls("country")} />
                  {errors.country && <p className="text-[11px] text-[#E05C5C] mt-1">{errors.country}</p>}
                </div>
              </div>
            </div>

            <button type="submit" disabled={placing}
              className="w-full h-13 py-3.5 bg-[#C9A84C] text-[#0D1B2A] text-[16px] font-medium
                         rounded-xl hover:bg-[#E8D5A3] active:scale-[0.98] transition-all disabled:opacity-60">
              {placing ? "Placing order..." : `Place order · $${totalPrice.toLocaleString()}`}
            </button>
          </form>

          {/* order summary */}
          <div className="bg-[#1B2E45] rounded-xl border border-[#C9A84C]/15 p-6 h-fit sticky top-24">
            <h2 className="text-[15px] font-semibold text-[#F5F0E8] mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0D1B2A] rounded-lg overflow-hidden flex-shrink-0">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                      : <div className="w-full h-full flex items-center justify-center text-[10px] text-[#9A9490]">?</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#F5F0E8] font-medium truncate">{item.name}</p>
                    <p className="text-[11px] text-[#9A9490]">×{item.qty}</p>
                  </div>
                  <p className="text-[13px] text-[#C9A84C] font-medium flex-shrink-0">
                    ${(item.price * item.qty).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#C9A84C]/10 pt-3 flex justify-between">
              <span className="text-[14px] font-semibold text-[#F5F0E8]">Total</span>
              <span className="text-[18px] font-bold text-[#C9A84C]">${totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
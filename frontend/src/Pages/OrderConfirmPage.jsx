import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";

export default function OrderConfirmPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/api/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(console.error);
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0D1B2A] font-['Inter',sans-serif]">
      <Navbar />
      <div className="max-w-lg mx-auto px-8 pt-32 pb-20 text-center">

        {/* success icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-400/10 border border-emerald-400/30
                        flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
            stroke="#4CAF82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h1 className="font-['Playfair_Display',serif] text-[32px] font-bold text-[#F5F0E8] mb-2">
          Order Placed!
        </h1>
        <p className="text-[14px] text-[#9A9490] mb-8">
          Thank you for your order. We'll process it right away.
        </p>

        {order && (
          <div className="bg-[#1B2E45] rounded-xl border border-[#C9A84C]/15 p-6 text-left mb-8">
            <div className="flex justify-between mb-3">
              <span className="text-[12px] text-[#9A9490]">Order ID</span>
              <span className="text-[12px] text-[#C9A84C] font-medium">
                #{order._id.slice(-6).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-[12px] text-[#9A9490]">Status</span>
              <span className="text-[12px] text-[#C9A84C] font-medium">{order.status}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-[12px] text-[#9A9490]">Items</span>
              <span className="text-[12px] text-[#F5F0E8]">{order.orderItems?.length}</span>
            </div>
            <div className="border-t border-[#C9A84C]/10 pt-3 flex justify-between">
              <span className="text-[13px] font-semibold text-[#F5F0E8]">Total</span>
              <span className="text-[16px] font-bold text-[#C9A84C]">
                ${Number(order.totalPrice).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Link to="/"
            className="flex-1 h-11 flex items-center justify-center rounded-xl border border-[#C9A84C]/30
                       text-[#C9A84C] text-[14px] font-medium hover:bg-[#C9A84C]/10 transition-colors">
            Back to home
          </Link>
          <Link to="/orders"
            className="flex-1 h-11 flex items-center justify-center rounded-xl bg-[#C9A84C]
                       text-[#0D1B2A] text-[14px] font-medium hover:bg-[#E8D5A3] transition-colors">
            My orders
          </Link>
        </div>
      </div>
    </div>
  );
}
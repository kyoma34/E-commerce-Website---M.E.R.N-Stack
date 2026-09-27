import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const STATUS_STYLE = {
  Delivered:  "bg-emerald-400/10 text-emerald-400",
  Shipped:    "bg-blue-400/10 text-blue-400",
  Processing: "bg-[#C9A84C]/10 text-[#C9A84C]",
  Cancelled:  "bg-red-400/10 text-red-400",
};

const STAT_ICONS = {
  revenue: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  orders:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  products:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>,
  users:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
};

export default function AdminOverview() {
  const [stats, setStats]   = useState({ revenue: 0, orders: 0, products: 0, users: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          api.get("/api/orders"),
          api.get("/api/products"),
          api.get("/api/users"),
        ]);

        const orders   = ordersRes.data;
        const products = productsRes.data;
        const users    = usersRes.data;

        // compute total revenue from all orders
        const revenue = orders.reduce((sum, o) => sum + (o.totalPrice ?? 0), 0);

        setStats({
          revenue,
          orders:   orders.length,
          products: products.length,
          users:    users.length,
        });

        // 5 most recent orders
        setRecent(orders.slice(0, 5));
      } catch (err) {
        console.error("Overview fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const STAT_CARDS = [
    { label: "Total Revenue",    value: `$${stats.revenue.toLocaleString()}`, icon: STAT_ICONS.revenue },
    { label: "Total Orders",     value: stats.orders.toLocaleString(),         icon: STAT_ICONS.orders  },
    { label: "Total Products",   value: stats.products.toLocaleString(),       icon: STAT_ICONS.products},
    { label: "Registered Users", value: stats.users.toLocaleString(),          icon: STAT_ICONS.users   },
  ];

  const getOrderId   = (o) => `#${o._id.slice(-6).toUpperCase()}`;
  const getCustomer  = (o) => o.user ? `${o.user.firstName} ${o.user.lastName}` : "—";
  const getProduct   = (o) => o.orderItems?.[0]?.name ?? "—";
  const getDate      = (o) => new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="space-y-6">

      {/* stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon }) => (
          <div key={label} className="bg-[#0D1B2A] border border-[#C9A84C]/15 rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <span className="text-[12px] text-[#9A9490] font-medium">{label}</span>
              {icon}
            </div>
            <p className="text-[26px] font-bold text-[#F5F0E8] mb-1">
              {loading ? <span className="text-[#9A9490] text-[18px]">—</span> : value}
            </p>
          </div>
        ))}
      </div>

      {/* recent orders */}
      <div className="bg-[#0D1B2A] border border-[#C9A84C]/15 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#C9A84C]/10">
          <h2 className="text-[14px] font-semibold text-[#F5F0E8]">Recent Orders</h2>
          <Link to="/admin/orders" className="text-[12px] text-[#C9A84C] hover:text-[#E8D5A3] transition-colors">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#C9A84C]/10">
                {["Order", "Customer", "Product", "Amount", "Date", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[#9A9490] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-[#9A9490]">Loading...</td></tr>
              ) : recent.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-[#9A9490]">No orders yet.</td></tr>
              ) : recent.map((o, i) => (
                <tr key={o._id}
                  className={`border-b border-[#C9A84C]/05 hover:bg-[#1B2E45]/40 transition-colors
                              ${i === recent.length - 1 ? "border-none" : ""}`}>
                  <td className="px-5 py-3.5 text-[#C9A84C] font-medium">{getOrderId(o)}</td>
                  <td className="px-5 py-3.5 text-[#F5F0E8]">{getCustomer(o)}</td>
                  <td className="px-5 py-3.5 text-[#9A9490]">{getProduct(o)}</td>
                  <td className="px-5 py-3.5 text-[#F5F0E8] font-medium">${Number(o.totalPrice).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-[#9A9490]">{getDate(o)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${STATUS_STYLE[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
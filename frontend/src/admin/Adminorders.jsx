import { useState, useEffect } from "react";
import api from "../utils/api";

const STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLE = {
  Delivered:  "bg-emerald-400/10 text-emerald-400",
  Shipped:    "bg-blue-400/10 text-blue-400",
  Processing: "bg-[#C9A84C]/10 text-[#C9A84C]",
  Cancelled:  "bg-red-400/10 text-red-400",
};

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-[#0D1B2A] border border-[#C9A84C]/20 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[15px] font-semibold text-[#F5F0E8]">{title}</h3>
          <button onClick={onClose} className="text-[#9A9490] hover:text-[#F5F0E8] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("All");
  const [modal, setModal]         = useState(null);
  const [selected, setSelected]   = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving]       = useState(false);

  // ── fetch all orders ────────────────────────────────────
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/orders");
      setOrders(data);
    } catch {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const openStatus = (o) => { setSelected(o); setNewStatus(o.status); setModal("status"); };
  const close = () => { setModal(null); setSelected(null); setSaving(false); };

  // ── update status ───────────────────────────────────────
  const saveStatus = async () => {
    try {
      setSaving(true);
      await api.put(`/api/orders/${selected._id}/status`, { status: newStatus });
      await fetchOrders();
      close();
    } catch {
      setError("Failed to update order status.");
      setSaving(false);
    }
  };

  // ── helpers to read populated fields ───────────────────
  const getCustomerName  = (o) => o.user ? `${o.user.firstName} ${o.user.lastName}` : "—";
  const getCustomerEmail = (o) => o.user?.email ?? "—";
  const getFirstProduct  = (o) => o.orderItems?.[0]?.name ?? "—";
  const getOrderId       = (o) => `#${o._id.slice(-6).toUpperCase()}`;
  const getDate          = (o) => new Date(o.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const filtered = orders.filter((o) => {
    const name  = getCustomerName(o).toLowerCase();
    const id    = getOrderId(o).toLowerCase();
    const prod  = getFirstProduct(o).toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) ||
                        id.includes(search.toLowerCase()) ||
                        prod.includes(search.toLowerCase());
    const matchFilter = filter === "All" || o.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-4">

      {/* error banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] px-4 py-3 rounded-lg flex justify-between">
          {error}
          <button onClick={() => setError("")} className="text-red-300 hover:text-red-200">✕</button>
        </div>
      )}

      {/* toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9490]" width="15" height="15"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="pl-9 pr-4 h-9 bg-[#0D1B2A] border border-[#C9A84C]/15 rounded-lg text-[13px]
                       text-[#F5F0E8] placeholder-[#9A9490] outline-none focus:border-[#C9A84C] transition-colors w-64" />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {["All", ...STATUSES].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`h-8 px-3 rounded-lg text-[12px] font-medium transition-colors
                ${filter === s
                  ? "bg-[#C9A84C] text-[#0D1B2A]"
                  : "bg-[#0D1B2A] border border-[#C9A84C]/15 text-[#9A9490] hover:text-[#F5F0E8]"}`}>
              {s}
            </button>
          ))}
        </div>

        <span className="text-[12px] text-[#9A9490] ml-auto">{filtered.length} orders</span>
      </div>

      {/* table */}
      <div className="bg-[#0D1B2A] border border-[#C9A84C]/15 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#C9A84C]/10">
                {["Order ID", "Customer", "Product", "Amount", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[#9A9490] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-[#9A9490] text-[13px]">Loading...</td></tr>
              ) : filtered.map((o, i) => (
                <tr key={o._id}
                  className={`border-b border-[#C9A84C]/05 hover:bg-[#1B2E45]/40 transition-colors
                              ${i === filtered.length - 1 ? "border-none" : ""}`}>
                  <td className="px-5 py-3.5 text-[#C9A84C] font-medium">{getOrderId(o)}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-[#F5F0E8] font-medium">{getCustomerName(o)}</p>
                    <p className="text-[11px] text-[#9A9490]">{getCustomerEmail(o)}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[#9A9490]">{getFirstProduct(o)}</td>
                  <td className="px-5 py-3.5 text-[#F5F0E8] font-medium">${Number(o.totalPrice).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-[#9A9490]">{getDate(o)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${STATUS_STYLE[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => openStatus(o)}
                      className="h-7 px-3 text-[11px] font-medium text-[#9A9490] border border-[#C9A84C]/20
                                 rounded-lg hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
                      Update
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-[#9A9490] text-[13px]">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update status modal */}
      {modal === "status" && (
        <Modal title="Update Order Status" onClose={close}>
          <p className="text-[13px] text-[#9A9490] mb-4">
            Order <span className="text-[#C9A84C] font-medium">{getOrderId(selected)}</span> — {getFirstProduct(selected)}
          </p>
          <div className="space-y-2 mb-5">
            {STATUSES.map((s) => (
              <button key={s} onClick={() => setNewStatus(s)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-[13px] text-left transition-colors
                  ${newStatus === s
                    ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#F5F0E8]"
                    : "border-[#C9A84C]/10 text-[#9A9490] hover:bg-[#1B2E45]"}`}>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  s === "Delivered" ? "bg-emerald-400" :
                  s === "Shipped"   ? "bg-blue-400" :
                  s === "Processing"? "bg-[#C9A84C]" : "bg-red-400"}`} />
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={close} className="flex-1 h-10 rounded-lg border border-[#C9A84C]/20 text-[#9A9490] text-[13px] hover:bg-[#1B2E45] transition-colors">Cancel</button>
            <button onClick={saveStatus} disabled={saving}
              className="flex-1 h-10 rounded-lg bg-[#C9A84C] text-[#0D1B2A] text-[13px] font-medium hover:bg-[#E8D5A3] transition-colors disabled:opacity-60">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}
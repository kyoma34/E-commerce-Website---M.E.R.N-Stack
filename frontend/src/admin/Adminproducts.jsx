import { useState, useEffect } from "react";
import api from "../utils/api";
import ImageUpload from "../components/ImageUpload";

const EMPTY_FORM = { name: "", category: "", price: "", stock: "", status: "Active", description: "", image: "" };
const CATEGORIES = ["Headphones", "Laptop", "Smartphone", "Display", "Audio", "Accessories"];

const STATUS_STYLE = {
  "Active":       "bg-emerald-400/10 text-emerald-400",
  "Out of stock": "bg-red-400/10 text-red-400",
  "Draft":        "bg-[#9A9490]/10 text-[#9A9490]",
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

function InputField({ label, name, value, onChange, type = "text", as, children }) {
  const cls = "w-full h-10 px-3 bg-[#1B2E45] border border-[#C9A84C]/20 rounded-lg text-[13px] text-[#F5F0E8] placeholder-[#9A9490] outline-none focus:border-[#C9A84C] transition-colors";
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-[#9A9490] mb-1.5">{label}</label>
      {as === "select"
        ? <select name={name} value={value} onChange={onChange} className={cls}>{children}</select>
        : <input type={type} name={name} value={value} onChange={onChange} placeholder={label} className={cls} />}
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [search, setSearch]     = useState("");
  const [saving, setSaving]     = useState(false);

  // ── fetch all products ──────────────────────────────────
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/products");
      setProducts(data);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // ── modal helpers ───────────────────────────────────────
  const openAdd  = () => { setForm(EMPTY_FORM); setModal("add"); };
  const openEdit = (p) => {
    setSelected(p);
    setForm({ name: p.name, category: p.category, price: String(p.price),
              stock: String(p.stock ?? ""), status: p.state ?? "Active",
              description: p.description ?? "", image: p.image ?? "" });
    setModal("edit");
  };
  const openDel = (p) => { setSelected(p); setModal("delete"); };
  const close   = () => { setModal(null); setSelected(null); setSaving(false); };
  const change  = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── create ──────────────────────────────────────────────
  const saveAdd = async () => {
    try {
      setSaving(true);
      await api.post("/api/products", {
        name:        form.name,
        category:    form.category,
        price:       Number(form.price),
        stock:       Number(form.stock),
        state:       form.status,
        description: form.description,
        image:       form.image,
      });
      await fetchProducts();
      close();
    } catch {
      setSaving(false);
      setError("Failed to add product.");
    }
  };

  // ── update ──────────────────────────────────────────────
  const saveEdit = async () => {
    try {
      setSaving(true);
      await api.put(`/api/products/${selected._id}`, {
        name:        form.name,
        category:    form.category,
        price:       Number(form.price),
        stock:       Number(form.stock),
        state:       form.status,
        description: form.description,
        image:       form.image,
      });
      await fetchProducts();
      close();
    } catch {
      setSaving(false);
      setError("Failed to update product.");
    }
  };

  // ── delete ──────────────────────────────────────────────
  const confirmDel = async () => {
    try {
      setSaving(true);
      await api.delete(`/api/products/${selected._id}`);
      await fetchProducts();
      close();
    } catch {
      setSaving(false);
      setError("Failed to delete product.");
    }
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9490]" width="15" height="15"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-9 pr-4 h-9 bg-[#0D1B2A] border border-[#C9A84C]/15 rounded-lg text-[13px]
                       text-[#F5F0E8] placeholder-[#9A9490] outline-none focus:border-[#C9A84C] transition-colors w-64" />
        </div>
        <button onClick={openAdd}
          className="h-9 px-4 bg-[#C9A84C] text-[#0D1B2A] text-[13px] font-medium rounded-lg
                     hover:bg-[#E8D5A3] transition-colors flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Product
        </button>
      </div>

      {/* table */}
      <div className="bg-[#0D1B2A] border border-[#C9A84C]/15 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#C9A84C]/10">
                {["Name", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[#9A9490] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-[#9A9490] text-[13px]">Loading...</td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p._id}
                  className={`border-b border-[#C9A84C]/05 hover:bg-[#1B2E45]/40 transition-colors
                              ${i === filtered.length - 1 ? "border-none" : ""}`}>
                  <td className="px-5 py-3.5 text-[#F5F0E8] font-medium">{p.name}</td>
                  <td className="px-5 py-3.5 text-[#9A9490]">{p.category}</td>
                  <td className="px-5 py-3.5 text-[#F5F0E8]">${Number(p.price).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-[#F5F0E8]">{p.stock ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${STATUS_STYLE[p.state] ?? "bg-[#1B2E45] text-[#9A9490]"}`}>
                      {p.state}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)}
                        className="p-1.5 text-[#9A9490] hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded-lg transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button onClick={() => openDel(p)}
                        className="p-1.5 text-[#9A9490] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6"/><path d="M14 11v6"/>
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-[#9A9490] text-[13px]">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      {modal === "add" && (
        <Modal title="Add Product" onClose={close}>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            <InputField label="Product Name" name="name" value={form.name} onChange={change} />
            <InputField label="Category" name="category" value={form.category} onChange={change} as="select">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </InputField>
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Price ($)" name="price" type="number" value={form.price} onChange={change} />
              <InputField label="Stock" name="stock" type="number" value={form.stock} onChange={change} />
            </div>
            <ImageUpload value={form.image} onChange={(url) => setForm(f => ({ ...f, image: url }))} />
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#9A9490] mb-1.5">Description</label>
              <textarea name="description" value={form.description} onChange={change} rows={3}
                placeholder="Product description..."
                className="w-full px-3 py-2 bg-[#1B2E45] border border-[#C9A84C]/20 rounded-lg text-[13px]
                           text-[#F5F0E8] placeholder-[#9A9490] outline-none focus:border-[#C9A84C]
                           transition-colors resize-none" />
            </div>
            <InputField label="Status" name="status" value={form.status} onChange={change} as="select">
              {["Active", "Draft", "Out of stock"].map((s) => <option key={s} value={s}>{s}</option>)}
            </InputField>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={close} className="flex-1 h-10 rounded-lg border border-[#C9A84C]/20 text-[#9A9490] text-[13px] hover:bg-[#1B2E45] transition-colors">Cancel</button>
            <button onClick={saveAdd} disabled={saving}
              className="flex-1 h-10 rounded-lg bg-[#C9A84C] text-[#0D1B2A] text-[13px] font-medium hover:bg-[#E8D5A3] transition-colors disabled:opacity-60">
              {saving ? "Saving..." : "Add Product"}
            </button>
          </div>
        </Modal>
      )}

      {/* Edit modal */}
      {modal === "edit" && (
        <Modal title="Edit Product" onClose={close}>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            <InputField label="Product Name" name="name" value={form.name} onChange={change} />
            <InputField label="Category" name="category" value={form.category} onChange={change} as="select">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </InputField>
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Price ($)" name="price" type="number" value={form.price} onChange={change} />
              <InputField label="Stock" name="stock" type="number" value={form.stock} onChange={change} />
            </div>
            <ImageUpload value={form.image} onChange={(url) => setForm(f => ({ ...f, image: url }))} />
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#9A9490] mb-1.5">Description</label>
              <textarea name="description" value={form.description} onChange={change} rows={3}
                placeholder="Product description..."
                className="w-full px-3 py-2 bg-[#1B2E45] border border-[#C9A84C]/20 rounded-lg text-[13px]
                           text-[#F5F0E8] placeholder-[#9A9490] outline-none focus:border-[#C9A84C]
                           transition-colors resize-none" />
            </div>
            <InputField label="Status" name="status" value={form.status} onChange={change} as="select">
              {["Active", "Draft", "Out of stock"].map((s) => <option key={s} value={s}>{s}</option>)}
            </InputField>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={close} className="flex-1 h-10 rounded-lg border border-[#C9A84C]/20 text-[#9A9490] text-[13px] hover:bg-[#1B2E45] transition-colors">Cancel</button>
            <button onClick={saveEdit} disabled={saving}
              className="flex-1 h-10 rounded-lg bg-[#C9A84C] text-[#0D1B2A] text-[13px] font-medium hover:bg-[#E8D5A3] transition-colors disabled:opacity-60">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {modal === "delete" && (
        <Modal title="Delete Product" onClose={close}>
          <p className="text-[13px] text-[#9A9490] mb-5">
            Are you sure you want to delete <span className="text-[#F5F0E8] font-medium">"{selected?.name}"</span>? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button onClick={close} className="flex-1 h-10 rounded-lg border border-[#C9A84C]/20 text-[#9A9490] text-[13px] hover:bg-[#1B2E45] transition-colors">Cancel</button>
            <button onClick={confirmDel} disabled={saving}
              className="flex-1 h-10 rounded-lg bg-red-500 text-white text-[13px] font-medium hover:bg-red-400 transition-colors disabled:opacity-60">
              {saving ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}
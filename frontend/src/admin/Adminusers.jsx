import { useState, useEffect } from "react";
import api from "../utils/api";

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

export default function AdminUsers() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── fetch all users ─────────────────────────────────────
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/users");
      setUsers(data);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openDel = (u) => { setSelected(u); setModal("delete"); };
  const close   = () => { setModal(null); setSelected(null); setDeleting(false); };

  // ── delete user ─────────────────────────────────────────
  const confirmDel = async () => {
    try {
      setDeleting(true);
      await api.delete(`/api/users/${selected._id}`);
      await fetchUsers();
      close();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
      setDeleting(false);
    }
  };

  const filtered = users.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase()) ||
           u.email.toLowerCase().includes(search.toLowerCase());
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
      <div className="flex items-center gap-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9490]" width="15" height="15"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="pl-9 pr-4 h-9 bg-[#0D1B2A] border border-[#C9A84C]/15 rounded-lg text-[13px]
                       text-[#F5F0E8] placeholder-[#9A9490] outline-none focus:border-[#C9A84C] transition-colors w-64" />
        </div>
        <span className="text-[12px] text-[#9A9490] ml-auto">{filtered.length} users</span>
      </div>

      {/* table */}
      <div className="bg-[#0D1B2A] border border-[#C9A84C]/15 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#C9A84C]/10">
                {["User", "Email", "Role", "Joined", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[#9A9490] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-[#9A9490] text-[13px]">Loading...</td></tr>
              ) : filtered.map((u, i) => (
                <tr key={u._id}
                  className={`border-b border-[#C9A84C]/05 hover:bg-[#1B2E45]/40 transition-colors
                              ${i === filtered.length - 1 ? "border-none" : ""}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-[#1B2E45] border border-[#C9A84C]/30
                                       flex items-center justify-center text-[11px] text-[#F5F0E8] font-medium flex-shrink-0">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </span>
                      <span className="text-[#F5F0E8] font-medium">{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#9A9490]">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium
                      ${u.isAdmin ? "bg-[#C9A84C]/15 text-[#C9A84C]" : "bg-[#1B2E45] text-[#9A9490]"}`}>
                      {u.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#9A9490]">
                    {new Date(u.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => openDel(u)}
                      disabled={u.isAdmin}
                      className="p-1.5 text-[#9A9490] hover:text-red-400 hover:bg-red-400/10 rounded-lg
                                 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-[#9A9490] text-[13px]">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm */}
      {modal === "delete" && (
        <Modal title="Delete Account" onClose={close}>
          <p className="text-[13px] text-[#9A9490] mb-5">
            Permanently delete the account of{" "}
            <span className="text-[#F5F0E8] font-medium">
              "{selected?.firstName} {selected?.lastName}"
            </span>? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button onClick={close} className="flex-1 h-10 rounded-lg border border-[#C9A84C]/20 text-[#9A9490] text-[13px] hover:bg-[#1B2E45] transition-colors">Cancel</button>
            <button onClick={confirmDel} disabled={deleting}
              className="flex-1 h-10 rounded-lg bg-red-500 text-white text-[13px] font-medium hover:bg-red-400 transition-colors disabled:opacity-60">
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}
import { useRef, useState } from "react";
import api from "../utils/api";

export default function ImageUpload({ value, onChange }) {
  const inputRef            = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // client-side size guard (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onChange(data.url);   // pass URL back to parent form
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-[#9A9490] mb-1.5">
        Product Image
      </label>

      {/* preview */}
      {value && (
        <div className="relative mb-2 w-full h-36 rounded-lg overflow-hidden bg-[#0D1B2A] border border-[#C9A84C]/20">
          <img src={value} alt="Preview" className="w-full h-full object-contain" />
          <button
            type="button"
            onClick={() => { onChange(""); if (inputRef.current) inputRef.current.value = ""; }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white
                       flex items-center justify-center text-[12px] hover:bg-black/80 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* upload button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`w-full h-10 flex items-center justify-center gap-2 rounded-lg border
                    text-[13px] transition-colors
                    ${uploading
                      ? "border-[#C9A84C]/20 text-[#9A9490] cursor-not-allowed"
                      : "border-[#C9A84C]/30 text-[#9A9490] hover:border-[#C9A84C] hover:text-[#F5F0E8]"}`}
      >
        {uploading ? (
          <>
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            {value ? "Change image" : "Choose image"}
          </>
        )}
      </button>

      {/* hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />

      {error && <p className="text-[11px] text-[#E05C5C] mt-1">{error}</p>}
    </div>
  );
}
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  moq: string;
  leadTime: string;
  image: string;
  featured: boolean;
};

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image: string;
};

type Settings = {
  companyName: string;
  tagline: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroBadge: string;
  aboutTitle: string;
  aboutText: string;
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  moqNote: string;
  leadTimeNote: string;
  complianceNote: string;
  registeredNote: string;
  logo: string;
  favicon: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  footerText: string;
  bangladeshText: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "products" | "gallery" | "content" | "branding" | "seo">("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const logoRef = useRef<HTMLInputElement>(null);
  const favRef = useRef<HTMLInputElement>(null);
  const productImgRef = useRef<HTMLInputElement>(null);
  const galleryImgRef = useRef<HTMLInputElement>(null);

  const emptyProduct: Product = { id: "", name: "", description: "", category: "Knit", moq: "500 pcs", leadTime: "45-55 days", image: "", featured: false };
  const emptyGallery: GalleryItem = { id: "", title: "", category: "Production", image: "" };

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [pRes, gRes, sRes] = await Promise.all([
        fetch("/api/products", { credentials: "include" }),
        fetch("/api/gallery", { credentials: "include" }),
        fetch("/api/settings", { credentials: "include" }),
      ]);
      if (pRes.status === 401) { router.push("/admin/login"); return; }
      setProducts(await pRes.json());
      setGallery(await gRes.json());
      setSettings(await sRes.json());
    } catch { setMsg("Failed to load"); }
    finally { setLoading(false); }
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE", credentials: "include" });
    router.push("/admin/login");
  }

  async function uploadFile(file: File, type: string): Promise<string | null> {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (data.success) return data.url;
      setMsg(data.error || "Upload failed");
      return null;
    } catch {
      setMsg("Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    const res = await fetch("/api/products", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing), credentials: "include" });
    if (res.status === 401) { router.push("/admin/login"); return; }
    if (res.ok) {
      setMsg(editing.id ? "Product updated" : "Product added");
      setShowForm(false);
      setEditing(null);
      loadData();
    } else setMsg("Failed to save product");
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products?id=${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) { setMsg("Product deleted"); loadData(); }
  }

  async function saveGalleryItem(e: React.FormEvent) {
    e.preventDefault();
    if (!editingGallery) return;
    const method = editingGallery.id ? "PUT" : "POST";
    const res = await fetch("/api/gallery", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingGallery), credentials: "include" });
    if (res.ok) {
      setMsg(editingGallery.id ? "Gallery item updated" : "Gallery item added");
      setShowGalleryForm(false);
      setEditingGallery(null);
      loadData();
    } else setMsg("Failed to save");
  }

  async function deleteGallery(id: string) {
    if (!confirm("Delete this image?")) return;
    const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) { setMsg("Deleted"); loadData(); }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings), credentials: "include" });
    if (res.status === 401) { router.push("/admin/login"); return; }
    if (res.ok) setMsg("Settings saved! Refresh homepage to see changes.");
    else setMsg("Failed to save");
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-500 text-sm">Loading dashboard...</div>;
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "products", label: "Products" },
    { id: "gallery", label: "Gallery" },
    { id: "content", label: "Content" },
    { id: "branding", label: "Logo & Brand" },
    { id: "seo", label: "SEO" },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-bold text-teal-900 text-sm">BIWOR<span className="text-amber-500">SOURCING</span></Link>
            <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-medium">ADMIN</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-xs text-slate-500 hover:text-teal-700">View Website ↗</Link>
            <button onClick={logout} className="text-xs text-red-600 font-medium">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <aside className="w-44 flex-shrink-0 hidden md:block">
          <nav className="space-y-0.5 sticky top-20">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${tab === t.id ? "bg-teal-800 text-white" : "text-slate-600 hover:bg-white"}`}>
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="md:hidden w-full overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-max">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === t.id ? "bg-teal-800 text-white" : "bg-white text-slate-600 border"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {msg && (
            <div className="mb-4 p-3 bg-teal-50 border border-teal-100 text-teal-800 rounded-lg text-sm flex justify-between">
              <span>{msg}</span>
              <button onClick={() => setMsg("")} className="text-lg leading-none">×</button>
            </div>
          )}

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div>
              <h1 className="text-xl font-bold text-slate-900 mb-1">Dashboard</h1>
              <p className="text-sm text-slate-500 mb-6">Full control of your BIWORSOURCING website</p>
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-bold">{products.length}</div><div className="text-sm text-slate-500">Products</div></div>
                <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-bold">{gallery.length}</div><div className="text-sm text-slate-500">Gallery Images</div></div>
                <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-bold text-teal-700">Live</div><div className="text-sm text-slate-500">Website</div></div>
              </div>
              <div className="bg-white rounded-xl border p-5">
                <h2 className="font-semibold mb-3">Quick Actions</h2>
                <div className="flex flex-wrap gap-2">
                  {tabs.slice(1).map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)} className="text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg">{t.label}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {tab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h1 className="text-xl font-bold">Products</h1>
                  <p className="text-sm text-slate-500">Add products with images — they appear on the homepage</p>
                </div>
                <button onClick={() => { setEditing({ ...emptyProduct }); setShowForm(true); }} className="bg-teal-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-900">+ Add Product</button>
              </div>

              {showForm && editing && (
                <form onSubmit={saveProduct} className="mb-6 p-5 bg-white rounded-xl border space-y-3">
                  <h2 className="font-semibold">{editing.id ? "Edit Product" : "New Product"}</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input className="px-3 py-2 border rounded-lg text-sm" placeholder="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
                    <input className="px-3 py-2 border rounded-lg text-sm" placeholder="Category" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
                    <input className="px-3 py-2 border rounded-lg text-sm" placeholder="MOQ" value={editing.moq} onChange={(e) => setEditing({ ...editing, moq: e.target.value })} />
                    <input className="px-3 py-2 border rounded-lg text-sm" placeholder="Lead Time" value={editing.leadTime} onChange={(e) => setEditing({ ...editing, leadTime: e.target.value })} />
                  </div>
                  <textarea className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Description" rows={2} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                  
                  {/* Product Image Upload */}
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-slate-100 rounded-lg border overflow-hidden flex items-center justify-center">
                      {editing.image ? <img src={editing.image} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-slate-400">No image</span>}
                    </div>
                    <div>
                      <input ref={productImgRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const url = await uploadFile(f, "product");
                          if (url) setEditing({ ...editing, image: url });
                        }
                      }} />
                      <button type="button" disabled={uploading} onClick={() => productImgRef.current?.click()} className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg disabled:opacity-50">
                        {uploading ? "Uploading..." : "Upload Image"}
                      </button>
                      {editing.image && <button type="button" onClick={() => setEditing({ ...editing, image: "" })} className="ml-2 text-sm text-red-600">Remove</button>}
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured</label>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-teal-800 text-white text-sm px-4 py-2 rounded-lg">Save</button>
                    <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="text-sm px-4 py-2 border rounded-lg">Cancel</button>
                  </div>
                </form>
              )}

              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Image</th>
                      <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Name</th>
                      <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase hidden sm:table-cell">Category</th>
                      <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t border-slate-100">
                        <td className="px-4 py-2">
                          <div className="w-12 h-12 bg-slate-100 rounded overflow-hidden">
                            {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-slate-300">—</div>}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">{p.name}</td>
                        <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">{p.category}</td>
                        <td className="px-4 py-3 space-x-3">
                          <button onClick={() => { setEditing(p); setShowForm(true); }} className="text-teal-700 text-xs font-medium hover:underline">Edit</button>
                          <button onClick={() => deleteProduct(p.id)} className="text-red-600 text-xs font-medium hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GALLERY */}
          {tab === "gallery" && (
            <div>
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h1 className="text-xl font-bold">Factory Gallery</h1>
                  <p className="text-sm text-slate-500">Upload factory & production photos for the website</p>
                </div>
                <button onClick={() => { setEditingGallery({ ...emptyGallery }); setShowGalleryForm(true); }} className="bg-teal-800 text-white text-sm font-medium px-4 py-2 rounded-lg">+ Add Image</button>
              </div>

              {showGalleryForm && editingGallery && (
                <form onSubmit={saveGalleryItem} className="mb-6 p-5 bg-white rounded-xl border space-y-3">
                  <h2 className="font-semibold">{editingGallery.id ? "Edit" : "New"} Gallery Item</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input className="px-3 py-2 border rounded-lg text-sm" placeholder="Title" value={editingGallery.title} onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })} required />
                    <select className="px-3 py-2 border rounded-lg text-sm" value={editingGallery.category} onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}>
                      <option>Production</option>
                      <option>QC</option>
                      <option>Packing</option>
                      <option>Shipping</option>
                      <option>Products</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-24 bg-slate-100 rounded-lg border overflow-hidden flex items-center justify-center">
                      {editingGallery.image ? <img src={editingGallery.image} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-slate-400">No image</span>}
                    </div>
                    <div>
                      <input ref={galleryImgRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const url = await uploadFile(f, "gallery");
                          if (url) setEditingGallery({ ...editingGallery, image: url });
                        }
                      }} />
                      <button type="button" disabled={uploading} onClick={() => galleryImgRef.current?.click()} className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg disabled:opacity-50">
                        {uploading ? "Uploading..." : "Upload Photo"}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-teal-800 text-white text-sm px-4 py-2 rounded-lg">Save</button>
                    <button type="button" onClick={() => { setShowGalleryForm(false); setEditingGallery(null); }} className="text-sm px-4 py-2 border rounded-lg">Cancel</button>
                  </div>
                </form>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery.map((g) => (
                  <div key={g.id} className="bg-white rounded-xl border overflow-hidden">
                    <div className="aspect-[4/3] bg-slate-100 relative">
                      {g.image ? <img src={g.image} alt={g.title} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm">No image</div>}
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">{g.title}</div>
                        <div className="text-xs text-slate-500">{g.category}</div>
                      </div>
                      <div className="space-x-2">
                        <button onClick={() => { setEditingGallery(g); setShowGalleryForm(true); }} className="text-teal-700 text-xs font-medium">Edit</button>
                        <button onClick={() => deleteGallery(g.id)} className="text-red-600 text-xs font-medium">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
                {gallery.length === 0 && <p className="text-slate-400 text-sm col-span-full py-8 text-center">No gallery images yet. Upload factory photos.</p>}
              </div>
            </div>
          )}

          {/* CONTENT */}
          {tab === "content" && settings && (
            <div>
              <h1 className="text-xl font-bold mb-1">Website Content</h1>
              <p className="text-sm text-slate-500 mb-6">Edit all text on the homepage</p>
              <form onSubmit={saveSettings} className="bg-white rounded-xl border p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium text-slate-500 mb-1">Company Name</label><input className="w-full px-3 py-2 border rounded-lg text-sm" value={settings.companyName} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} /></div>
                  <div><label className="block text-xs font-medium text-slate-500 mb-1">Hero Badge</label><input className="w-full px-3 py-2 border rounded-lg text-sm" value={settings.heroBadge} onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })} /></div>
                </div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Hero Title</label><input className="w-full px-3 py-2 border rounded-lg text-sm" value={settings.heroTitle} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Hero Highlight (italic line)</label><input className="w-full px-3 py-2 border rounded-lg text-sm" value={settings.heroHighlight} onChange={(e) => setSettings({ ...settings, heroHighlight: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Hero Subtitle</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} value={settings.heroSubtitle} onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">About Title</label><input className="w-full px-3 py-2 border rounded-lg text-sm" value={settings.aboutTitle} onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">About Text</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} value={settings.aboutText} onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Bangladesh Story Text</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} value={settings.bangladeshText} onChange={(e) => setSettings({ ...settings, bangladeshText: e.target.value })} /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium text-slate-500 mb-1">Address</label><input className="w-full px-3 py-2 border rounded-lg text-sm" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} /></div>
                  <div><label className="block text-xs font-medium text-slate-500 mb-1">Email</label><input className="w-full px-3 py-2 border rounded-lg text-sm" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} /></div>
                  <div><label className="block text-xs font-medium text-slate-500 mb-1">Phone</label><input className="w-full px-3 py-2 border rounded-lg text-sm" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} /></div>
                  <div><label className="block text-xs font-medium text-slate-500 mb-1">WhatsApp (with country code)</label><input className="w-full px-3 py-2 border rounded-lg text-sm" value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="8801XXXXXXXXX" /></div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div><label className="block text-xs font-medium text-slate-500 mb-1">MOQ Note</label><input className="w-full px-3 py-2 border rounded-lg text-sm" value={settings.moqNote} onChange={(e) => setSettings({ ...settings, moqNote: e.target.value })} /></div>
                  <div><label className="block text-xs font-medium text-slate-500 mb-1">Lead Time Note</label><input className="w-full px-3 py-2 border rounded-lg text-sm" value={settings.leadTimeNote} onChange={(e) => setSettings({ ...settings, leadTimeNote: e.target.value })} /></div>
                  <div><label className="block text-xs font-medium text-slate-500 mb-1">Compliance Note</label><input className="w-full px-3 py-2 border rounded-lg text-sm" value={settings.complianceNote} onChange={(e) => setSettings({ ...settings, complianceNote: e.target.value })} /></div>
                </div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Footer Text</label><textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} value={settings.footerText} onChange={(e) => setSettings({ ...settings, footerText: e.target.value })} /></div>
                <button type="submit" className="bg-teal-800 hover:bg-teal-900 text-white font-medium px-6 py-2.5 rounded-lg text-sm">Save Content</button>
              </form>
            </div>
          )}

          {/* BRANDING */}
          {tab === "branding" && settings && (
            <div>
              <h1 className="text-xl font-bold mb-1">Logo & Branding</h1>
              <p className="text-sm text-slate-500 mb-6">Upload logo and favicon</p>
              <form onSubmit={saveSettings} className="space-y-6">
                <div className="bg-white rounded-xl border p-6">
                  <h2 className="font-semibold mb-1">Website Logo</h2>
                  <p className="text-xs text-slate-500 mb-4">PNG/SVG recommended, transparent background</p>
                  <div className="flex items-center gap-6">
                    <div className="w-40 h-16 bg-slate-100 rounded-lg border flex items-center justify-center overflow-hidden">
                      {settings.logo ? <img src={settings.logo} alt="Logo" className="max-h-12 max-w-full object-contain" /> : <span className="text-xs text-slate-400">No logo</span>}
                    </div>
                    <div>
                      <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) { const url = await uploadFile(f, "logo"); if (url) setSettings({ ...settings, logo: url }); }
                      }} />
                      <button type="button" disabled={uploading} onClick={() => logoRef.current?.click()} className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg disabled:opacity-50">{uploading ? "Uploading..." : "Upload Logo"}</button>
                      {settings.logo && <button type="button" onClick={() => setSettings({ ...settings, logo: "" })} className="ml-2 text-sm text-red-600">Remove</button>}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border p-6">
                  <h2 className="font-semibold mb-1">Favicon (Tab Icon)</h2>
                  <p className="text-xs text-slate-500 mb-4">.ico or 32×32 / 64×64 PNG</p>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg border flex items-center justify-center overflow-hidden">
                      {settings.favicon ? <img src={settings.favicon} alt="Favicon" className="w-8 h-8 object-contain" /> : <span className="text-[10px] text-slate-400">None</span>}
                    </div>
                    <div>
                      <input ref={favRef} type="file" accept="image/*,.ico" className="hidden" onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) { const url = await uploadFile(f, "favicon"); if (url) setSettings({ ...settings, favicon: url }); }
                      }} />
                      <button type="button" disabled={uploading} onClick={() => favRef.current?.click()} className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg disabled:opacity-50">{uploading ? "Uploading..." : "Upload Favicon"}</button>
                    </div>
                  </div>
                </div>
                <button type="submit" className="bg-teal-800 hover:bg-teal-900 text-white font-medium px-6 py-2.5 rounded-lg text-sm">Save Branding</button>
              </form>
            </div>
          )}

          {/* SEO */}
          {tab === "seo" && settings && (
            <div>
              <h1 className="text-xl font-bold mb-1">SEO Settings</h1>
              <p className="text-sm text-slate-500 mb-6">Google search & social share settings</p>
              <form onSubmit={saveSettings} className="bg-white rounded-xl border p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Meta Title</label>
                  <input className="w-full px-3 py-2 border rounded-lg text-sm" value={settings.metaTitle} onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })} />
                  <p className="text-[11px] text-slate-400 mt-1">50–60 characters recommended</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Meta Description</label>
                  <textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} value={settings.metaDescription} onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })} />
                  <p className="text-[11px] text-slate-400 mt-1">150–160 characters recommended</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Keywords</label>
                  <input className="w-full px-3 py-2 border rounded-lg text-sm" value={settings.metaKeywords} onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">OG Image URL</label>
                  <input className="w-full px-3 py-2 border rounded-lg text-sm" value={settings.ogImage} onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })} placeholder="/uploads/og-image.jpg" />
                </div>
                <button type="submit" className="bg-teal-800 hover:bg-teal-900 text-white font-medium px-6 py-2.5 rounded-lg text-sm">Save SEO</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

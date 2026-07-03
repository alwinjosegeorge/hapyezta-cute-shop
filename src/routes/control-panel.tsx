import { useState, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusCircle, CheckCircle, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { MarqueeBanner } from "@/components/MarqueeBanner";
import { Footer } from "@/components/Footer";
import { useProducts } from "@/context/ProductContext";

export const Route = createFileRoute("/control-panel")({
  head: () => ({
    meta: [
      { title: "Control Panel - Hapyezta" },
      { name: "description", content: "Hapyezta Admin Control Panel. Add new products." },
    ],
  }),
  component: ControlPanel,
});

function ControlPanel() {
  const { categories, addProduct } = useProducts();

  // Notification state
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Image upload compression helper
  const compressImage = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        callback(compressedBase64);
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  // --- Product Form State ---
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodOldPrice, setProdOldPrice] = useState("");
  const [prodCategory, setProdCategory] = useState(categories[0]?.name || "Cute Stationery");
  const [prodTag, setProdTag] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [prodStockStatus, setProdStockStatus] = useState<"in_stock" | "low_stock" | "sold_out">("in_stock");
  const [prodColors, setProdColors] = useState("");
  const [prodDetails, setProdDetails] = useState("");
  const [prodImageSource, setProdImageSource] = useState<"url" | "upload">("upload");
  const [prodImageUrl, setProdImageUrl] = useState("");
  const [prodImageBase64, setProdImageBase64] = useState("");
  const productFileRef = useRef<HTMLInputElement>(null);

  const handleProductImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      compressImage(e.target.files[0], (base64) => {
        setProdImageBase64(base64);
      });
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodDescription) {
      showNotification("error", "Please fill in Product Name, Price, and Description! 🌸");
      return;
    }

    const finalImage = prodImageSource === "upload" ? prodImageBase64 : prodImageUrl;
    if (!finalImage) {
      showNotification("error", "Please upload an image or provide an image URL! 🌸");
      return;
    }

    const priceNum = parseInt(prodPrice, 10);
    if (isNaN(priceNum)) {
      showNotification("error", "Price must be a valid number! 🌸");
      return;
    }

    // Colors list split by comma
    const colorsArray = prodColors
      ? prodColors.split(",").map((c) => c.trim()).filter((c) => c.length > 0)
      : [];

    // Details split by newlines
    const detailsArray = prodDetails
      ? prodDetails.split("\n").map((d) => d.trim()).filter((d) => d.length > 0)
      : ["Premium quality kawaii item", "Handpicked with love"];

    const priceFormatted = `₹${priceNum}`;
    const oldPriceFormatted = prodOldPrice ? `₹${parseInt(prodOldPrice, 10)}` : undefined;

    addProduct({
      name: prodName,
      price: priceFormatted,
      oldPrice: oldPriceFormatted,
      img: finalImage,
      tag: prodTag || undefined,
      category: prodCategory || categories[0]?.name || "Cute Stationery",
      description: prodDescription,
      stockStatus: prodStockStatus,
      colors: colorsArray,
      details: detailsArray,
    });

    // Reset Form
    setProdName("");
    setProdPrice("");
    setProdOldPrice("");
    setProdTag("");
    setProdDescription("");
    setProdStockStatus("in_stock");
    setProdColors("");
    setProdDetails("");
    setProdImageUrl("");
    setProdImageBase64("");
    if (productFileRef.current) productFileRef.current.value = "";

    showNotification("success", "Kawaii product added successfully! 🎉🌸");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <MarqueeBanner />
        <Header />

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-foreground/60 mb-6 justify-center lg:justify-start">
            <Link to="/" className="hover:text-coral transition font-semibold">Home</Link>
            <span>/</span>
            <span className="text-purple font-bold">Admin Control Panel</span>
          </div>

          {/* Heading */}
          <div className="text-center lg:text-left mb-8">
            <div className="inline-flex items-center gap-2 bg-yellow/30 text-purple px-4 py-1.5 rounded-full text-xs font-bold mb-3">
              👑 Admin Console
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-purple tracking-tight">
              Control Panel
            </h1>
            <p className="text-foreground/70 font-body mt-2 text-sm sm:text-base">
              Add new adorable kawaii products to the online catalog.
            </p>
          </div>

          {/* Notification Alert */}
          {notification && (
            <div
              className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border-2 animate-fade-in max-w-3xl mx-auto ${
                notification.type === "success"
                  ? "bg-teal/10 border-teal/20 text-teal"
                  : "bg-coral/10 border-coral/20 text-coral"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span className="font-semibold text-sm">{notification.message}</span>
            </div>
          )}

          {/* Single Focused Form Card */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border-2 border-yellow/20 shadow-md">
              <h2 className="font-display text-2xl text-purple flex items-center gap-2 mb-6 border-b border-purple/5 pb-4">
                🎁 Add Adorable Product
              </h2>

              <form onSubmit={handleAddProductSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-purple uppercase tracking-wider block">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kawaii Bunny Plushie"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream/35 border-2 border-purple/10 focus:border-coral outline-none text-sm transition font-body"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-purple uppercase tracking-wider block">Category *</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream/35 border-2 border-purple/10 focus:border-coral outline-none text-sm transition font-body cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-5">
                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-purple uppercase tracking-wider block">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 499"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream/35 border-2 border-purple/10 focus:border-coral outline-none text-sm transition font-body"
                    />
                  </div>

                  {/* Old Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-purple uppercase tracking-wider block">Old Price (₹, optional)</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 799"
                      value={prodOldPrice}
                      onChange={(e) => setProdOldPrice(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream/35 border-2 border-purple/10 focus:border-coral outline-none text-sm transition font-body"
                    />
                  </div>

                  {/* Tag */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-purple uppercase tracking-wider block">Product Tag</label>
                    <select
                      value={prodTag}
                      onChange={(e) => setProdTag(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream/35 border-2 border-purple/10 focus:border-coral outline-none text-sm transition font-body cursor-pointer"
                    >
                      <option value="">None</option>
                      <option value="Sale">Sale</option>
                      <option value="New">New</option>
                      <option value="Hot">Hot</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Stock Status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-purple uppercase tracking-wider block">Stock Status *</label>
                    <div className="flex gap-2">
                      {[
                        { value: "in_stock", label: "✓ In Stock", color: "text-teal border-teal/20 bg-teal/5" },
                        { value: "low_stock", label: "⚠️ Low Stock", color: "text-orange border-orange/20 bg-orange/5" },
                        { value: "sold_out", label: "✕ Sold Out", color: "text-red-500 border-red-200 bg-red-50" },
                      ].map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => setProdStockStatus(s.value as any)}
                          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                            prodStockStatus === s.value
                              ? "bg-purple text-white border-transparent"
                              : `${s.color} hover:bg-cream`
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-purple uppercase tracking-wider block">Colors (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Lavender, Sweet Pink, Mint Blue"
                      value={prodColors}
                      onChange={(e) => setProdColors(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream/35 border-2 border-purple/10 focus:border-coral outline-none text-sm transition font-body"
                    />
                  </div>
                </div>

                {/* Image Selector Tab */}
                <div className="space-y-2 border-t border-purple/5 pt-4">
                  <label className="text-xs font-bold text-purple uppercase tracking-wider block">Product Image *</label>
                  <div className="flex gap-4 mb-3">
                    <button
                      type="button"
                      onClick={() => setProdImageSource("upload")}
                      className={`flex-1 py-2 px-4 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                        prodImageSource === "upload"
                          ? "bg-purple text-white border-transparent"
                          : "border-purple/10 hover:bg-cream text-purple"
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setProdImageSource("url")}
                      className={`flex-1 py-2 px-4 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                        prodImageSource === "url"
                          ? "bg-purple text-white border-transparent"
                          : "border-purple/10 hover:bg-cream text-purple"
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Image URL
                    </button>
                  </div>

                  {prodImageSource === "upload" ? (
                    <div className="p-4 rounded-2xl border-2 border-dashed border-purple/10 bg-cream/20 flex flex-col items-center justify-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        ref={productFileRef}
                        onChange={handleProductImageFileChange}
                        className="hidden"
                        id="prod-file-input"
                      />
                      <label
                        htmlFor="prod-file-input"
                        className="px-5 py-2 rounded-xl bg-purple text-white text-xs font-bold hover:bg-coral transition cursor-pointer"
                      >
                        Choose Cute Image
                      </label>
                      {prodImageBase64 ? (
                        <div className="mt-3 flex items-center gap-3">
                          <img src={prodImageBase64} alt="Preview" className="w-14 h-14 object-cover rounded-xl border-2 border-white shadow-md" />
                          <span className="text-xs text-teal font-semibold">✓ Image uploaded & compressed</span>
                        </div>
                      ) : (
                        <span className="text-xs text-foreground/40 font-body">PNG, JPG, JPEG (will be compressed locally)</span>
                      )}
                    </div>
                  ) : (
                    <input
                      type="url"
                      placeholder="https://example.com/cute-product-image.jpg"
                      value={prodImageUrl}
                      onChange={(e) => setProdImageUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream/35 border-2 border-purple/10 focus:border-coral outline-none text-sm transition font-body"
                    />
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5 border-t border-purple/5 pt-4">
                  <label className="text-xs font-bold text-purple uppercase tracking-wider block">Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Write a cute description of the product and its features..."
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-cream/35 border-2 border-purple/10 focus:border-coral outline-none text-sm transition font-body resize-none"
                  />
                </div>

                {/* Details / Specs */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-purple uppercase tracking-wider block">Detailed Bullet Points (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Material: Premium polymer clay&#10;Dimensions: 10cm x 10cm&#10;Includes 2 matching pencils"
                    value={prodDetails}
                    onChange={(e) => setProdDetails(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-cream/35 border-2 border-purple/10 focus:border-coral outline-none text-sm transition font-body resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-coral hover:bg-coral/95 text-white font-bold text-sm shadow-[0_6px_0_0_#c4513f] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#c4513f] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-5 h-5" /> Add Product
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusCircle, CheckCircle, Image as ImageIcon, AlertCircle, Trash2, ChevronDown, ChevronUp, Clock, Package, Check, Mail, Phone, MapPin, DollarSign, ListOrdered, Calendar } from "lucide-react";
import { Header } from "@/components/Header";
import { MarqueeBanner } from "@/components/MarqueeBanner";
import { Footer } from "@/components/Footer";
import { useProducts } from "@/context/ProductContext";

export const Route = createFileRoute("/nexus-control")({
  head: () => ({
    meta: [
      { title: "Control Panel - Hapyezta" },
      { name: "description", content: "Hapyezta Admin Control Panel. Add new products & track orders." },
    ],
  }),
  component: ControlPanel,
});

// Custom Cute Select component that matches the theme of the website
function CuteSelect({
  value,
  onChange,
  options,
  placeholder = "Select Option",
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative">
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-2xl bg-cream/35 border-2 border-purple/10 focus-within:border-coral outline-none text-sm transition font-body flex items-center justify-between cursor-pointer select-none bg-white/50"
      >
        <span className={selectedOption ? "text-foreground font-medium" : "text-foreground/40"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`text-xs transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          🌸
        </span>
      </div>

      {/* Backdrop for closing */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10 cursor-default"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Options List */}
      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white rounded-2xl border-2 border-yellow/20 shadow-lg max-h-60 overflow-y-auto animate-fade-in p-1">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer flex items-center justify-between select-none ${
                value === opt.value
                  ? "bg-purple text-white"
                  : "text-purple hover:bg-cream hover:text-coral"
              }`}
            >
              <span>{opt.label}</span>
              {value === opt.value && <span className="text-xs">✨</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ControlPanel() {
  const { categories, addProduct } = useProducts();
  const [viewMode, setViewMode] = useState<"add-product" | "track-orders">("add-product");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  // Check auth in sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("nexus-authenticated");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "5555") {
      sessionStorage.setItem("nexus-authenticated", "true");
      setIsAuthenticated(true);
      setPasscodeError("");
    } else {
      setPasscodeError("Incorrect access code 🌸 Please try again!");
      setPasscode("");
    }
  };

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

  // --- Order Tracking States ---
  const [orders, setOrders] = useState<any[]>([]);
  const [searchOrderQuery, setSearchOrderQuery] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Load orders from localStorage
  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem("hapyezta-orders");
      if (storedOrders && JSON.parse(storedOrders).length > 0) {
        setOrders(JSON.parse(storedOrders));
      } else {
        // Pre-populate with a cute mock order for display
        const mockOrder = {
          id: "HAP-2026-8921",
          date: new Date().toISOString(),
          deliveryEstimate: "Jul 12 – Jul 15, 2026",
          customerName: "Sakura Chan",
          customerEmail: "sakura@kawaii.com",
          customerPhone: "+91 98765 43210",
          shippingAddress: {
            street: "Flat 4B, Cherry Blossom Apartments, Marine Drive",
            city: "Kochi",
            state: "Kerala",
            pincode: "682031",
          },
          paymentMethod: "online",
          items: [
            {
              id: "p1",
              name: "Adorable Bunny Desk Organizer",
              price: 499,
              priceString: "₹499",
              img: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400",
              color: "Sweet Pink",
              quantity: 1,
            },
            {
              id: "p2",
              name: "Kawaii Milk Box Pencil Case",
              price: 299,
              priceString: "₹299",
              img: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=400",
              color: "Strawberry Milk",
              quantity: 2,
            }
          ],
          shippingCost: 60,
          totalAmount: 1157,
          status: "pending",
        };
        const defaultOrders = [mockOrder];
        setOrders(defaultOrders);
        localStorage.setItem("hapyezta-orders", JSON.stringify(defaultOrders));
      }
    } catch (e) {
      console.error("Failed to load orders:", e);
    }
  }, [viewMode]);

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

  // --- Order Actions ---
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updated);
    try {
      localStorage.setItem("hapyezta-orders", JSON.stringify(updated));
      showNotification("success", `Order ${orderId} status updated to ${newStatus}! 🌸`);
    } catch (e) {
      console.error("Failed to update status in localStorage:", e);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm(`Are you sure you want to delete order ${orderId}? 😿`)) {
      const updated = orders.filter((o) => o.id !== orderId);
      setOrders(updated);
      try {
        localStorage.setItem("hapyezta-orders", JSON.stringify(updated));
        showNotification("success", `Order ${orderId} deleted successfully! 🗑️`);
      } catch (e) {
        console.error("Failed to delete order from localStorage:", e);
      }
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return isoString;
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchOrderQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <div>
          <MarqueeBanner />
          <Header />

          <main className="max-w-md mx-auto px-4 py-20">
            <div className="bg-white rounded-[2rem] p-8 border-2 border-yellow/20 shadow-[0_12px_40px_rgba(127,88,165,0.06)] text-center">
              <div className="text-4xl mb-4 select-none animate-bounce">🔒</div>
              <h1 className="font-display text-3xl text-purple font-bold mb-2">Nexus Control</h1>
              <p className="text-sm text-foreground/60 mb-6 font-body">
                Please enter the security access code to open the admin console.
              </p>

              <form onSubmit={handlePasscodeSubmit} className="space-y-5">
                <div>
                  <input
                    type="password"
                    placeholder="Enter security code..."
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full text-center tracking-[0.2em] font-mono text-lg px-6 py-4 rounded-full border-2 border-yellow/20 focus:border-orange bg-cream/10 outline-none transition text-foreground placeholder:text-foreground/30 placeholder:tracking-normal placeholder:font-sans"
                    maxLength={10}
                    autoFocus
                  />
                </div>

                {passcodeError && (
                  <div className="flex items-center justify-center gap-2 text-xs text-coral font-semibold bg-coral/10 py-2.5 px-4 rounded-full animate-fade-in">
                    <span>🌸</span>
                    <span>{passcodeError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-orange hover:bg-orange/95 text-white font-bold shadow-[0_5px_0_0_#c4513f] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#c4513f] transition-all cursor-pointer text-sm font-display uppercase tracking-widest"
                >
                  Verify Access
                </button>
              </form>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

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
          <div className="text-center lg:text-left mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow/30 text-purple px-4 py-1.5 rounded-full text-xs font-bold mb-3">
                👑 Admin Console
              </div>
              <h1 className="font-display text-4xl sm:text-5xl text-purple tracking-tight">
                Control Panel
              </h1>
              <p className="text-foreground/70 font-body mt-2 text-sm sm:text-base">
                {viewMode === "add-product" 
                  ? "Add new adorable kawaii products to the online catalog."
                  : "Track, inspect, and update orders placed by customers."
                }
              </p>
            </div>

            {/* Navigation Pills */}
            <div className="flex gap-3 justify-center lg:justify-end shrink-0">
              <button
                onClick={() => setViewMode("add-product")}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  viewMode === "add-product"
                    ? "bg-purple text-white shadow-md shadow-purple/15"
                    : "bg-white text-purple border-2 border-purple/10 hover:border-purple/30"
                }`}
              >
                <PlusCircle className="w-4 h-4" /> Add Product
              </button>
              <button
                onClick={() => setViewMode("track-orders")}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  viewMode === "track-orders"
                    ? "bg-purple text-white shadow-md shadow-purple/15"
                    : "text-purple bg-white border-2 border-purple/10 hover:border-purple/30"
                }`}
              >
                <Package className="w-4 h-4" /> Track Orders
                {orders.filter(o => o.status === "pending").length > 0 && (
                  <span className="bg-coral text-white text-[10px] w-5 h-5 rounded-full grid place-items-center animate-pulse">
                    {orders.filter(o => o.status === "pending").length}
                  </span>
                )}
              </button>
            </div>
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

          {/* Add Product Card View */}
          {viewMode === "add-product" && (
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
                      <CuteSelect
                        value={prodCategory}
                        onChange={(val) => setProdCategory(val)}
                        options={categories.map((c) => ({ value: c.name, label: c.name }))}
                      />
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
                      <CuteSelect
                        value={prodTag}
                        onChange={(val) => setProdTag(val)}
                        options={[
                          { value: "", label: "None" },
                          { value: "Sale", label: "Sale" },
                          { value: "New", label: "New" },
                          { value: "Hot", label: "Hot" },
                        ]}
                      />
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
          )}

          {/* Track Orders Card View */}
          {viewMode === "track-orders" && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Toolbar */}
              <div className="bg-white rounded-3xl p-5 border-2 border-yellow/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="font-display text-2xl text-purple flex items-center gap-2 shrink-0">
                  📦 Customer Orders ({filteredOrders.length})
                </h2>
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search by ID or name..."
                    value={searchOrderQuery}
                    onChange={(e) => setSearchOrderQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-full bg-cream/40 border-2 border-purple/10 focus:border-coral outline-none text-xs font-body transition-colors"
                  />
                  <Clock className="absolute left-3.5 top-3.5 w-3.5 h-3.5 text-purple/40" />
                </div>
              </div>

              {/* Order List */}
              <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const itemsCount = order.items.reduce((acc: number, item: any) => acc + item.quantity, 0);

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-[2rem] border-2 border-yellow/20 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                      >
                        {/* Summary Header */}
                        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple/5 bg-cream/5">
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="font-display text-lg text-purple font-bold">{order.id}</span>
                              <span className="text-xs text-foreground/50 flex items-center gap-1 font-body">
                                <Calendar className="w-3.5 h-3.5 text-purple/40" /> {formatDate(order.date)}
                              </span>
                            </div>
                            <div className="text-sm font-body text-foreground/70">
                              Customer: <span className="font-bold text-purple">{order.customerName}</span> • Items: <span className="font-bold">{itemsCount}</span> • Total: <span className="font-bold text-coral">₹{order.totalAmount}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            {/* Status Badge */}
                            <div>
                              {order.status === "pending" && (
                                <span className="bg-orange/10 text-orange px-3 py-1 rounded-full text-xs font-bold border border-orange/20">
                                  ⏳ Pending
                                </span>
                              )}
                              {order.status === "shipped" && (
                                <span className="bg-purple/10 text-purple px-3 py-1 rounded-full text-xs font-bold border border-purple/20">
                                  🚚 Shipped
                                </span>
                              )}
                              {order.status === "delivered" && (
                                <span className="bg-teal/10 text-teal px-3 py-1 rounded-full text-xs font-bold border border-teal/20">
                                  ✓ Delivered
                                </span>
                              )}
                            </div>

                            {/* Delete Action */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteOrder(order.id);
                                }}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition cursor-pointer"
                                title="Delete Order"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Always visible details */}
                        <div className="p-6 space-y-6 font-body text-sm">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Customer and Shipping Details */}
                            <div className="bg-white p-5 rounded-2xl border border-purple/5 shadow-sm space-y-4">
                              <h3 className="font-display text-base text-purple flex items-center gap-2 border-b border-purple/5 pb-2">
                                <MapPin className="w-4 h-4 text-coral" /> Customer & Shipping Info
                              </h3>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-foreground/50 font-semibold w-16">Email:</span>
                                  <span className="text-purple flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {order.customerEmail}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-foreground/50 font-semibold w-16">Phone:</span>
                                  <span className="text-purple flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {order.customerPhone}</span>
                                </div>
                                <div className="flex items-start gap-2 pt-2 border-t border-purple/5">
                                  <span className="text-foreground/50 font-semibold w-16 shrink-0 mt-0.5">Address:</span>
                                  <div className="text-foreground/80 leading-relaxed">
                                    <p>{order.shippingAddress.street}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Order & Status Action Card */}
                            <div className="bg-white p-5 rounded-2xl border border-purple/5 shadow-sm space-y-4">
                              <h3 className="font-display text-base text-purple flex items-center gap-2 border-b border-purple/5 pb-2">
                                ⚡ Update Order Status
                              </h3>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-foreground/60 font-semibold">Current Status:</span>
                                  <span className="capitalize font-bold text-purple">{order.status}</span>
                                </div>
                                <div className="flex gap-2 pt-2">
                                  {[
                                    { statusName: "pending", label: "Pending", style: "border-orange/20 text-orange hover:bg-orange/5 bg-orange/5" },
                                    { statusName: "shipped", label: "Shipped", style: "border-purple/20 text-purple hover:bg-purple/5 bg-purple/5" },
                                    { statusName: "delivered", label: "Delivered", style: "border-teal/20 text-teal hover:bg-teal/5 bg-teal/5" },
                                  ].map((btn) => (
                                    <button
                                      key={btn.statusName}
                                      onClick={() => handleUpdateOrderStatus(order.id, btn.statusName)}
                                      className={`flex-1 py-2 px-1 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${
                                        order.status === btn.statusName
                                          ? "bg-purple text-white border-transparent"
                                          : btn.style
                                      }`}
                                    >
                                      {btn.label}
                                    </button>
                                  ))}
                                </div>
                                <div className="flex justify-between border-t border-purple/5 pt-3 text-xs text-foreground/50">
                                  <span>Method: {order.paymentMethod === "online" ? "UPI/Online" : "Cash on Delivery"}</span>
                                  <span>Shipping: ₹{order.shippingCost}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Ordered Items List */}
                          <div className="bg-white p-5 rounded-2xl border border-purple/5 shadow-sm space-y-4">
                            <h3 className="font-display text-base text-purple flex items-center gap-2 border-b border-purple/5 pb-2">
                              <ListOrdered className="w-4 h-4 text-teal" /> Placed Items
                            </h3>
                            <div className="space-y-3 divide-y divide-purple/5">
                              {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between gap-4 pt-3 first:pt-0">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={item.img}
                                      alt={item.name}
                                      className="w-12 h-12 object-cover rounded-xl border border-purple/10 bg-cream/10 shrink-0"
                                    />
                                    <div>
                                      <h4 className="font-semibold text-purple line-clamp-1">{item.name}</h4>
                                      {item.color && (
                                        <span className="text-[10px] bg-purple/10 text-purple px-2 py-0.5 rounded-full font-bold">
                                          Color: {item.color}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-xs text-foreground/60">{item.priceString} x {item.quantity}</span>
                                    <p className="font-bold text-coral mt-0.5">₹{item.price * item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-purple/15">
                    <p className="text-base text-foreground/50">No customer orders found yet! 🌸</p>
                    <p className="text-xs text-foreground/40 mt-1">Orders placed on checkout will be listed here.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

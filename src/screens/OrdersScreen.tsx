// src/screens/OrdersScreen.tsx
import { useState } from "react";
import {
  Search,
  Car,
  Camera,
  CheckCircle2,
  FileText,
  Package,
  Clock,
  TrendingUp,
  Tag,
  XCircle,
  TrendingDown,
} from "lucide-react";
import { useStore, formatCurrency, type Order, type OrderStatus, type PriceRequestStatus } from "@/lib/store";
import { InvoiceSheet } from "./InvoiceSheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// --------------------------------------------------------------
// Light theme design tokens (emerald borders, 3D)
// --------------------------------------------------------------
const CARD = {
  background: "rgba(255, 255, 255, 0.92)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "2px solid #10b981",
  borderRadius: 28,
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255,255,255,0.9)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
} as const;

const CARD_3D_HOVER = {
  transform: "translateY(-4px) scale(1.01)",
  boxShadow: "0 20px 35px -10px rgba(16, 185, 129, 0.25), 0 0 0 2px #10b981",
};

const LABEL_SM = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#10b981",
};

const TEXT_SECONDARY = {
  color: "rgba(30, 41, 59, 0.65)",
  fontSize: 12,
  fontWeight: 500,
} as const;

// --------------------------------------------------------------
// Filters & status config
// --------------------------------------------------------------
const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Barchasi" },
  { key: "kutilmoqda", label: "Kutilmoqda" },
  { key: "tasdiqlangan", label: "Tasdiqlangan" },
  { key: "qarz_kutilmoqda", label: "Qarz" },
  { key: "yuklangan", label: "Yuklangan" },
  { key: "yetkazildi", label: "Yetkazildi" },
  { key: "rad_etildi", label: "Rad etildi" },
];

const STATUS_CONFIG: Record<
  string,
  { label: string; accentColor: string; bgColor: string; textColor: string; dotColor: string }
> = {
  kutilmoqda: {
    label: "Kutilmoqda",
    accentColor: "#f97316",
    bgColor: "rgba(249,115,22,0.1)",
    textColor: "#f97316",
    dotColor: "#f97316",
  },
  tasdiqlangan: {
    label: "Tasdiqlangan",
    accentColor: "#3b82f6",
    bgColor: "rgba(59,130,246,0.1)",
    textColor: "#3b82f6",
    dotColor: "#3b82f6",
  },
  yuklangan: {
    label: "Yuklangan",
    accentColor: "#8b5cf6",
    bgColor: "rgba(139,92,246,0.1)",
    textColor: "#8b5cf6",
    dotColor: "#8b5cf6",
  },
  yetkazildi: {
    label: "Yetkazildi",
    accentColor: "#10b981",
    bgColor: "rgba(16,185,129,0.1)",
    textColor: "#10b981",
    dotColor: "#10b981",
  },
  rad_etildi: {
    label: "Rad etildi",
    accentColor: "#ef4444",
    bgColor: "rgba(239,68,68,0.1)",
    textColor: "#ef4444",
    dotColor: "#ef4444",
  },
  qarz_kutilmoqda: {
    label: "Qarz kutilmoqda",
    accentColor: "#f59e0b",
    bgColor: "rgba(245,158,11,0.1)",
    textColor: "#f59e0b",
    dotColor: "#f59e0b",
  },
};

const DELIVERY_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "kutilmoqda", label: "Kutilmoqda" },
  { key: "tasdiqlangan", label: "Tasdiqlandi" },
  { key: "yuklangan", label: "Yuklandi" },
  { key: "yetkazildi", label: "Yetkazildi" },
];

// Price request status config (for modal)
const PRICE_STATUS_CONFIG: Record<
  PriceRequestStatus,
  { label: string; icon: React.ElementType; color: string; bg: string; border: string }
> = {
  kutilmoqda: {
    label: "Kutilmoqda",
    icon: Clock,
    color: "#f97316",
    bg: "rgba(249,115,22,0.15)",
    border: "rgba(249,115,22,0.4)",
  },
  tasdiqlandi: {
    label: "Tasdiqlandi",
    icon: CheckCircle2,
    color: "#10b981",
    bg: "rgba(16,185,129,0.15)",
    border: "rgba(16,185,129,0.4)",
  },
  rad_etildi: {
    label: "Rad etildi",
    icon: XCircle,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.15)",
    border: "rgba(239,68,68,0.4)",
  },
};

// --------------------------------------------------------------
// Main component
// --------------------------------------------------------------
export function OrdersScreen() {
  const { orders, priceRequests, updateOrderStatus } = useStore();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [carNumber, setCarNumber] = useState("");
  const [priceRequestsModalOpen, setPriceRequestsModalOpen] = useState(false);

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "all" || o.status === filter;
    const matchSearch =
      search === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.partnerName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  function handleStatusUpdate(orderId: string, status: OrderStatus, car?: string) {
    updateOrderStatus(orderId, status, car);
    setSelectedOrder((prev) =>
      prev ? { ...prev, status, ...(car ? { carNumber: car } : {}) } : prev
    );
  }

  const totalOrders = orders.length;
  const delivered = orders.filter((o) => o.status === "yetkazildi").length;
  const pending = orders.filter((o) => o.status === "kutilmoqda").length;

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #f0fdf4 0%, #ecfdf5 100%)",
        minHeight: "100vh",
        padding: "16px 12px 112px",
        maxWidth: 480,
        margin: "0 auto",
        color: "#0f172a",
      }}
    >
      {/* Header with Price Requests Button */}
      <div style={{ marginBottom: 24, padding: "0 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ ...LABEL_SM, marginBottom: 6, fontSize: 12 }}>Buyurtmalarim</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
            Buyurtmalar
          </h1>
        </div>
        <button
          onClick={() => setPriceRequestsModalOpen(true)}
          style={{
            background: "#ffffff",
            border: "2px solid #10b981",
            borderRadius: 40,
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            fontWeight: 600,
            color: "#10b981",
          }}
        >
          <Tag size={16} />
          Narx so'rovlari
          {priceRequests.filter((r) => r.status === "kutilmoqda").length > 0 && (
            <span
              style={{
                background: "#ef4444",
                color: "#fff",
                borderRadius: 20,
                padding: "2px 8px",
                fontSize: 11,
                marginLeft: 4,
              }}
            >
              {priceRequests.filter((r) => r.status === "kutilmoqda").length}
            </span>
          )}
        </button>
      </div>

      {/* Stats row – 3 cards with emerald border and background icons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24, padding: "0 8px" }}>
        {[
          { label: "Jami", value: totalOrders, icon: Package, color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
          { label: "Kutilmoqda", value: pending, icon: Clock, color: "#f97316", bg: "rgba(249,115,22,0.08)" },
          { label: "Yetkazildi", value: delivered, icon: TrendingUp, color: "#10b981", bg: "rgba(16,185,129,0.08)" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              ...CARD,
              padding: "16px 12px",
              position: "relative",
              overflow: "hidden",
              textAlign: "center",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, CARD_3D_HOVER);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = CARD.boxShadow;
            }}
          >
            {/* Background icon */}
            <div
              style={{
                position: "absolute",
                bottom: -10,
                right: -10,
                opacity: 0.12,
                transform: "rotate(-5deg)",
              }}
            >
              <s.icon size={80} color={s.color} strokeWidth={1.2} />
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                background: s.bg,
                border: `1px solid ${s.color}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <s.icon size={20} color={s.color} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", lineHeight: 1.1, position: "relative", zIndex: 2 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 8, fontWeight: 500, position: "relative", zIndex: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20, padding: "0 8px" }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#10b981" }} />
          <input
            placeholder="Buyurtma ID yoki mijoz..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              height: 48,
              paddingLeft: 42,
              paddingRight: 16,
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(8px)",
              border: "2px solid #10b981",
              borderRadius: 32,
              fontSize: 14,
              color: "#0f172a",
              outline: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          />
        </div>
      </div>

      {/* Filter pills */}
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          padding: "0 8px 12px",
          marginBottom: 8,
          scrollbarWidth: "none",
        }}
        className="no-scrollbar"
      >
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                flexShrink: 0,
                padding: "6px 18px",
                borderRadius: 40,
                fontSize: 13,
                fontWeight: 600,
                background: isActive ? "#10b981" : "rgba(255, 255, 255, 0.6)",
                border: isActive ? "2px solid #10b981" : "2px solid rgba(16, 185, 129, 0.3)",
                color: isActive ? "#ffffff" : "#0f172a",
                backdropFilter: "blur(4px)",
                transition: "all 0.2s",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 8px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 16px", color: "#10b981" }}>
            <Package size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
            <div style={{ fontWeight: 600, fontSize: 16, color: "#0f172a" }}>Buyurtma topilmadi</div>
            <div style={{ fontSize: 13, marginTop: 6, color: "#475569" }}>Filtrni o‘zgartiring yoki yangi buyurtma yarating</div>
          </div>
        ) : (
          filtered.map((order) => {
            const cfg = STATUS_CONFIG[order.status] ?? {
              label: order.status,
              accentColor: "#64748b",
              bgColor: "rgba(100,116,139,0.1)",
              textColor: "#64748b",
              dotColor: "#64748b",
            };
            return (
              <button
                key={order.id}
                onClick={() => {
                  setSelectedOrder(order);
                  setCarNumber("");
                }}
                style={{
                  textAlign: "left",
                  width: "100%",
                  transition: "transform 0.1s",
                }}
                className="active:scale-[0.98]"
              >
                <div
                  style={{
                    ...CARD,
                    position: "relative",
                    overflow: "hidden",
                    padding: "16px",
                  }}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, CARD_3D_HOVER);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = CARD.boxShadow;
                  }}
                >
                  {/* Accent bar */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      width: 5,
                      background: cfg.accentColor,
                      boxShadow: `0 0 10px ${cfg.accentColor}`,
                    }}
                  />
                  <div style={{ marginLeft: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 11, fontFamily: "monospace", background: "#e2e8f0", padding: "2px 8px", borderRadius: 20, color: "#0f172a", fontWeight: 600 }}>
                            {order.id}
                          </span>
                          <span style={{ fontSize: 11, color: "#475569" }}>{order.createdAt}</span>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{order.partnerName}</div>
                        <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{order.items.length} ta mahsulot</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: cfg.accentColor }}>
                          {formatCurrency(order.totalAmount)}
                        </div>
                        <div
                          style={{
                            marginTop: 6,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            background: cfg.bgColor,
                            padding: "2px 10px",
                            borderRadius: 30,
                            fontSize: 10,
                            fontWeight: 700,
                            color: cfg.textColor,
                            border: `1px solid ${cfg.accentColor}40`,
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dotColor }} />
                          {cfg.label}
                        </div>
                      </div>
                    </div>
                    {order.debtAmount > 0 && (
                      <div
                        style={{
                          marginTop: 12,
                          background: "rgba(239,68,68,0.08)",
                          border: "1px solid rgba(239,68,68,0.3)",
                          borderRadius: 16,
                          padding: "8px 12px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 500 }}>Qarz qoldig‘i</span>
                        <span style={{ fontWeight: 700, color: "#ef4444" }}>{formatCurrency(order.debtAmount)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {selectedOrder && (
        <OrderDetailSheet
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onViewInvoice={() => {
            setInvoiceOrder(selectedOrder);
            setSelectedOrder(null);
          }}
          onStatusUpdate={handleStatusUpdate}
          carNumber={carNumber}
          onCarNumberChange={setCarNumber}
        />
      )}

      {invoiceOrder && <InvoiceSheet order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}

      {/* Price Requests Modal */}
      <Dialog open={priceRequestsModalOpen} onOpenChange={setPriceRequestsModalOpen}>
        <DialogContent
          style={{
            background: "#ffffff",
            border: "2px solid #10b981",
            borderRadius: 32,
            maxWidth: 480,
            maxHeight: "80vh",
            overflowY: "auto",
            padding: 0,
          }}
          className="[&>button]:hidden"
        >
          <DialogHeader
            style={{
              padding: "20px",
              borderBottom: "1px solid rgba(16,185,129,0.2)",
              position: "relative",
            }}
          >
            <DialogTitle
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#0f172a",
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              <Tag size={20} color="#10b981" />
              Narx so'rovlari
            </DialogTitle>
            <button
              onClick={() => setPriceRequestsModalOpen(false)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "#f1f5f9",
                border: "2px solid #10b981",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <XCircle size={16} color="#0f172a" />
            </button>
          </DialogHeader>

          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Summary Cards inside modal */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { label: "Kutilmoqda", value: priceRequests.filter(r => r.status === "kutilmoqda").length, icon: Clock, color: "#f97316", bg: "rgba(249,115,22,0.1)" },
                { label: "Tasdiqlandi", value: priceRequests.filter(r => r.status === "tasdiqlandi").length, icon: CheckCircle2, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
                { label: "Rad etildi", value: priceRequests.filter(r => r.status === "rad_etildi").length, icon: XCircle, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    ...CARD,
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: stat.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 8px",
                    }}
                  >
                    <stat.icon size={18} color={stat.color} />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{stat.value}</div>
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Price Requests List */}
            {priceRequests.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px" }}>
                <Tag size={40} style={{ marginBottom: 12, opacity: 0.5, color: "#10b981" }} />
                <div style={{ fontWeight: 600, color: "#0f172a" }}>So'rovlar yo'q</div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                  Buyurtma yaratishda narx so'rovlari qo'shiladi
                </div>
              </div>
            ) : (
              priceRequests.map((req) => {
                const cfg = PRICE_STATUS_CONFIG[req.status];
                const Icon = cfg.icon;
                const discount = req.originalPrice - req.requestedPrice;
                const discountPct = Math.round((discount / req.originalPrice) * 100);
                return (
                  <div key={req.id} style={{ ...CARD, padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <Tag size={12} color="#10b981" />
                          <span style={{ fontSize: 11, fontFamily: "monospace", color: "#475569" }}>{req.id}</span>
                          <span style={{ color: "#cbd5e1" }}>·</span>
                          <span style={{ fontSize: 11, color: "#475569" }}>{req.createdAt}</span>
                        </div>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{req.productName}</div>
                      </div>
                      <Badge
                        style={{
                          background: cfg.bg,
                          color: cfg.color,
                          border: `1px solid ${cfg.border}`,
                          borderRadius: 30,
                          padding: "4px 10px",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        <Icon size={10} style={{ marginRight: 4 }} />
                        {cfg.label}
                      </Badge>
                    </div>

                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: 20,
                        padding: "12px",
                        marginBottom: 12,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: "#64748b", marginBottom: 2 }}>Asl narx</div>
                          <div style={{ fontSize: 13, textDecoration: "line-through", color: "#475569" }}>
                            {formatCurrency(req.originalPrice)}
                          </div>
                        </div>
                        <TrendingDown size={14} color="#ef4444" />
                        <div style={{ flex: 1, textAlign: "right" }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: "#64748b", marginBottom: 2 }}>So'ralgan narx</div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#10b981" }}>
                            {formatCurrency(req.requestedPrice)}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: 10,
                          display: "flex",
                          justifyContent: "space-between",
                          paddingTop: 8,
                          borderTop: "1px solid #e2e8f0",
                        }}
                      >
                        <span style={{ fontSize: 11, color: "#475569" }}>Chegirma</span>
                        <Badge
                          style={{
                            background: "#fee2e2",
                            color: "#ef4444",
                            border: "1px solid #fecaca",
                            borderRadius: 30,
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "2px 8px",
                          }}
                        >
                          -{formatCurrency(discount)} ({discountPct}%)
                        </Badge>
                      </div>
                    </div>

                    {req.reason && (
                      <div style={{ background: "#f1f5f9", borderRadius: 16, padding: "8px 12px", display: "flex", gap: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#10b981" }}>Sabab:</span>
                        <span style={{ fontSize: 12, color: "#0f172a" }}>{req.reason}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --------------------------------------------------------------
// OrderDetailSheet (fully restyled with light theme) – unchanged
// --------------------------------------------------------------
function OrderDetailSheet({
  order,
  onClose,
  onViewInvoice,
  onStatusUpdate,
  carNumber,
  onCarNumberChange,
}: {
  order: Order;
  onClose: () => void;
  onViewInvoice: () => void;
  onStatusUpdate: (id: string, status: OrderStatus, car?: string) => void;
  carNumber: string;
  onCarNumberChange: (v: string) => void;
}) {
  // ... (same as previous OrderDetailSheet code) ...
  // (Keep the exact same implementation as before, no changes needed)
  const currentStepIdx = DELIVERY_STEPS.findIndex((s) => s.key === order.status);
  const nonDeliveryStatus = order.status === "rad_etildi" || order.status === "qarz_kutilmoqda";
  const cfg = STATUS_CONFIG[order.status] ?? {
    accentColor: "#64748b",
    bgColor: "rgba(100,116,139,0.1)",
    textColor: "#64748b",
  };

  return (
    <Drawer open onClose={onClose}>
      <DrawerContent
        style={{
          background: "#ffffff",
          borderTop: "2px solid #10b981",
          borderRadius: "32px 32px 0 0",
          maxHeight: "90vh",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <DrawerHeader style={{ padding: "20px 20px 12px", borderBottom: "1px solid rgba(16,185,129,0.2)" }}>
          <DrawerTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 5, height: 28, borderRadius: 4, background: cfg.accentColor }} />
              <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{order.id}</span>
            </div>
            <span style={{ fontSize: 12, color: "#475569" }}>{order.createdAt}</span>
          </DrawerTitle>
          <p style={{ fontSize: 14, color: "#475569", marginTop: 6 }}>{order.partnerName}</p>
        </DrawerHeader>

        <div style={{ padding: "16px 20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Stepper */}
          {!nonDeliveryStatus && (
            <div style={{ ...CARD, background: "rgba(255,255,255,0.9)", padding: "16px" }}>
              <div style={{ ...LABEL_SM, marginBottom: 12 }}>Yetkazish holati</div>
              <div style={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
                <div style={{ position: "absolute", top: 16, left: 16, right: 16, height: 2, background: "#e2e8f0", borderRadius: 2 }} />
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    height: 2,
                    width: currentStepIdx <= 0 ? "0%" : `${(currentStepIdx / (DELIVERY_STEPS.length - 1)) * 100}%`,
                    background: cfg.accentColor,
                    borderRadius: 2,
                    transition: "width 0.3s",
                  }}
                />
                {DELIVERY_STEPS.map((step, i) => {
                  const done = i <= currentStepIdx;
                  const active = i === currentStepIdx;
                  return (
                    <div key={step.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: done ? cfg.accentColor : "#f1f5f9",
                          border: active ? `2px solid ${cfg.accentColor}` : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: done ? "#ffffff" : "#475569",
                        }}
                      >
                        {done ? <CheckCircle2 size={16} /> : <span style={{ fontSize: 12 }}>{i + 1}</span>}
                      </div>
                      <div style={{ fontSize: 10, marginTop: 8, color: done ? cfg.accentColor : "#64748b", fontWeight: done ? 700 : 500 }}>
                        {step.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items */}
          <div style={{ ...CARD, background: "rgba(255,255,255,0.9)", padding: "16px" }}>
            <div style={{ ...LABEL_SM, marginBottom: 12 }}>Mahsulotlar</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {order.items.map((item, idx) => {
                const price = item.requestedPrice ?? item.product.price;
                return (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                    <div>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{item.product.name}</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>
                        {item.quantity} × {formatCurrency(price)}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: cfg.accentColor }}>{formatCurrency(price * item.quantity)}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ height: 1, background: "rgba(0,0,0,0.08)", margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "#0f172a" }}>Jami</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: cfg.accentColor }}>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Payment details */}
          <div style={{ ...CARD, background: "rgba(255,255,255,0.9)", padding: "16px" }}>
            <div style={{ ...LABEL_SM, marginBottom: 12 }}>To'lov ma'lumotlari</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={TEXT_SECONDARY}>Usul</span>
                <span style={{ color: "#0f172a" }}>
                  {order.paymentMethod === "naqd"
                    ? "Naqd"
                    : order.paymentMethod === "plastik"
                    ? "Plastik"
                    : order.paymentMethod === "bank"
                    ? "Bank"
                    : "Qarz"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={TEXT_SECONDARY}>To'langan</span>
                <span style={{ color: "#10b981", fontWeight: 600 }}>{formatCurrency(order.paidAmount)}</span>
              </div>
              {order.debtAmount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={TEXT_SECONDARY}>Qarz</span>
                  <span style={{ color: "#ef4444", fontWeight: 600 }}>{formatCurrency(order.debtAmount)}</span>
                </div>
              )}
              {order.dueDate && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={TEXT_SECONDARY}>Muddat</span>
                  <span style={{ color: "#0f172a" }}>{order.dueDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons based on status */}
          {order.status === "tasdiqlangan" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#10b981", marginBottom: 6, display: "block" }}>
                  <Car size={14} style={{ display: "inline", marginRight: 4 }} /> Mashina raqami
                </label>
                <input
                  placeholder="01 A 123 BC"
                  value={carNumber}
                  onChange={(e) => onCarNumberChange(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    background: "#f8fafc",
                    border: "2px solid #10b981",
                    borderRadius: 32,
                    color: "#0f172a",
                    outline: "none",
                  }}
                />
              </div>
              <button
                onClick={() => alert("Kamera ochilmoqda...")}
                style={{
                  background: "#f1f5f9",
                  border: "2px solid #10b981",
                  borderRadius: 40,
                  padding: "12px",
                  fontWeight: 600,
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Camera size={16} /> Rasm yuklash
              </button>
              <button
                onClick={() => onStatusUpdate(order.id, "yuklangan", carNumber)}
                style={{
                  background: cfg.accentColor,
                  border: "none",
                  borderRadius: 40,
                  padding: "14px",
                  fontWeight: 700,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <CheckCircle2 size={16} /> Yuklandi deb belgilash
              </button>
            </div>
          )}

          {order.status === "yuklangan" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={() => alert("Kamera ochilmoqda...")}
                style={{
                  background: "#f1f5f9",
                  border: "2px solid #10b981",
                  borderRadius: 40,
                  padding: "12px",
                  fontWeight: 600,
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Camera size={16} /> Yetkazib berish rasmini yuklash
              </button>
              <button
                onClick={() => onStatusUpdate(order.id, "yetkazildi")}
                style={{
                  background: cfg.accentColor,
                  border: "none",
                  borderRadius: 40,
                  padding: "14px",
                  fontWeight: 700,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <CheckCircle2 size={16} /> Yetkazildi deb tasdiqlash
              </button>
            </div>
          )}

          {order.status === "kutilmoqda" && (
            <button
              onClick={() => onStatusUpdate(order.id, "tasdiqlangan")}
              style={{
                background: cfg.accentColor,
                border: "none",
                borderRadius: 40,
                padding: "14px",
                fontWeight: 700,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <CheckCircle2 size={16} /> Tasdiqlash
            </button>
          )}

          <button
            onClick={onViewInvoice}
            style={{
              background: "#f1f5f9",
              border: "2px solid #10b981",
              borderRadius: 40,
              padding: "12px",
              fontWeight: 600,
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <FileText size={16} /> Invoysni ko'rish
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
// src/screens/OrdersScreen.tsx
import { useState } from "react";
import { Search, Car, Camera, CheckCircle2, FileText, Package, Clock, TrendingUp } from "lucide-react";
import { useStore, formatCurrency, type Order, type OrderStatus } from "@/lib/store";
import { InvoiceSheet } from "./InvoiceSheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

// --------------------------------------------------------------
// Dizayn tokenlari (dashboard bilan bir xil)
// --------------------------------------------------------------
const CARD = {
  background: "rgba(9, 25, 13, 0.7)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(34, 197, 94, 0.2)",
  borderRadius: 24,
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
} as const;

const LABEL_SM = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#86efac",
};

const TEXT_SECONDARY = {
  color: "rgba(255, 255, 255, 0.5)",
  fontSize: 12,
  fontWeight: 500,
};

// const TEXT_PRIMARY = {
//   color: "rgba(255, 255, 255, 0.9)",
//   fontWeight: 700,
// };

// --------------------------------------------------------------
// Filtrlar va status konfiguratsiyasi (ranglar yangilandi)
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
    accentColor: "#fb923c",
    bgColor: "rgba(251,146,60,0.15)",
    textColor: "#fb923c",
    dotColor: "#fb923c",
  },
  tasdiqlangan: {
    label: "Tasdiqlangan",
    accentColor: "#60a5fa",
    bgColor: "rgba(96,165,250,0.15)",
    textColor: "#60a5fa",
    dotColor: "#60a5fa",
  },
  yuklangan: {
    label: "Yuklangan",
    accentColor: "#a78bfa",
    bgColor: "rgba(167,139,250,0.15)",
    textColor: "#a78bfa",
    dotColor: "#a78bfa",
  },
  yetkazildi: {
    label: "Yetkazildi",
    accentColor: "#4ade80",
    bgColor: "rgba(74,222,128,0.15)",
    textColor: "#4ade80",
    dotColor: "#4ade80",
  },
  rad_etildi: {
    label: "Rad etildi",
    accentColor: "#f87171",
    bgColor: "rgba(248,113,113,0.15)",
    textColor: "#f87171",
    dotColor: "#f87171",
  },
  qarz_kutilmoqda: {
    label: "Qarz kutilmoqda",
    accentColor: "#f97316",
    bgColor: "rgba(249,115,22,0.15)",
    textColor: "#f97316",
    dotColor: "#f97316",
  },
};

const DELIVERY_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "kutilmoqda", label: "Kutilmoqda" },
  { key: "tasdiqlangan", label: "Tasdiqlandi" },
  { key: "yuklangan", label: "Yuklandi" },
  { key: "yetkazildi", label: "Yetkazildi" },
];

// --------------------------------------------------------------
// Asosiy komponent
// --------------------------------------------------------------
export function OrdersScreen() {
  const { orders, updateOrderStatus } = useStore();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [carNumber, setCarNumber] = useState("");

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
        minHeight: "100vh",
        background: "transparent",
        padding: "16px 12px 112px",
        maxWidth: 480,
        margin: "0 auto",
        color: "#ffffff",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24, padding: "0 8px" }}>
        <div style={{ ...LABEL_SM, marginBottom: 6, fontSize: 12, color: "#86efac" }}>
          Buyurtmalarim
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.5px" }}>
          Buyurtmalar
        </h1>
      </div>

      {/* Stats row (glass cards) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24, padding: "0 8px" }}>
        {[
          { label: "Jami", value: totalOrders, icon: Package, color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
          { label: "Kutilmoqda", value: pending, icon: Clock, color: "#fb923c", bg: "rgba(251,146,60,0.1)" },
          { label: "Yetkazildi", value: delivered, icon: TrendingUp, color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
        ].map((s) => (
          <div
            key={s.label}
            style={{ ...CARD, padding: "14px 12px", textAlign: "center" }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px",
              }}
            >
              <s.icon size={18} color={s.color} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#ffffff", lineHeight: 1.1 }}>
              {s.value}
            </div>
            <div style={{ ...TEXT_SECONDARY, fontSize: 11, marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20, padding: "0 8px" }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#86efac80" }} />
          <input
            placeholder="Buyurtma ID yoki mijoz..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              height: 48,
              paddingLeft: 42,
              paddingRight: 16,
              background: "rgba(9, 25, 13, 0.7)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 28,
              fontSize: 14,
              color: "#ffffff",
              outline: "none",
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
                background: isActive ? "rgba(34,197,94,0.2)" : "rgba(9, 25, 13, 0.7)",
                border: isActive ? "1px solid #4ade80" : "1px solid rgba(34,197,94,0.2)",
                color: isActive ? "#4ade80" : "#ffffffcc",
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
          <div style={{ textAlign: "center", padding: "48px 16px", color: "#86efac80" }}>
            <Package size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
            <div style={{ fontWeight: 600, fontSize: 16 }}>Buyurtma topilmadi</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Filtrni o‘zgartiring yoki yangi buyurtma yarating</div>
          </div>
        ) : (
          filtered.map((order) => {
            const cfg = STATUS_CONFIG[order.status] ?? {
              label: order.status,
              accentColor: "#888",
              bgColor: "rgba(150,150,150,0.1)",
              textColor: "#ccc",
              dotColor: "#888",
            };
            return (
              <button
                key={order.id}
                onClick={() => {
                  setSelectedOrder(order);
                  setCarNumber("");
                }}
                style={{ textAlign: "left", width: "100%", transition: "transform 0.1s" }}
                className="active:scale-[0.98]"
              >
                <div
                  style={{
                    ...CARD,
                    position: "relative",
                    overflow: "hidden",
                    padding: "16px",
                  }}
                >
                  {/* Accent bar */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      width: 4,
                      background: cfg.accentColor,
                      boxShadow: `0 0 8px ${cfg.accentColor}`,
                    }}
                  />
                  <div style={{ marginLeft: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 11, fontFamily: "monospace", background: "#1a2e22", padding: "2px 8px", borderRadius: 20, color: "#86efac" }}>
                            {order.id}
                          </span>
                          <span style={{ fontSize: 11, color: "#86efac80" }}>{order.createdAt}</span>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>{order.partnerName}</div>
                        <div style={{ fontSize: 12, color: "#86efacb3", marginTop: 4 }}>{order.items.length} ta mahsulot</div>
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
                          background: "rgba(248,113,113,0.1)",
                          border: "1px solid rgba(248,113,113,0.3)",
                          borderRadius: 16,
                          padding: "8px 12px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: 12, color: "#f87171" }}>Qarz qoldig‘i</span>
                        <span style={{ fontWeight: 700, color: "#f87171" }}>{formatCurrency(order.debtAmount)}</span>
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
    </div>
  );
}

// --------------------------------------------------------------
// OrderDetailSheet (to‘liq qayta stilizatsiya qilingan)
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
  const currentStepIdx = DELIVERY_STEPS.findIndex((s) => s.key === order.status);
  const nonDeliveryStatus = order.status === "rad_etildi" || order.status === "qarz_kutilmoqda";
  const cfg = STATUS_CONFIG[order.status] ?? {
    accentColor: "#888",
    bgColor: "rgba(150,150,150,0.1)",
    textColor: "#ccc",
  };

  return (
    <Drawer open onClose={onClose}>
      <DrawerContent
        style={{
          background: "rgba(3,14,7,0.98)",
          backdropFilter: "blur(32px)",
          borderTop: "1px solid rgba(34,197,94,0.3)",
          borderRadius: "32px 32px 0 0",
          maxHeight: "90vh",
        }}
        className="[&>div]:bg-transparent"
      >
        <DrawerHeader style={{ padding: "20px 20px 12px", borderBottom: "1px solid rgba(34,197,94,0.2)" }}>
          <DrawerTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 4, height: 24, borderRadius: 2, background: cfg.accentColor }} />
              <span style={{ fontSize: 18, fontWeight: 800, color: "#ffffff" }}>{order.id}</span>
            </div>
            <span style={{ fontSize: 12, color: "#86efac80" }}>{order.createdAt}</span>
          </DrawerTitle>
          <p style={{ fontSize: 14, color: "#ffffffcc", marginTop: 6 }}>{order.partnerName}</p>
        </DrawerHeader>

        <div style={{ padding: "16px 20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Stepper */}
          {!nonDeliveryStatus && (
            <div style={{ ...CARD, padding: "16px" }}>
              <div style={{ ...LABEL_SM, marginBottom: 12 }}>Yetkazish holati</div>
              <div style={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
                <div style={{ position: "absolute", top: 16, left: 16, right: 16, height: 2, background: "rgba(107, 4, 4, 0.1)", borderRadius: 2 }} />
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
                          background: done ? cfg.accentColor : "rgba(255,255,255,0.05)",
                          border: active ? `2px solid ${cfg.accentColor}` : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: done ? "#000" : "#86efac80",
                        }}
                      >
                        {done ? <CheckCircle2 size={18} /> : <span style={{ fontSize: 12 }}>{i + 1}</span>}
                      </div>
                      <div style={{ fontSize: 10, marginTop: 8, color: done ? cfg.accentColor : "#86efac80" }}>
                        {step.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items */}
          <div style={{ ...CARD, padding: "16px" }}>
            <div style={{ ...LABEL_SM, marginBottom: 12 }}>Mahsulotlar</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {order.items.map((item, idx) => {
                const price = item.requestedPrice ?? item.product.price;
                return (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                    <div>
                      <div style={{ fontWeight: 600, color: "#fff" }}>{item.product.name}</div>
                      <div style={{ fontSize: 11, color: "#86efac80" }}>
                        {item.quantity} × {formatCurrency(price)}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: cfg.accentColor }}>{formatCurrency(price * item.quantity)}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ height: 1, background: "rgba(34,197,94,0.2)", margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "#fff" }}>Jami</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: cfg.accentColor }}>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Payment details */}
          <div style={{ ...CARD, padding: "16px" }}>
            <div style={{ ...LABEL_SM, marginBottom: 12 }}>To'lov ma'lumotlari</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={TEXT_SECONDARY}>Usul</span>
                <span style={{ color: "#fff" }}>
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
                <span style={{ color: "#4ade80" }}>{formatCurrency(order.paidAmount)}</span>
              </div>
              {order.debtAmount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={TEXT_SECONDARY}>Qarz</span>
                  <span style={{ color: "#f87171" }}>{formatCurrency(order.debtAmount)}</span>
                </div>
              )}
              {order.dueDate && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={TEXT_SECONDARY}>Muddat</span>
                  <span style={{ color: "#fff" }}>{order.dueDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons depending on status */}
          {order.status === "tasdiqlangan" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#86efac", marginBottom: 6, display: "block" }}>
                  <Car size={14} style={{ display: "inline", marginRight: 4 }} /> Mashina raqami
                </label>
                <input
                  placeholder="01 A 123 BC"
                  value={carNumber}
                  onChange={(e) => onCarNumberChange(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    borderRadius: 28,
                    color: "#fff",
                    outline: "none",
                  }}
                />
              </div>
              <button
                onClick={() => alert("Kamera ochilmoqda...")}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  borderRadius: 30,
                  padding: "12px",
                  fontWeight: 600,
                  color: "#fff",
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
                  borderRadius: 30,
                  padding: "14px",
                  fontWeight: 700,
                  color: "#000",
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
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  borderRadius: 30,
                  padding: "12px",
                  fontWeight: 600,
                  color: "#fff",
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
                  borderRadius: 30,
                  padding: "14px",
                  fontWeight: 700,
                  color: "#000",
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
                borderRadius: 30,
                padding: "14px",
                fontWeight: 700,
                color: "#000",
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
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 30,
              padding: "12px",
              fontWeight: 600,
              color: "#fff",
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
// src/screens/InvoiceSheet.tsx
import { useState } from "react";
import { Share2, CheckCircle2, Printer, Wallet, CreditCard, DollarSign, Zap, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Order, formatCurrency, useStore, type PaymentMethod } from "@/lib/store";

interface InvoiceSheetProps {
  order: Order;
  onClose: () => void;
}

const PAYMENT_LABELS: Record<string, string> = {
  naqd: "Naqd pul",
  plastik: "Plastik karta",
  bank: "Bank hisobi",
  qarz: "Qarz (Nasiya)",
};

const PAYMENT_ICONS: Record<string, React.ReactNode> = {
  naqd: <DollarSign className="h-4 w-4" />,
  plastik: <CreditCard className="h-4 w-4" />,
  bank: <Wallet className="h-4 w-4" />,
};

// --------------------------------------------------------------
// Light / Emerald / 3D design tokens (matching Dashboard)
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

const BUTTON_PRIMARY = {
  background: "#10b981",
  border: "none",
  borderRadius: 40,
  padding: "12px 20px",
  fontWeight: 700,
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  cursor: "pointer",
  transition: "all 0.2s",
} as const;

const BUTTON_SECONDARY = {
  background: "rgba(255, 255, 255, 0.6)",
  backdropFilter: "blur(8px)",
  border: "2px solid #10b981",
  borderRadius: 40,
  padding: "12px 20px",
  fontWeight: 600,
  color: "#0f172a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  cursor: "pointer",
  transition: "all 0.2s",
} as const;

export function InvoiceSheet({ order, onClose }: InvoiceSheetProps) {
  const { updateOrderStatus, addPaymentToOrder } = useStore();
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("naqd");
  const [isPaying, setIsPaying] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const hasDebt = order.debtAmount > 0;
  const remainingDebt = order.debtAmount;

  function handleMarkSent() {
    updateOrderStatus(order.id, order.status);
    onClose();
  }

  function handlePaymentSubmit() {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("To'lov miqdorini to'g'ri kiriting");
      return;
    }
    if (amount > remainingDebt) {
      alert("Qarz miqdoridan oshib ketdi");
      return;
    }

    setIsPaying(true);
    setTimeout(() => {
      addPaymentToOrder(order.id, amount, paymentMethod);
      setShowPaymentSuccess(true);
      setIsPaying(false);
      setPaymentAmount("");
      setTimeout(() => setShowPaymentSuccess(false), 2000);
    }, 500);
  }

  return (
    <Drawer open onClose={onClose}>
      <DrawerContent
        style={{
          background: "#ffffff",
          borderTop: "2px solid #10b981",
          borderRadius: "32px 32px 0 0",
          maxHeight: "92vh",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <DrawerHeader
          style={{
            padding: "20px 20px 12px",
            borderBottom: "1px solid rgba(16,185,129,0.2)",
            position: "relative",
          }}
        >
          <DrawerTitle
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 20,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            <Printer size={20} color="#10b981" />
            Invoys
          </DrawerTitle>
          <button
            onClick={onClose}
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
            <X size={16} color="#0f172a" />
          </button>
        </DrawerHeader>

        <div style={{ padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Invoice Header with Light Green Gradient */}
          <div
            style={{
              background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
              borderRadius: 24,
              padding: "20px",
              border: "2px solid #10b981",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#10b981", marginBottom: 4 }}>
                  SalesPro
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{order.id}</div>
              </div>
              <Badge
                style={{
                  background: "#10b98110",
                  color: "#10b981",
                  border: "1px solid #10b981",
                  borderRadius: 40,
                  fontSize: 11,
                }}
              >
                {order.createdAt}
              </Badge>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Mijoz</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{order.partnerName}</div>
            </div>
          </div>

          {/* Items Table */}
          <div style={{ ...CARD, overflow: "hidden", border: "2px solid #10b981" }}>
            <div
              style={{
                background: "#f8fafc",
                padding: "12px 16px",
                display: "grid",
                gridTemplateColumns: "5fr 2fr 2fr 3fr",
                gap: 8,
                borderBottom: "1px solid #10b98140",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", letterSpacing: "0.05em" }}>
                Mahsulot
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", textAlign: "center" }}>Dona</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", textAlign: "right" }}>Narx</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", textAlign: "right" }}>Summa</span>
            </div>
            <div>
              {order.items.map((item, idx) => {
                const unitPrice = item.requestedPrice ?? item.product.price;
                return (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "5fr 2fr 2fr 3fr",
                      gap: 8,
                      padding: "12px 16px",
                      borderTop: idx > 0 ? "1px solid #e2e8f0" : "none",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{item.product.name}</span>
                    <span style={{ fontSize: 13, textAlign: "center", color: "#475569" }}>{item.quantity}</span>
                    <span style={{ fontSize: 13, textAlign: "right", color: "#475569" }}>
                      {formatCurrency(unitPrice)}
                    </span>
                    <span style={{ fontSize: 13, textAlign: "right", fontWeight: 600, color: "#10b981" }}>
                      {formatCurrency(unitPrice * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div style={{ ...CARD, padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: "#475569", fontSize: 13 }}>To'lov usuli</span>
              <span style={{ fontWeight: 600, color: "#0f172a" }}>{PAYMENT_LABELS[order.paymentMethod]}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: "#475569", fontSize: 13 }}>To'langan</span>
              <span style={{ fontWeight: 600, color: "#10b981" }}>{formatCurrency(order.paidAmount)}</span>
            </div>
            {hasDebt && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: "#475569", fontSize: 13 }}>Qarz</span>
                <span style={{ fontWeight: 600, color: "#ef4444" }}>{formatCurrency(remainingDebt)}</span>
              </div>
            )}
            {order.dueDate && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: "#475569", fontSize: 13 }}>To'lov muddati</span>
                <span style={{ color: "#0f172a" }}>{order.dueDate}</span>
              </div>
            )}
            <Separator style={{ background: "#e2e8f0", margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>Jami</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Debt Payment Section */}
          {hasDebt && (
            <div style={{ ...CARD, padding: "16px", animation: "slideIn 0.3s ease" }}>
              <style>
                {`
                  @keyframes slideIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}
              </style>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Zap size={18} color="#f97316" />
                <h3 style={{ fontWeight: 700, color: "#0f172a" }}>Qarzni to'lash</h3>
              </div>
              <div
                style={{
                  background: "#fef3c7",
                  borderRadius: 16,
                  padding: "10px 12px",
                  marginBottom: 16,
                }}
              >
                <span style={{ color: "#475569" }}>Qolgan qarz: </span>
                <span style={{ fontWeight: 700, color: "#ef4444" }}>{formatCurrency(remainingDebt)}</span>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Label style={{ color: "#10b981", fontSize: 12, fontWeight: 600, marginBottom: 6, display: "block" }}>
                  To'lov miqdori (so'm)
                </Label>
                <Input
                  type="number"
                  placeholder="Masalan, 500000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  style={{
                    background: "#ffffff",
                    border: "2px solid #10b981",
                    borderRadius: 28,
                    color: "#0f172a",
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <Label style={{ color: "#10b981", fontSize: 12, fontWeight: 600, marginBottom: 8, display: "block" }}>
                  To'lov usuli
                </Label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {(["naqd", "plastik", "bank"] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        padding: "10px",
                        borderRadius: 20,
                        background: paymentMethod === method ? "#10b98110" : "#f8fafc",
                        border: paymentMethod === method ? "2px solid #10b981" : "1px solid #10b98140",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ color: paymentMethod === method ? "#10b981" : "#475569" }}>
                        {PAYMENT_ICONS[method]}
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: paymentMethod === method ? "#10b981" : "#0f172a",
                        }}
                      >
                        {PAYMENT_LABELS[method]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handlePaymentSubmit}
                disabled={isPaying || !paymentAmount}
                style={{
                  ...BUTTON_PRIMARY,
                  width: "100%",
                  opacity: isPaying || !paymentAmount ? 0.6 : 1,
                  cursor: isPaying || !paymentAmount ? "not-allowed" : "pointer",
                }}
              >
                {isPaying ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="animate-spin" style={{ width: 16, height: 16, border: "2px solid #ffffff", borderTopColor: "transparent", borderRadius: "50%" }} />
                    To'lov amalga oshirilmoqda...
                  </div>
                ) : (
                  "To'lovni amalga oshirish"
                )}
              </button>

              {showPaymentSuccess && (
                <div
                  style={{
                    marginTop: 12,
                    background: "#d1fae5",
                    border: "1px solid #10b981",
                    borderRadius: 20,
                    padding: "10px",
                    textAlign: "center",
                    color: "#10b981",
                    fontWeight: 600,
                    fontSize: 13,
                    animation: "fadeIn 0.3s ease",
                  }}
                >
                  ✅ To'lov muvaffaqiyatli amalga oshirildi!
                </div>
              )}
            </div>
          )}

          {order.note && (
            <div style={{ ...CARD, padding: "16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#10b981", marginBottom: 6 }}>
                Izoh
              </div>
              <div style={{ fontSize: 13, color: "#475569" }}>{order.note}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => {
                const text = `Buyurtma: ${order.id}\nMijoz: ${order.partnerName}\nJami: ${formatCurrency(order.totalAmount)}\nSana: ${order.createdAt}`;
                if (navigator.share) {
                  navigator.share({ text, title: `Invoys ${order.id}` });
                } else {
                  navigator.clipboard.writeText(text);
                  alert("Maʼlumot nusxalandi");
                }
              }}
              style={{ ...BUTTON_SECONDARY, flex: 1 }}
            >
              <Share2 size={16} />
              Ulashish
            </button>
            <button onClick={handleMarkSent} style={{ ...BUTTON_PRIMARY, flex: 1 }}>
              <CheckCircle2 size={16} />
              Yuborildi
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
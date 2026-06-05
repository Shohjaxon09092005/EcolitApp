// src/screens/InvoiceSheet.tsx
import { useState } from "react";
import { Share2, CheckCircle2, Printer, Wallet, CreditCard, DollarSign, Zap, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
// import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Order, formatCurrency, useStore, type PaymentMethod } from "@/lib/store";
// import { cn } from "@/lib/utils";

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
// Dizayn tokenlari (dashboard bilan bir xil)
// --------------------------------------------------------------
const CARD = {
  background: "rgba(9, 25, 13, 0.7)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(34, 197, 94, 0.25)",
  borderRadius: 24,
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
} as const;

const BUTTON_PRIMARY = {
  background: "#22c55e",
  border: "none",
  borderRadius: 40,
  padding: "12px 20px",
  fontWeight: 700,
  color: "#000000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  cursor: "pointer",
  transition: "all 0.2s",
};

const BUTTON_SECONDARY = {
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(34, 197, 94, 0.4)",
  borderRadius: 40,
  padding: "12px 20px",
  fontWeight: 600,
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  cursor: "pointer",
};

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
          background: "rgba(3,14,7,0.98)",
          backdropFilter: "blur(32px)",
          borderTop: "1px solid rgba(34,197,94,0.3)",
          borderRadius: "32px 32px 0 0",
          maxHeight: "92vh",
        }}
        className="[&>div]:bg-transparent"
      >
        <DrawerHeader
          style={{
            padding: "20px 20px 12px",
            borderBottom: "1px solid rgba(34,197,94,0.2)",
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
              color: "#ffffff",
            }}
          >
            <Printer size={20} color="#4ade80" />
            Invoys
          </DrawerTitle>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={16} color="#86efac" />
          </button>
        </DrawerHeader>

        <div style={{ padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Invoice Header with Gradient (yashil neon gradient) */}
          <div
            style={{
              background: "linear-gradient(135deg, #0f4c2a, #0a2b18)",
              borderRadius: 24,
              padding: "20px",
              border: "1px solid rgba(74,222,128,0.3)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#86efac", marginBottom: 4 }}>
                  SalesPro
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#ffffff" }}>{order.id}</div>
              </div>
              <Badge
                style={{
                  background: "rgba(74,222,128,0.15)",
                  color: "#4ade80",
                  border: "1px solid rgba(74,222,128,0.4)",
                  borderRadius: 40,
                  fontSize: 11,
                }}
              >
                {order.createdAt}
              </Badge>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#86efacb3", marginBottom: 4 }}>Mijoz</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#ffffff" }}>{order.partnerName}</div>
            </div>
          </div>

          {/* Items Table */}
          <div style={{ ...CARD, overflow: "hidden" }}>
            <div
              style={{
                background: "rgba(34,197,94,0.05)",
                padding: "12px 16px",
                display: "grid",
                gridTemplateColumns: "5fr 2fr 2fr 3fr",
                gap: 8,
                borderBottom: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: "#86efac", letterSpacing: "0.05em" }}>
                Mahsulot
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#86efac", textAlign: "center" }}>Dona</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#86efac", textAlign: "right" }}>Narx</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#86efac", textAlign: "right" }}>Summa</span>
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
                      borderTop: idx > 0 ? "1px solid rgba(34,197,94,0.1)" : "none",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#ffffff" }}>{item.product.name}</span>
                    <span style={{ fontSize: 13, textAlign: "center", color: "#86efacb3" }}>{item.quantity}</span>
                    <span style={{ fontSize: 13, textAlign: "right", color: "#86efacb3" }}>
                      {formatCurrency(unitPrice)}
                    </span>
                    <span style={{ fontSize: 13, textAlign: "right", fontWeight: 600, color: "#4ade80" }}>
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
              <span style={{ color: "#86efacb3", fontSize: 13 }}>To'lov usuli</span>
              <span style={{ fontWeight: 600, color: "#ffffff" }}>{PAYMENT_LABELS[order.paymentMethod]}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: "#86efacb3", fontSize: 13 }}>To'langan</span>
              <span style={{ fontWeight: 600, color: "#4ade80" }}>{formatCurrency(order.paidAmount)}</span>
            </div>
            {hasDebt && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: "#86efacb3", fontSize: 13 }}>Qarz</span>
                <span style={{ fontWeight: 600, color: "#f87171" }}>{formatCurrency(remainingDebt)}</span>
              </div>
            )}
            {order.dueDate && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: "#86efacb3", fontSize: 13 }}>To'lov muddati</span>
                <span style={{ color: "#ffffff" }}>{order.dueDate}</span>
              </div>
            )}
            <Separator style={{ background: "rgba(34,197,94,0.2)", margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, color: "#ffffff" }}>Jami</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#4ade80" }}>{formatCurrency(order.totalAmount)}</span>
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
                <Zap size={18} color="#fb923c" />
                <h3 style={{ fontWeight: 700, color: "#ffffff" }}>Qarzni to'lash</h3>
              </div>
              <div
                style={{
                  background: "rgba(251,146,60,0.1)",
                  borderRadius: 16,
                  padding: "10px 12px",
                  marginBottom: 16,
                }}
              >
                <span style={{ color: "#86efacb3" }}>Qolgan qarz: </span>
                <span style={{ fontWeight: 700, color: "#f87171" }}>{formatCurrency(remainingDebt)}</span>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Label style={{ color: "#86efac", fontSize: 12, fontWeight: 600, marginBottom: 6, display: "block" }}>
                  To'lov miqdori (so'm)
                </Label>
                <Input
                  type="number"
                  placeholder="Masalan, 500000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(34,197,94,0.4)",
                    borderRadius: 28,
                    color: "#ffffff",
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <Label style={{ color: "#86efac", fontSize: 12, fontWeight: 600, marginBottom: 8, display: "block" }}>
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
                        background: paymentMethod === method ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.03)",
                        border: paymentMethod === method ? "1px solid #4ade80" : "1px solid rgba(34,197,94,0.3)",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ color: paymentMethod === method ? "#4ade80" : "#ffffff" }}>
                        {PAYMENT_ICONS[method]}
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: paymentMethod === method ? "#4ade80" : "#ffffff",
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
                    <div className="animate-spin" style={{ width: 16, height: 16, border: "2px solid #000", borderTopColor: "transparent", borderRadius: "50%" }} />
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
                    background: "rgba(74,222,128,0.1)",
                    border: "1px solid #4ade80",
                    borderRadius: 20,
                    padding: "10px",
                    textAlign: "center",
                    color: "#4ade80",
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
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#86efac", marginBottom: 6 }}>
                Izoh
              </div>
              <div style={{ fontSize: 13, color: "#ffffffcc" }}>{order.note}</div>
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
// src/screens/NewOrderScreen.tsx
import { useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  MessageSquare,
  ChevronDown,
  AlertTriangle,
  ShoppingBag,
  CheckCircle,
  X,
  DollarSign,
  CreditCard,
  Building2,
  CalendarDays,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useStore,
  formatCurrency,
  type Order,
  type PaymentMethod,
} from "@/lib/store";
import { InvoiceSheet } from "./InvoiceSheet";

// --------------------------------------------------------------
// Light / Emerald / 3D design tokens (matching Dashboard)
// --------------------------------------------------------------
const CARD = {
  background: "rgba(255, 255, 255, 0.92)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "2px solid #10b981",
  borderRadius: 28,
  boxShadow:
    "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255,255,255,0.9)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
} as const;

const CARD_3D_HOVER = {
  transform: "translateY(-4px) scale(1.01)",
  boxShadow: "0 20px 35px -10px rgba(16, 185, 129, 0.25), 0 0 0 2px #10b981",
};

const INPUT_STYLE = {
  width: "100%",
  padding: "10px 30px",
  background: "#ffffff",
  border: "2px solid #10b981",
  borderRadius: 32,
  fontSize: 14,
  color: "#0f172a",
  outline: "none",
  transition: "all 0.2s",
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

const LABEL_STYLE = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#10b981",
};

// --------------------------------------------------------------
// Main Component
// --------------------------------------------------------------
export function NewOrderScreen() {
  const {
    partners,
    products,
    cart,
    selectedPartner,
    setSelectedPartner,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    updateCartPrice,
    placeOrder,
    addPriceRequest,
    setActiveTab,
  } = useStore();

  const [partnerSearch, setPartnerSearch] = useState("");
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [priceRequestModal, setPriceRequestModal] = useState<{
    open: boolean;
    productId: string;
    productName: string;
    originalPrice: number;
    currentCartPrice: number;
  }>({
    open: false,
    productId: "",
    productName: "",
    originalPrice: 0,
    currentCartPrice: 0,
  });
  const [paymentSheet, setPaymentSheet] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const [priceReason, setPriceReason] = useState("");

  const cartTotal = cart.reduce(
    (s, item) =>
      s + (item.requestedPrice ?? item.product.price) * item.quantity,
    0,
  );

  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(partnerSearch.toLowerCase()),
  );
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) && p.stock > 0,
  );

  const debtRatio = selectedPartner
    ? selectedPartner.debtAmount / selectedPartner.debtLimit
    : 0;
  const isOverLimit = selectedPartner
    ? selectedPartner.debtAmount + cartTotal > selectedPartner.debtLimit
    : false;

  function handlePlaceOrder(
    method: PaymentMethod,
    paid: number,
    dueDate?: string,
    note?: string,
  ) {
    const order = placeOrder(method, paid, dueDate, note);
    setPaymentSheet(false);
    setInvoiceOrder(order);
  }

  function handlePriceRequestSubmit() {
    if (!priceInput || isNaN(Number(priceInput))) return;
    const requestedPrice = Number(priceInput);
    updateCartPrice(priceRequestModal.productId, requestedPrice);
    addPriceRequest(priceRequestModal.productId, requestedPrice, priceReason);
    setPriceRequestModal((s) => ({ ...s, open: false }));
    setPriceInput("");
    setPriceReason("");
  }

  return (
    <div
      style={{
        background: "transparent",
        minHeight: "100vh",
        padding: "16px 12px 112px",
        maxWidth: 480,
        margin: "0 auto",
        color: "#0f172a",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24, padding: "0 8px" }}>
        <div style={{ ...LABEL_STYLE, marginBottom: 6, fontSize: 12 }}>
          Yangi buyurtma
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.5px",
          }}
        >
          Buyurtma yaratish
        </h1>
      </div>

      {/* Partner Selection Card */}
      <div
        style={{ ...CARD, padding: "20px", marginBottom: 24 }}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, CARD_3D_HOVER)}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = CARD.boxShadow;
        }}
      >
        <div style={LABEL_STYLE}>Mijoz</div>
        {selectedPartner ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 16 }}>
                {selectedPartner.name}
              </div>
              <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                {selectedPartner.phone}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#475569",
                    textTransform: "uppercase",
                  }}
                >
                  Qarz
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: debtRatio > 0.8 ? "#f97316" : "#0f172a",
                  }}
                >
                  {formatCurrency(selectedPartner.debtAmount)}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPartner(null);
                  setPartnerSearch("");
                }}
                style={{
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
            </div>
          </div>
        ) : (
          <button
            onClick={() => setPartnerModalOpen(true)}
            style={{
              ...BUTTON_SECONDARY,
              width: "100%",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            Mijoz tanlash
            <ChevronDown size={16} />
          </button>
        )}
        {selectedPartner && debtRatio > 0.7 && (
          <div
            style={{
              marginTop: 16,
              borderRadius: 20,
              padding: "12px",
              display: "flex",
              gap: 10,
              background: isOverLimit
                ? "rgba(239,68,68,0.08)"
                : "rgba(249,115,22,0.08)",
              border: `1px solid ${isOverLimit ? "#ef4444" : "#f97316"}`,
            }}
          >
            <AlertTriangle size={16} color={isOverLimit ? "#ef4444" : "#f97316"} />
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: isOverLimit ? "#ef4444" : "#f97316",
                }}
              >
                {isOverLimit
                  ? "Qarz limiti oshib ketdi!"
                  : "Qarz limiti yaqinlashmoqda"}
              </div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>
                Limit: {formatCurrency(selectedPartner.debtLimit)} | Joriy qarz:{" "}
                {formatCurrency(selectedPartner.debtAmount)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Search Card */}
      {selectedPartner && (
        <div
          style={{ ...CARD, padding: "20px", marginBottom: 24 }}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, CARD_3D_HOVER)}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = CARD.boxShadow;
          }}
        >
          <div style={LABEL_STYLE}>Mahsulot qo'shish</div>
          <div style={{ position: "relative", marginTop: 12 }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#10b981",
              }}
            />
            <input
              placeholder="Mahsulot qidirish..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              style={INPUT_STYLE}
            />
          </div>
          {productSearch && (
            <div
              style={{
                marginTop: 12,
                maxHeight: 200,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {filteredProducts.length === 0 ? (
                <div style={{ textAlign: "center", padding: 12, color: "#475569" }}>
                  Mahsulot topilmadi
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const inCart = cart.find((i) => i.product.id === product.id);
                  return (
                    <button
                      key={product.id}
                      onClick={() => {
                        addToCart(product);
                        setProductSearch("");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        borderRadius: 20,
                        background: "#f8fafc",
                        border: "1px solid #10b98140",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#475569" }}>
                          {product.stock} ta | {product.unit}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ fontWeight: 700, color: "#10b981" }}>
                          {formatCurrency(product.price)}
                        </div>
                        {inCart ? (
                          <Badge
                            style={{
                              background: "#10b98110",
                              color: "#10b981",
                              border: "1px solid #10b981",
                              borderRadius: 20,
                            }}
                          >
                            Qo'shilgan
                          </Badge>
                        ) : (
                          <div
                            style={{
                              background: "#10b981",
                              borderRadius: "50%",
                              width: 28,
                              height: 28,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Plus size={14} color="#ffffff" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* Cart */}
      {cart.length > 0 && (
        <div
          style={{ ...CARD, padding: "20px", marginBottom: 24 }}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, CARD_3D_HOVER)}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = CARD.boxShadow;
          }}
        >
          <div style={LABEL_STYLE}>Savat ({cart.length} mahsulot)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
            {cart.map((item) => {
              const unitPrice = item.requestedPrice ?? item.product.price;
              return (
                <div
                  key={item.product.id}
                  style={{
                    background: "#f8fafc",
                    borderRadius: 20,
                    padding: "12px",
                    border: "1px solid #10b98120",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>
                        {item.product.name}
                      </div>
                      {item.requestedPrice && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 4,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              color: "#475569",
                              textDecoration: "line-through",
                            }}
                          >
                            {formatCurrency(item.product.price)}
                          </span>
                          <Badge
                            style={{
                              background: "#10b98110",
                              color: "#10b981",
                              border: "1px solid #10b981",
                              fontSize: 9,
                              padding: "1px 8px",
                            }}
                          >
                            So'ralgan narx
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() =>
                          setPriceRequestModal({
                            open: true,
                            productId: item.product.id,
                            productName: item.product.name,
                            originalPrice: item.product.price,
                            currentCartPrice: item.requestedPrice ?? item.product.price,
                          })
                        }
                        style={{
                          background: "#e2e8f0",
                          border: "1px solid #10b981",
                          borderRadius: "50%",
                          width: 28,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MessageSquare size={14} color="#0f172a" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        style={{
                          background: "#fee2e2",
                          border: "1px solid #ef4444",
                          borderRadius: "50%",
                          width: 28,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={14} color="#ef4444" />
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        style={{
                          background: "#f1f5f9",
                          border: "1px solid #10b981",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Minus size={12} color="#0f172a" />
                      </button>
                      <span
                        style={{
                          width: 32,
                          textAlign: "center",
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        style={{
                          background: "#f1f5f9",
                          border: "1px solid #10b981",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Plus size={12} color="#0f172a" />
                      </button>
                    </div>
                    <div style={{ fontWeight: 800, color: "#10b981", fontSize: 16 }}>
                      {formatCurrency(unitPrice * item.quantity)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!selectedPartner && (
        <div style={{ textAlign: "center", padding: "48px 16px" }}>
          <ShoppingBag
            size={48}
            style={{
              marginBottom: 12,
              opacity: 0.5,
              color: "#10b981",
              margin: "0 auto",
            }}
          />
          <div style={{ fontWeight: 600, fontSize: 16, color: "#0f172a" }}>
            Buyurtma yaratish
          </div>
          <div style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>
            Boshlash uchun mijoz tanlang
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar */}
      {cart.length > 0 && selectedPartner && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 32px)",
            maxWidth: 440,
            zIndex: 20,
          }}
        >
          <div
            style={{
              background: "#ffffffd9",
              backdropFilter: "blur(20px)",
              border: "2px solid #10b981",
              borderRadius: 32,
              padding: "16px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <span style={{ color: "#475569", fontWeight: 600 }}>Jami summa:</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>
                {formatCurrency(cartTotal)}
              </span>
            </div>
            <button
              onClick={() => setPaymentSheet(true)}
              style={{
                ...BUTTON_PRIMARY,
                width: "100%",
                padding: "14px",
                fontSize: 16,
                background: isOverLimit ? "#ef4444" : "#10b981",
              }}
            >
              {isOverLimit
                ? "⚠️ Qarz uchun ruxsat so'rash"
                : "Buyurtmani rasmiylashtirish"}
            </button>
          </div>
        </div>
      )}

      {/* Partner Modal */}
      <Dialog open={partnerModalOpen} onOpenChange={setPartnerModalOpen}>
        <DialogContent
          style={{
            background: "#ffffff",
            border: "2px solid #10b981",
            borderRadius: 32,
            maxWidth: 400,
            boxShadow: "0 20px 35px -10px rgba(0,0,0,0.15)",
          }}
          className="[&>button]:hidden"
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#0f172a", fontWeight: 700 }}>
              Mijoz tanlash
            </DialogTitle>
          </DialogHeader>
          <div style={{ marginTop: 8 }}>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#10b981",
                }}
              />
              <input
                placeholder="Ism yoki telefon..."
                value={partnerSearch}
                onChange={(e) => setPartnerSearch(e.target.value)}
                style={INPUT_STYLE}
              />
            </div>
            <div
              className="[&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
              style={{
                maxHeight: 300,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {filteredPartners.map((p) => {
                const ratio = p.debtAmount / p.debtLimit;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPartner(p);
                      setPartnerModalOpen(false);
                      setPartnerSearch("");
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px",
                      background: "#f8fafc",
                      border: "1px solid #10b98140",
                      borderRadius: 20,
                      width: "100%",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#475569" }}>
                        {p.phone}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontWeight: 700,
                          color: ratio >= 1 ? "#ef4444" : ratio > 0.7 ? "#f97316" : "#0f172a",
                        }}
                      >
                        {formatCurrency(p.debtAmount)}
                      </div>
                      <div style={{ fontSize: 10, color: "#475569" }}>
                        limit: {formatCurrency(p.debtLimit)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Price Request Modal */}
      <Dialog
        open={priceRequestModal.open}
        onOpenChange={(v) => setPriceRequestModal((s) => ({ ...s, open: v }))}
      >
        <DialogContent
          style={{
            background: "#ffffff",
            border: "2px solid #10b981",
            borderRadius: 32,
            maxWidth: 400,
            boxShadow: "0 20px 35px -10px rgba(0,0,0,0.15)",
          }}
          className="[&>button]:hidden"
        >
          <DialogHeader>
            <DialogTitle
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#0f172a",
              }}
            >
              <MessageSquare size={18} color="#10b981" />
              Narxni pasaytirish so'rovi
            </DialogTitle>
          </DialogHeader>
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 20,
                padding: "12px",
                marginBottom: 16,
                border: "1px solid #10b98140",
              }}
            >
              <div style={{ fontWeight: 600, color: "#0f172a" }}>
                {priceRequestModal.productName}
              </div>
              <div style={{ fontSize: 12, color: "#475569" }}>
                Joriy narx: {formatCurrency(priceRequestModal.originalPrice)}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Label style={{ color: "#10b981", fontSize: 12, fontWeight: 600 }}>
                So'ralayotgan narx (so'm)
              </Label>
              <input
                type="number"
                placeholder={String(priceRequestModal.currentCartPrice)}
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                style={{ ...INPUT_STYLE, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label style={{ color: "#10b981", fontSize: 12, fontWeight: 600 }}>
                Sabab / Izoh
              </Label>
              <Textarea
                placeholder="Narxni pasaytirish sababini yozing..."
                value={priceReason}
                onChange={(e) => setPriceReason(e.target.value)}
                style={{
                  ...INPUT_STYLE,
                  minHeight: 80,
                  borderRadius: 24,
                  marginTop: 4,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setPriceRequestModal((s) => ({ ...s, open: false }))}
                style={{ ...BUTTON_SECONDARY, flex: 1 }}
              >
                Bekor qilish
              </button>
              <button onClick={handlePriceRequestSubmit} style={{ ...BUTTON_PRIMARY, flex: 1 }}>
                So'rov yuborish
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Sheet */}
      <PaymentSheet
        open={paymentSheet}
        onClose={() => setPaymentSheet(false)}
        total={cartTotal}
        partnerName={selectedPartner?.name ?? ""}
        onConfirm={handlePlaceOrder}
      />

      {/* Invoice Sheet */}
      {invoiceOrder && (
        <InvoiceSheet
          order={invoiceOrder}
          onClose={() => {
            setInvoiceOrder(null);
            setActiveTab("orders");
          }}
        />
      )}
    </div>
  );
}

// --------------------------------------------------------------
// PaymentSheet (light/emerald theme)
// --------------------------------------------------------------
function PaymentSheet({
  open,
  onClose,
  total,
  partnerName,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  total: number;
  partnerName: string;
  onConfirm: (
    method: PaymentMethod,
    paid: number,
    dueDate?: string,
    note?: string,
  ) => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>("naqd");
  const [checkUploaded, setCheckUploaded] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");
  const [paidAmount, setPaidAmount] = useState(String(total));

  const methods: {
    key: PaymentMethod;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { key: "naqd", label: "Naqd pul", icon: <DollarSign size={20} /> },
    { key: "plastik", label: "Plastik karta", icon: <CreditCard size={20} /> },
    { key: "bank", label: "Bank hisobi", icon: <Building2 size={20} /> },
    { key: "qarz", label: "Qarz (Nasiya)", icon: <CalendarDays size={20} /> },
  ];

  function handleConfirm() {
    const paid = method === "qarz" ? Number(paidAmount) || 0 : total;
    onConfirm(method, paid, method === "qarz" ? dueDate : undefined, note || undefined);
    onClose();
  }

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent
        style={{
          background: "#ffffff",
          borderTop: "2px solid #10b981",
          borderRadius: "32px 32px 0 0",
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
              gap: 8,
              fontSize: 20,
              color: "#0f172a",
              fontWeight: 800,
            }}
          >
            <CheckCircle size={20} color="#10b981" />
            To'lov usulini tanlang
          </DrawerTitle>
          <p style={{ color: "#475569", marginTop: 6, fontSize: 13 }}>
            Mijoz: {partnerName} | Jami:{" "}
            <strong style={{ color: "#10b981" }}>{formatCurrency(total)}</strong>
          </p>
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
            }}
          >
            <X size={16} color="#0f172a" />
          </button>
        </DrawerHeader>

        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {methods.map((m) => (
              <button
                key={m.key}
                onClick={() => setMethod(m.key)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px",
                  borderRadius: 24,
                  background: method === m.key ? "#10b98110" : "#f8fafc",
                  border: method === m.key ? "2px solid #10b981" : "1px solid #10b98140",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ color: method === m.key ? "#10b981" : "#475569" }}>
                  {m.icon}
                </div>
                <span style={{ fontWeight: 600, color: method === m.key ? "#10b981" : "#0f172a" }}>
                  {m.label}
                </span>
              </button>
            ))}
          </div>

          {method === "plastik" && (
            <button
              onClick={() => setCheckUploaded((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px",
                borderRadius: 32,
                background: checkUploaded ? "#10b98110" : "#f8fafc",
                border: checkUploaded ? "2px solid #10b981" : "1px solid #10b98140",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  border: "2px solid #10b981",
                  background: checkUploaded ? "#10b981" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {checkUploaded && <CheckCircle size={12} color="#ffffff" />}
              </div>
              <span style={{ color: "#0f172a", fontWeight: 500 }}>
                {checkUploaded ? "Chek yuklandi ✓" : "To'lov chekini yuklash"}
              </span>
              <Upload size={16} style={{ marginLeft: "auto", color: "#10b981" }} />
            </button>
          )}

          {method === "qarz" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <Label style={{ color: "#10b981", fontSize: 12, fontWeight: 600 }}>
                  Avans to'lov (so'm)
                </Label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  style={INPUT_STYLE}
                />
              </div>
              <div>
                <Label style={{ color: "#10b981", fontSize: 12, fontWeight: 600 }}>
                  To'lov muddati
                </Label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={INPUT_STYLE}
                />
              </div>
              <div>
                <Label style={{ color: "#10b981", fontSize: 12, fontWeight: 600 }}>
                  Izoh / Sabab
                </Label>
                <Textarea
                  placeholder="Qarz sababi..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ ...INPUT_STYLE, minHeight: 80, borderRadius: 24 }}
                />
              </div>
            </div>
          )}

          <Separator style={{ background: "rgba(16,185,129,0.2)" }} />
          <div
            style={{
              background: "#10b98110",
              borderRadius: 28,
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              border: "1px solid #10b981",
            }}
          >
            <span style={{ color: "#475569" }}>Jami to'lov:</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>
              {formatCurrency(total)}
            </span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={onClose} style={{ ...BUTTON_SECONDARY, flex: 1 }}>
              Bekor qilish
            </button>
            <button onClick={handleConfirm} style={{ ...BUTTON_PRIMARY, flex: 1 }}>
              Tasdiqlash
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
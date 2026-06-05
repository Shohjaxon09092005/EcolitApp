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
// import { Button } from "@/components/ui/button";
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
// Dizayn tokenlari (dashboard bilan bir xil)
// --------------------------------------------------------------
const CARD = {
  background: "rgba(9, 25, 13, 0.7)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(34, 197, 94, 0.25)",
  borderRadius: 24,
  boxShadow:
    "0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
} as const;

const INPUT_STYLE = {
  width: "100%",
  padding: "10px 30px",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(34, 197, 94, 0.4)",
  borderRadius: 28,
  fontSize: 14,
  color: "#ffffff",
  outline: "none",
  transition: "all 0.2s",

};

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

// --------------------------------------------------------------
// Asosiy komponent
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
        padding: "16px 12px 112px",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24, padding: "0 8px" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#86efac",
            marginBottom: 6,
          }}
        >
          Yangi buyurtma
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.5px",
          }}
        >
          Buyurtma yaratish
        </h1>
      </div>

      {/* Partner Selection Card */}
      <div style={{ ...CARD, padding: "20px", marginBottom: 24 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#86efac",
            marginBottom: 12,
          }}
        >
          Mijoz
        </div>
        {selectedPartner ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: "#ffffff", fontSize: 16 }}>
                {selectedPartner.name}
              </div>
              <div style={{ fontSize: 12, color: "#86efacb3", marginTop: 4 }}>
                {selectedPartner.phone}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#86efacb3",
                    textTransform: "uppercase",
                  }}
                >
                  Qarz
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: debtRatio > 0.8 ? "#fb923c" : "#ffffff",
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
            </div>
          </div>
        ) : (
          <button
            onClick={() => setPartnerModalOpen(true)}
            style={{
              ...BUTTON_SECONDARY,
              width: "100%",
              justifyContent: "space-between",
              padding: "12px 16px",
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
                ? "rgba(239,68,68,0.1)"
                : "rgba(251,146,60,0.1)",
              border: `1px solid ${isOverLimit ? "rgba(239,68,68,0.3)" : "rgba(251,146,60,0.3)"}`,
            }}
          >
            <AlertTriangle
              size={16}
              color={isOverLimit ? "#f87171" : "#fb923c"}
              style={{ marginTop: 2 }}
            />
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: isOverLimit ? "#f87171" : "#fb923c",
                }}
              >
                {isOverLimit
                  ? "Qarz limiti oshib ketdi!"
                  : "Qarz limiti yaqinlashmoqda"}
              </div>
              <div style={{ fontSize: 11, color: "#86efacb3", marginTop: 4 }}>
                Limit: {formatCurrency(selectedPartner.debtLimit)} | Joriy qarz:{" "}
                {formatCurrency(selectedPartner.debtAmount)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Search Card */}
      {selectedPartner && (
        <div style={{ ...CARD, padding: "20px", marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#86efac",
              marginBottom: 12,
            }}
          >
            Mahsulot qo'shish
          </div>
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#86efacb3",
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
                <div
                  style={{
                    textAlign: "center",
                    padding: 12,
                    color: "#86efac80",
                  }}
                >
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
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(34,197,94,0.2)",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: "#ffffff" }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#86efacb3" }}>
                          {product.stock} ta | {product.unit}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div style={{ fontWeight: 700, color: "#4ade80" }}>
                          {formatCurrency(product.price)}
                        </div>
                        {inCart ? (
                          <Badge
                            style={{
                              background: "#4ade8010",
                              color: "#4ade80",
                              border: "1px solid #4ade8030",
                              borderRadius: 20,
                            }}
                          >
                            Qo'shilgan
                          </Badge>
                        ) : (
                          <div
                            style={{
                              background: "#22c55e",
                              borderRadius: "50%",
                              width: 28,
                              height: 28,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Plus size={14} color="#000" />
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
        <div style={{ ...CARD, padding: "20px", marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#86efac",
              marginBottom: 16,
            }}
          >
            Savat ({cart.length} mahsulot)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {cart.map((item) => {
              const unitPrice = item.requestedPrice ?? item.product.price;
              return (
                <div
                  key={item.product.id}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 20,
                    padding: "12px",
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
                      <div style={{ fontWeight: 600, color: "#ffffff" }}>
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
                              color: "#86efac80",
                              textDecoration: "line-through",
                            }}
                          >
                            {formatCurrency(item.product.price)}
                          </span>
                          <Badge
                            style={{
                              background: "#4ade8010",
                              color: "#4ade80",
                              border: "1px solid #4ade8030",
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
                            currentCartPrice:
                              item.requestedPrice ?? item.product.price,
                          })
                        }
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(34,197,94,0.3)",
                          borderRadius: "50%",
                          width: 28,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MessageSquare size={14} color="#86efac" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        style={{
                          background: "rgba(239,68,68,0.1)",
                          border: "1px solid rgba(239,68,68,0.3)",
                          borderRadius: "50%",
                          width: 28,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={14} color="#f87171" />
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
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.quantity - 1)
                        }
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(34,197,94,0.3)",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Minus size={12} color="#ffffff" />
                      </button>
                      <span
                        style={{
                          width: 32,
                          textAlign: "center",
                          fontWeight: 700,
                          color: "#ffffff",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.quantity + 1)
                        }
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(34,197,94,0.3)",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Plus size={12} color="#ffffff" />
                      </button>
                    </div>
                    <div
                      style={{
                        fontWeight: 800,
                        color: "#4ade80",
                        fontSize: 16,
                      }}
                    >
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
              color: "#86efac",
              margin: "0 auto",
            }}
          />
          <div style={{ fontWeight: 600, fontSize: 16, color: "#ffffff" }}>
            Buyurtma yaratish
          </div>
          <div style={{ fontSize: 13, color: "#86efacb3", marginTop: 6 }}>
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
              background: "rgba(9, 25, 13, 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 32,
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <span style={{ color: "#86efacb3", fontWeight: 600 }}>
                Jami summa:
              </span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#4ade80" }}>
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
                background: isOverLimit ? "rgba(239,68,68,0.8)" : "#22c55e",
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
            background: "rgba(3,14,7,0.98)",
            backdropFilter: "blur(32px)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 32,
            maxWidth: 400,
          }}
          className="[&>button]:hidden"
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#ffffff", fontWeight: 700 }}>
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
                  color: "#86efac",
                }}
              />
              <input
                placeholder="Ism yoki telefon..."
                value={partnerSearch}
                onChange={(e) => setPartnerSearch(e.target.value)}
                style={INPUT_STYLE}
              />
            </div>

            {/* 🛠️ QUYIDAGI DIVGA TAILWIND KLASSLARI QO'SHILDI */}
            <div
              className="[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
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
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(34,197,94,0.2)",
                      borderRadius: 20,
                      width: "100%",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "#ffffff" }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#86efacb3" }}>
                        {p.phone}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontWeight: 700,
                          color:
                            ratio >= 1
                              ? "#f87171"
                              : ratio > 0.7
                                ? "#fb923c"
                                : "#ffffff",
                        }}
                      >
                        {formatCurrency(p.debtAmount)}
                      </div>
                      <div style={{ fontSize: 10, color: "#86efac80" }}>
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
            background: "rgba(3,14,7,0.98)",
            backdropFilter: "blur(32px)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 32,
            maxWidth: 400,
          }}
          className="[&>button]:hidden"
        >
          <DialogHeader>
            <DialogTitle
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#ffffff",
              }}
            >
              <MessageSquare size={18} color="#4ade80" />
              Narxni pasaytirish so'rovi
            </DialogTitle>
          </DialogHeader>
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: 20,
                padding: "12px",
                marginBottom: 16,
              }}
            >
              <div style={{ fontWeight: 600, color: "#ffffff" }}>
                {priceRequestModal.productName}
              </div>
              <div style={{ fontSize: 12, color: "#86efacb3" }}>
                Joriy narx: {formatCurrency(priceRequestModal.originalPrice)}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Label
                style={{ color: "#86efac", fontSize: 12, fontWeight: 600 }}
              >
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
              <Label
                style={{ color: "#86efac", fontSize: 12, fontWeight: 600 }}
              >
                Sabab / Izoh
              </Label>
              <Textarea
                placeholder="Narxni pasaytirish sababini yozing..."
                value={priceReason}
                onChange={(e) => setPriceReason(e.target.value)}
                style={{
                  ...INPUT_STYLE,
                  minHeight: 80,
                  borderRadius: 20,
                  marginTop: 4,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() =>
                  setPriceRequestModal((s) => ({ ...s, open: false }))
                }
                style={{ ...BUTTON_SECONDARY, flex: 1 }}
              >
                Bekor qilish
              </button>
              <button
                onClick={handlePriceRequestSubmit}
                style={{ ...BUTTON_PRIMARY, flex: 1 }}
              >
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
// PaymentSheet (to‘liq dark/neon uslubda)
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
    onConfirm(
      method,
      paid,
      method === "qarz" ? dueDate : undefined,
      note || undefined,
    );
    onClose();
  }

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent
        style={{
          background: "rgba(3,14,7,0.98)",
          backdropFilter: "blur(32px)",
          borderTop: "1px solid rgba(34,197,94,0.3)",
          borderRadius: "32px 32px 0 0",
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
              gap: 8,
              fontSize: 20,
              color: "#ffffff",
            }}
          >
            <CheckCircle size={20} color="#4ade80" />
            To'lov usulini tanlang
          </DrawerTitle>
          <p style={{ color: "#86efacb3", marginTop: 6, fontSize: 13 }}>
            Mijoz: {partnerName} | Jami:{" "}
            <strong style={{ color: "#4ade80" }}>
              {formatCurrency(total)}
            </strong>
          </p>
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
            }}
          >
            <X size={16} color="#86efac" />
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
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
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
                  background:
                    method === m.key
                      ? "rgba(74,222,128,0.15)"
                      : "rgba(255,255,255,0.03)",
                  border:
                    method === m.key
                      ? "1px solid #4ade80"
                      : "1px solid rgba(34,197,94,0.3)",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{ color: method === m.key ? "#4ade80" : "#ffffff" }}
                >
                  {m.icon}
                </div>
                <span
                  style={{
                    fontWeight: 600,
                    color: method === m.key ? "#4ade80" : "#ffffff",
                  }}
                >
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
                borderRadius: 28,
                background: checkUploaded
                  ? "rgba(74,222,128,0.1)"
                  : "rgba(255,255,255,0.03)",
                border: checkUploaded
                  ? "1px solid #4ade80"
                  : "1px solid rgba(34,197,94,0.3)",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  border: "2px solid #4ade80",
                  background: checkUploaded ? "#4ade80" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {checkUploaded && <CheckCircle size={12} color="#000" />}
              </div>
              <span style={{ color: "#ffffff", fontWeight: 500 }}>
                {checkUploaded ? "Chek yuklandi ✓" : "To'lov chekini yuklash"}
              </span>
              <Upload
                size={16}
                style={{ marginLeft: "auto", color: "#86efac" }}
              />
            </button>
          )}

          {method === "qarz" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <Label style={{ color: "#86efac", fontSize: 12 }}>
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
                <Label style={{ color: "#86efac", fontSize: 12 }}>
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
                <Label style={{ color: "#86efac", fontSize: 12 }}>
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

          <Separator style={{ background: "rgba(34,197,94,0.2)" }} />
          <div
            style={{
              background: "rgba(74,222,128,0.05)",
              borderRadius: 28,
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "#86efacb3" }}>Jami to'lov:</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#4ade80" }}>
              {formatCurrency(total)}
            </span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={onClose} style={{ ...BUTTON_SECONDARY, flex: 1 }}>
              Bekor qilish
            </button>
            <button
              onClick={handleConfirm}
              style={{ ...BUTTON_PRIMARY, flex: 1 }}
            >
              Tasdiqlash
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
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

// Glassmorphism base class (same as Dashboard/OrdersScreen)
const glassCardClass =
  "bg-white/60 backdrop-blur-2xl border-white/50 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] rounded-[28px] overflow-hidden border";

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
    <div className="flex flex-col h-full pb-28 px-1 pt-4 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-4 px-2">
        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5 text-slate-500">
          Yangi buyurtma
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Buyurtma yaratish</h1>
      </div>

      {/* Partner Selection */}
      <Card className={`${glassCardClass} mb-5`}>
        <CardContent className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
            Mijoz
          </p>
          {selectedPartner ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">
                  {selectedPartner.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedPartner.phone}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">
                    Qarz
                  </p>
                  <p
                    className={`text-sm font-bold ${
                      debtRatio > 0.8 ? "text-amber-600" : "text-slate-700"
                    }`}
                  >
                    {formatCurrency(selectedPartner.debtAmount)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full bg-white/40 hover:bg-white/80"
                  onClick={() => {
                    setSelectedPartner(null);
                    setPartnerSearch("");
                  }}
                >
                  <X className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-between h-12 rounded-2xl bg-white/40 backdrop-blur-sm border-white/50 text-slate-500 hover:bg-white/60"
              onClick={() => setPartnerModalOpen(true)}
            >
              Mijoz tanlash
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
          {selectedPartner && debtRatio > 0.7 && (
            <div
              className={`mt-4 rounded-2xl p-3 flex items-start gap-2 ${
                debtRatio >= 1 || isOverLimit
                  ? "bg-red-50/80 border border-red-100/50"
                  : "bg-amber-50/80 border border-amber-100/50"
              }`}
            >
              <AlertTriangle
                className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                  debtRatio >= 1 || isOverLimit
                    ? "text-red-500"
                    : "text-amber-500"
                }`}
              />
              <div>
                <p
                  className={`text-xs font-bold ${
                    debtRatio >= 1 || isOverLimit
                      ? "text-red-600"
                      : "text-amber-700"
                  }`}
                >
                  {isOverLimit
                    ? "Qarz limiti oshib ketdi!"
                    : "Qarz limiti yaqinlashmoqda"}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Limit: {formatCurrency(selectedPartner.debtLimit)} | Joriy
                  qarz: {formatCurrency(selectedPartner.debtAmount)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Search */}
      {selectedPartner && (
        <Card className={`${glassCardClass} mb-5`}>
          <CardContent className="p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              Mahsulot qo'shish
            </p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Mahsulot qidirish..."
                className="w-full h-12 pl-10 pr-4 text-sm rounded-2xl outline-none bg-white/60 backdrop-blur-2xl border-white/50 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.05)] text-slate-800 placeholder:text-slate-400"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>
            {productSearch && (
              <div className="mt-3 space-y-1 max-h-52 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    Mahsulot topilmadi
                  </p>
                ) : (
                  filteredProducts.map((product) => {
                    const inCart = cart.find(
                      (i) => i.product.id === product.id,
                    );
                    return (
                      <button
                        key={product.id}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/40 transition-colors text-left"
                        onClick={() => {
                          addToCart(product);
                          setProductSearch("");
                        }}
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {product.stock} ta | {product.unit}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-700">
                              {formatCurrency(product.price)}
                            </p>
                          </div>
                          {inCart ? (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-white/50 text-slate-600"
                            >
                              Qo'shilgan
                            </Badge>
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm">
                              <Plus className="h-3.5 w-3.5 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cart */}
      {cart.length > 0 && (
        <Card className={`${glassCardClass} mb-5`}>
          <CardContent className="p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
              Savat ({cart.length} mahsulot)
            </p>
            <div className="space-y-3">
              {cart.map((item) => {
                const unitPrice = item.requestedPrice ?? item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="rounded-2xl bg-white/40 p-3"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {item.product.name}
                        </p>
                        {item.requestedPrice && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs text-slate-400 line-through">
                              {formatCurrency(item.product.price)}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] py-0 h-4 text-indigo-600 border-indigo-200 bg-indigo-50/50"
                            >
                              So'ralgan narx
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-full bg-white/50 hover:bg-white/80 text-slate-500"
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
                          title="Narxni pasaytirish so'rovi"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-full bg-white/50 hover:bg-red-50 text-red-500"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full border-white/50 bg-white/40 text-slate-700"
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity - 1,
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full border-white/50 bg-white/40 text-slate-700"
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity + 1,
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-bold text-indigo-600">
                        {formatCurrency(unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedPartner && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/60 backdrop-blur-2xl border-white/50 flex items-center justify-center mb-5 shadow-sm">
            <ShoppingBag className="h-10 w-10 text-slate-400" />
          </div>
          <p className="font-bold text-slate-700 mb-1">Buyurtma yaratish</p>
          <p className="text-sm text-slate-500">Boshlash uchun mijoz tanlang</p>
        </div>
      )}

      {/* Sticky Bottom Bar with Glass Effect */}
      {cart.length > 0 && selectedPartner && (
        <div className="fixed bottom-16 left-0 right-0 z-20 max-w-md mx-auto px-4">
          <div className="bg-white/80 backdrop-blur-2xl border-white/70 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)] rounded-3xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-500">
                Jami summa:
              </span>
              <span className="text-xl font-black text-indigo-600">
                {formatCurrency(cartTotal)}
              </span>
            </div>
            <Button
              className="w-full h-12 rounded-2xl font-bold text-base shadow-md"
              variant={isOverLimit ? "outline" : "default"}
              style={
                !isOverLimit ? { background: "#6366f1", color: "white" } : {}
              }
              onClick={() => setPaymentSheet(true)}
            >
              {isOverLimit
                ? "⚠️ Qarz uchun ruxsat so'rash"
                : "Buyurtmani rasmiylashtirish"}
            </Button>
          </div>
        </div>
      )}

      {/* Partner Select Modal (Glass) */}
      <Dialog open={partnerModalOpen} onOpenChange={setPartnerModalOpen}>
        <DialogContent className="max-w-sm mx-auto rounded-3xl bg-white/80 backdrop-blur-3xl border-white/60 shadow-2xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-5 pb-2 bg-white/40">
            <DialogTitle className="text-lg font-bold text-slate-900">
              Mijoz tanlash
            </DialogTitle>
          </DialogHeader>
          <div className="p-5 pt-2 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Mijoz qidirish..."
                className="w-full h-11 pl-9 pr-4 text-sm rounded-2xl outline-none bg-white/60 backdrop-blur border-white/50 text-slate-800"
                value={partnerSearch}
                onChange={(e) => setPartnerSearch(e.target.value)}
              />
            </div>
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {filteredPartners.map((p) => {
                const ratio = p.debtAmount / p.debtLimit;
                return (
                  <button
                    key={p.id}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/40 transition-colors text-left"
                    onClick={() => {
                      setSelectedPartner(p);
                      setPartnerModalOpen(false);
                      setPartnerSearch("");
                    }}
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {p.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{p.phone}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xs font-bold ${
                          ratio >= 1
                            ? "text-red-600"
                            : ratio > 0.7
                              ? "text-amber-600"
                              : "text-slate-500"
                        }`}
                      >
                        {formatCurrency(p.debtAmount)}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        limit: {formatCurrency(p.debtLimit)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Price Request Modal (Glass) */}
      <Dialog
        open={priceRequestModal.open}
        onOpenChange={(v) => setPriceRequestModal((s) => ({ ...s, open: v }))}
      >
        <DialogContent className="max-w-sm mx-auto rounded-3xl bg-white/80 backdrop-blur-3xl border-white/60 shadow-2xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-5 pb-2 bg-white/40">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <MessageSquare className="h-5 w-5 text-indigo-500" />
              Narxni pasaytirish so'rovi
            </DialogTitle>
          </DialogHeader>
          <div className="p-5 pt-2 space-y-4">
            <div className="rounded-2xl bg-white/40 p-3">
              <p className="text-sm font-bold mb-1 text-slate-800">
                {priceRequestModal.productName}
              </p>
              <p className="text-xs text-slate-500">
                Joriy narx: {formatCurrency(priceRequestModal.originalPrice)}
              </p>
            </div>
            <div>
              <Label className="text-xs font-bold text-slate-600 mb-1.5 block">
                So'ralayotgan narx (so'm)
              </Label>
              <input
                type="number"
                placeholder={String(priceRequestModal.currentCartPrice)}
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="w-full h-11 px-4 text-sm rounded-2xl outline-none bg-white/60 backdrop-blur border-white/50 text-slate-800"
              />
            </div>
            <div>
              <Label className="text-xs font-bold text-slate-600 mb-1.5 block">
                Sabab / Izoh
              </Label>
              <Textarea
                placeholder="Narxni pasaytirish sababini yozing..."
                value={priceReason}
                onChange={(e) => setPriceReason(e.target.value)}
                className="resize-none rounded-2xl bg-white/60 backdrop-blur border-white/50"
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-11 bg-white/40 border-white/50 text-slate-700"
                onClick={() =>
                  setPriceRequestModal((s) => ({ ...s, open: false }))
                }
              >
                Bekor qilish
              </Button>
              <Button
                className="flex-1 rounded-xl h-11 font-bold bg-indigo-500 hover:bg-indigo-600"
                onClick={handlePriceRequestSubmit}
              >
                So'rov yuborish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Sheet (Glass) */}
      <PaymentSheet
        open={paymentSheet}
        onClose={() => setPaymentSheet(false)}
        total={cartTotal}
        partnerName={selectedPartner?.name ?? ""}
        onConfirm={handlePlaceOrder}
      />

      {/* Invoice */}
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
    {
      key: "naqd",
      label: "Naqd pul",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      key: "plastik",
      label: "Plastik karta",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      key: "bank",
      label: "Bank hisobi",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      key: "qarz",
      label: "Qarz (Nasiya)",
      icon: <CalendarDays className="h-5 w-5" />,
    },
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
      <DrawerContent className="max-h-[90vh] bg-white/80 backdrop-blur-3xl border-t border-white/60 shadow-2xl rounded-t-[32px]">
        <DrawerHeader className="pt-6 pb-2 px-5 relative">
          <DrawerTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <CheckCircle className="h-5 w-5 text-indigo-500" />
            To'lov usulini tanlang
          </DrawerTitle>
          <p className="text-sm text-slate-500 mt-1">
            Mijoz: {partnerName} | Jami:{" "}
            <span className="font-bold text-slate-800">
              {formatCurrency(total)}
            </span>
          </p>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 bg-white/40 hover:bg-white/60 transition-colors"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </DrawerHeader>

        <div className="px-5 pb-8 space-y-5 overflow-y-auto">
          {/* Payment method selection */}
          <div className="grid grid-cols-2 gap-3">
            {methods.map((m) => (
              <button
                key={m.key}
                onClick={() => setMethod(m.key)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 transform active:scale-95 ${
                  method === m.key
                    ? "bg-indigo-50/90 border-2 border-indigo-400 shadow-md scale-[1.02]"
                    : "bg-white/40 border border-white/60 hover:bg-white/60"
                }`}
              >
                <div
                  className={`transition-colors ${
                    method === m.key ? "text-indigo-600" : "text-slate-500"
                  }`}
                >
                  {m.icon}
                </div>
                <span
                  className={`text-sm font-bold ${
                    method === m.key ? "text-indigo-700" : "text-slate-600"
                  }`}
                >
                  {m.label}
                </span>
              </button>
            ))}
          </div>

          {/* Check upload for plastik */}
          {method === "plastik" && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-300">
              <button
                className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${
                  checkUploaded
                    ? "bg-green-50/80 border-2 border-green-400 shadow-md"
                    : "bg-white/40 border border-white/60 hover:bg-white/60"
                }`}
                onClick={() => setCheckUploaded((v) => !v)}
              >
                <div
                  className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    checkUploaded
                      ? "border-green-500 bg-green-500"
                      : "border-slate-400"
                  }`}
                >
                  {checkUploaded && (
                    <CheckCircle className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {checkUploaded ? "Chek yuklandi ✓" : "To'lov chekini yuklash"}
                </span>
                <Upload className="h-4 w-4 text-slate-500 ml-auto" />
              </button>
            </div>
          )}

          {/* Qarz fields */}
          {method === "qarz" && (
            <div className="space-y-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
              <div>
                <Label className="text-xs font-bold text-slate-600 mb-1.5 block">
                  Avans to'lov (so'm)
                </Label>
                <input
                  type="number"
                  placeholder="0"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="w-full h-11 px-4 text-sm rounded-2xl outline-none bg-white/60 backdrop-blur border-white/50 text-slate-800 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 transition-all"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-600 mb-1.5 block">
                  To'lov muddati
                </Label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-11 px-4 text-sm rounded-2xl outline-none bg-white/60 backdrop-blur border-white/50 text-slate-800 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 transition-all"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-600 mb-1.5 block">
                  Izoh / Sabab
                </Label>
                <Textarea
                  placeholder="Qarz sababi..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="resize-none rounded-2xl bg-white/60 backdrop-blur border-white/50 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 transition-all"
                  rows={3}
                />
              </div>
            </div>
          )}

          <Separator className="bg-slate-200/50" />

          {/* Total summary */}
          <div className="rounded-2xl bg-indigo-50/50 p-4 flex items-center justify-between transition-all">
            <span className="text-sm font-semibold text-slate-600">
              Jami to'lov:
            </span>
            <span className="text-xl font-black text-indigo-600">
              {formatCurrency(total)}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl bg-white/40 border-white/50 text-slate-700 hover:bg-white/60 active:scale-95 transition-all"
              onClick={onClose}
            >
              Bekor qilish
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl font-bold bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all shadow-md"
              onClick={handleConfirm}
            >
              Tasdiqlash
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

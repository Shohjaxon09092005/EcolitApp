import { useState } from "react"
import { Search, Car, Camera, CheckCircle2, FileText, Package, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useStore, formatCurrency, type Order, type OrderStatus } from "@/lib/store"
import { InvoiceSheet } from "./InvoiceSheet"

// Glassmorphism base class
const glassCardClass = "bg-white/60 backdrop-blur-2xl border-white/50 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] rounded-[28px] overflow-hidden border"

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Barchasi" },
  { key: "kutilmoqda", label: "Kutilmoqda" },
  { key: "tasdiqlangan", label: "Tasdiqlangan" },
  { key: "qarz_kutilmoqda", label: "Qarz" },
  { key: "yuklangan", label: "Yuklangan" },
  { key: "yetkazildi", label: "Yetkazildi" },
  { key: "rad_etildi", label: "Rad etildi" },
]

const STATUS_CONFIG: Record<string, {
  label: string
  accentColor: string
  bgColor: string
  textColor: string
  dotColor: string
}> = {
  kutilmoqda: {
    label: "Kutilmoqda",
    accentColor: "#f59e0b",
    bgColor: "rgba(245,158,11,0.1)",
    textColor: "#d97706",
    dotColor: "#f59e0b",
  },
  tasdiqlangan: {
    label: "Tasdiqlangan",
    accentColor: "#6366f1",
    bgColor: "rgba(99,102,241,0.1)",
    textColor: "#4f46e5",
    dotColor: "#6366f1",
  },
  yuklangan: {
    label: "Yuklangan",
    accentColor: "#3b82f6",
    bgColor: "rgba(59,130,246,0.1)",
    textColor: "#2563eb",
    dotColor: "#3b82f6",
  },
  yetkazildi: {
    label: "Yetkazildi",
    accentColor: "#22c55e",
    bgColor: "rgba(34,197,94,0.1)",
    textColor: "#16a34a",
    dotColor: "#22c55e",
  },
  rad_etildi: {
    label: "Rad etildi",
    accentColor: "#ef4444",
    bgColor: "rgba(239,68,68,0.1)",
    textColor: "#dc2626",
    dotColor: "#ef4444",
  },
  qarz_kutilmoqda: {
    label: "Qarz kutilmoqda",
    accentColor: "#f97316",
    bgColor: "rgba(249,115,22,0.1)",
    textColor: "#ea580c",
    dotColor: "#f97316",
  },
}

const DELIVERY_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "kutilmoqda", label: "Kutilmoqda" },
  { key: "tasdiqlangan", label: "Tasdiqlandi" },
  { key: "yuklangan", label: "Yuklandi" },
  { key: "yetkazildi", label: "Yetkazildi" },
]

export function OrdersScreen() {
  const { orders, updateOrderStatus } = useStore()
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null)
  const [carNumber, setCarNumber] = useState("")

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "all" || o.status === filter
    const matchSearch =
      search === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.partnerName.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  function handleStatusUpdate(orderId: string, status: OrderStatus, car?: string) {
    updateOrderStatus(orderId, status, car)
    setSelectedOrder((prev) =>
      prev ? { ...prev, status, ...(car ? { carNumber: car } : {}) } : prev
    )
  }

  // Stats
  const totalOrders = orders.length
  const delivered = orders.filter((o) => o.status === "yetkazildi").length
  const pending = orders.filter((o) => o.status === "kutilmoqda").length

  return (
    <div className="flex flex-col h-full pb-28 px-1 pt-4 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-4 px-2">
        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5 text-slate-500">
          Buyurtmalarim
        </p>
        <h1 className="text-2xl font-bold text-slate-900">
          Buyurtmalar
        </h1>
      </div>

      {/* Stats row with glass cards */}
      <div className="grid grid-cols-3 gap-3 mb-5 px-2">
        {[
          { label: "Jami", value: totalOrders, icon: Package, color: "#6366f1", bg: "bg-indigo-100/70" },
          { label: "Kutilmoqda", value: pending, icon: Clock, color: "#f59e0b", bg: "bg-amber-100/70" },
          { label: "Yetkazildi", value: delivered, icon: TrendingUp, color: "#22c55e", bg: "bg-green-100/70" },
        ].map((s) => (
          <Card key={s.label} className={`${glassCardClass} p-4`}>
            <div className={`w-10 h-10 rounded-[14px] ${s.bg} flex items-center justify-center mb-3 shadow-sm`}>
              <s.icon style={{ width: 18, height: 18, color: s.color }} />
            </div>
            <p className="text-2xl font-black text-slate-900 leading-none">{s.value}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 px-2">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          placeholder="Buyurtma ID yoki mijoz..."
          className="w-full h-12 pl-10 pr-4 text-sm rounded-2xl outline-none transition-all bg-white/60 backdrop-blur-2xl border-white/50 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.05)] text-slate-800 placeholder:text-slate-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filter Pills - hide scrollbar */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-3 px-2 no-scrollbar">
        {FILTERS.map((f) => {
          const isActive = filter === f.key
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-200/50"
                  : "bg-white/60 backdrop-blur-2xl border-white/50 text-slate-600 hover:bg-white/80"
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto space-y-3 px-2 pb-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-2xl border-white/50 flex items-center justify-center mb-4 shadow-sm">
              <Package className="h-7 w-7 text-slate-400" />
            </div>
            <p className="font-bold text-slate-700">Buyurtma topilmadi</p>
            <p className="text-sm text-slate-500 mt-1">
              Filtrni o'zgartiring yoki yangi buyurtma yarating
            </p>
          </div>
        ) : (
          filtered.map((order) => {
            const cfg = STATUS_CONFIG[order.status] ?? {
              label: order.status,
              accentColor: "#888",
              bgColor: "rgba(150,150,150,0.1)",
              textColor: "#666",
              dotColor: "#888",
            }
            return (
              <button
                key={order.id}
                className="w-full text-left transition-all active:scale-[0.98]"
                onClick={() => {
                  setSelectedOrder(order)
                  setCarNumber("")
                }}
              >
                <Card className={`${glassCardClass} relative overflow-hidden`}>
                  {/* Accent bar - full height from top to bottom */}
                  <div
                    className="absolute top-0 bottom-0 left-0 w-1.5"
                    style={{ background: cfg.accentColor }}
                  />
                  <CardContent className="pl-5 pr-4 py-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {order.id}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">
                            {order.createdAt}
                          </span>
                        </div>
                        <p className="text-base font-bold text-slate-900 truncate">
                          {order.partnerName}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {order.items.length} ta mahsulot
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <p className="text-base font-black" style={{ color: cfg.accentColor }}>
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <Badge
                          className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold border-0"
                          style={{ background: cfg.bgColor, color: cfg.textColor }}
                        >
                          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: cfg.dotColor }} />
                          {cfg.label}
                        </Badge>
                      </div>
                    </div>

                    {order.debtAmount > 0 && (
                      <div className="mt-3 rounded-xl px-3 py-2 flex items-center justify-between text-xs bg-red-50/80 border border-red-100/50">
                        <span className="text-red-600/80 font-medium">Qarz qoldig'i</span>
                        <span className="font-bold text-red-500">
                          {formatCurrency(order.debtAmount)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </button>
            )
          })
        )}
      </div>

      {selectedOrder && (
        <OrderDetailSheet
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onViewInvoice={() => {
            setInvoiceOrder(selectedOrder)
            setSelectedOrder(null)
          }}
          onStatusUpdate={handleStatusUpdate}
          carNumber={carNumber}
          onCarNumberChange={setCarNumber}
        />
      )}

      {invoiceOrder && (
        <InvoiceSheet order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
      )}
    </div>
  )
}

// OrderDetailSheet remains unchanged (same as previous version) ...
// (I'll include it below for completeness)

function OrderDetailSheet({
  order,
  onClose,
  onViewInvoice,
  onStatusUpdate,
  carNumber,
  onCarNumberChange,
}: {
  order: Order
  onClose: () => void
  onViewInvoice: () => void
  onStatusUpdate: (id: string, status: OrderStatus, car?: string) => void
  carNumber: string
  onCarNumberChange: (v: string) => void
}) {
  const currentStepIdx = DELIVERY_STEPS.findIndex((s) => s.key === order.status)
  const nonDeliveryStatus = order.status === "rad_etildi" || order.status === "qarz_kutilmoqda"
  const cfg = STATUS_CONFIG[order.status] ?? {
    accentColor: "#888",
    bgColor: "rgba(150,150,150,0.1)",
    textColor: "#666",
  }

  return (
    <Drawer open onClose={onClose}>
      <DrawerContent className="max-h-[92vh] bg-white/80 backdrop-blur-3xl border-t border-white/60 shadow-2xl rounded-t-[32px]">
        <DrawerHeader className="pb-2 pt-6 px-5">
          <DrawerTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 rounded-full" style={{ background: cfg.accentColor }} />
              <span className="text-lg font-bold text-slate-900">{order.id}</span>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {order.createdAt}
            </span>
          </DrawerTitle>
          <p className="text-sm text-slate-600 mt-1 ml-3.5">{order.partnerName}</p>
        </DrawerHeader>

        <div className="px-5 pb-8 overflow-y-auto space-y-5">
          {/* Stepper */}
          {!nonDeliveryStatus && (
            <Card className={`${glassCardClass} p-5`}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                Yetkazish holati
              </p>
              <div className="flex items-center justify-between relative">
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200/80 rounded-full" />
                <div
                  className="absolute top-4 left-4 h-0.5 rounded-full transition-all"
                  style={{
                    background: cfg.accentColor,
                    width: currentStepIdx <= 0 ? "0%" : `${(currentStepIdx / (DELIVERY_STEPS.length - 1)) * 100}%`,
                  }}
                />
                {DELIVERY_STEPS.map((step, i) => {
                  const done = i <= currentStepIdx
                  const active = i === currentStepIdx
                  return (
                    <div key={step.key} className="flex flex-col items-center z-10">
                      <div
                        className="h-9 w-9 rounded-full border-2 flex items-center justify-center transition-all bg-white shadow-sm"
                        style={{
                          borderColor: done ? cfg.accentColor : "rgba(0,0,0,0.12)",
                          boxShadow: active ? `0 0 0 4px ${cfg.bgColor}` : "none",
                        }}
                      >
                        {done ? (
                          <CheckCircle2 className="h-4 w-4" style={{ color: cfg.accentColor }} />
                        ) : (
                          <span className="text-xs font-bold text-slate-400">{i + 1}</span>
                        )}
                      </div>
                      <p className="text-[10px] mt-1.5 font-semibold" style={{ color: done ? cfg.accentColor : "rgba(140,140,160,0.9)" }}>
                        {step.label}
                      </p>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {/* Items */}
          <Card className={`${glassCardClass} p-5`}>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              Mahsulotlar
            </p>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.product.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.quantity} × {formatCurrency(item.requestedPrice ?? item.product.price)}
                    </p>
                  </div>
                  <p className="text-sm font-bold" style={{ color: cfg.accentColor }}>
                    {formatCurrency((item.requestedPrice ?? item.product.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <Separator className="my-3 bg-slate-200/60" />
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-600">Jami</span>
              <span className="font-black text-lg" style={{ color: cfg.accentColor }}>
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </Card>

          {/* Payment */}
          <Card className={`${glassCardClass} p-5`}>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              To'lov ma'lumotlari
            </p>
            <div className="space-y-3">
              {[
                {
                  label: "Usul",
                  value: order.paymentMethod === "naqd" ? "Naqd" : order.paymentMethod === "plastik" ? "Plastik" : order.paymentMethod === "bank" ? "Bank" : "Qarz",
                  color: undefined,
                },
                { label: "To'langan", value: formatCurrency(order.paidAmount), color: "#22c55e" },
                ...(order.debtAmount > 0 ? [{ label: "Qarz", value: formatCurrency(order.debtAmount), color: "#ef4444" }] : []),
                ...(order.dueDate ? [{ label: "Muddat", value: order.dueDate, color: undefined }] : []),
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">{row.label}</span>
                  <span className="text-sm font-bold" style={{ color: row.color ?? "#1e293b" }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          {order.status === "tasdiqlangan" && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                  <Car className="h-3.5 w-3.5" /> Mashina raqami
                </label>
                <input
                  placeholder="01 A 123 BC"
                  value={carNumber}
                  onChange={(e) => onCarNumberChange(e.target.value)}
                  className="w-full h-11 px-4 text-sm rounded-2xl outline-none bg-white/60 backdrop-blur-2xl border-white/50 shadow-sm text-slate-800 placeholder:text-slate-400"
                />
              </div>
              <button
                className="w-full h-11 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-white/60 backdrop-blur-2xl border-white/50 shadow-sm text-slate-700"
                onClick={() => alert("Kamera ochilmoqda...")}
              >
                <Camera className="h-4 w-4" />
                Rasm yuklash
              </button>
              <button
                className="w-full h-12 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 text-white transition-all active:scale-[0.98] shadow-lg"
                style={{ background: cfg.accentColor }}
                onClick={() => onStatusUpdate(order.id, "yuklangan", carNumber)}
              >
                <CheckCircle2 className="h-4 w-4" />
                Yuklandi deb belgilash
              </button>
            </div>
          )}

          {order.status === "yuklangan" && (
            <div className="space-y-3">
              <button
                className="w-full h-11 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-white/60 backdrop-blur-2xl border-white/50 shadow-sm text-slate-700"
                onClick={() => alert("Kamera ochilmoqda...")}
              >
                <Camera className="h-4 w-4" />
                Yetkazib berish rasmini yuklash
              </button>
              <button
                className="w-full h-12 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 text-white transition-all active:scale-[0.98] shadow-lg"
                style={{ background: cfg.accentColor }}
                onClick={() => onStatusUpdate(order.id, "yetkazildi")}
              >
                <CheckCircle2 className="h-4 w-4" />
                Yetkazildi deb tasdiqlash
              </button>
            </div>
          )}

          {order.status === "kutilmoqda" && (
            <button
              className="w-full h-12 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 text-white transition-all active:scale-[0.98] shadow-lg"
              style={{ background: cfg.accentColor }}
              onClick={() => onStatusUpdate(order.id, "tasdiqlangan")}
            >
              <CheckCircle2 className="h-4 w-4" />
              Tasdiqlash
            </button>
          )}

          <button
            className="w-full h-11 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-white/60 backdrop-blur-2xl border-white/50 shadow-sm text-slate-700"
            onClick={onViewInvoice}
          >
            <FileText className="h-4 w-4" />
            Invoysni ko'rish
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
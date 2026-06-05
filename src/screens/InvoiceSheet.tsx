import { useState } from "react"
import { Share2, CheckCircle2, Printer, Wallet, CreditCard, DollarSign, Zap } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type Order, formatCurrency, useStore, type PaymentMethod } from "@/lib/store"
import { cn } from "@/lib/utils"

interface InvoiceSheetProps {
  order: Order
  onClose: () => void
}

const PAYMENT_LABELS: Record<string, string> = {
  naqd: "Naqd pul",
  plastik: "Plastik karta",
  bank: "Bank hisobi",
  qarz: "Qarz (Nasiya)",
}

const PAYMENT_ICONS: Record<string, React.ReactNode> = {
  naqd: <DollarSign className="h-4 w-4" />,
  plastik: <CreditCard className="h-4 w-4" />,
  bank: <Wallet className="h-4 w-4" />,
}

// Glassmorphism class
const glassCardClass = "bg-white/60 backdrop-blur-2xl border-white/50 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] rounded-[28px] overflow-hidden border"

export function InvoiceSheet({ order, onClose }: InvoiceSheetProps) {
  const { updateOrderStatus, addPaymentToOrder } = useStore()
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("naqd")
  const [isPaying, setIsPaying] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)

  const hasDebt = order.debtAmount > 0
  const remainingDebt = order.debtAmount

  function handleMarkSent() {
    updateOrderStatus(order.id, order.status)
    onClose()
  }

  function handlePaymentSubmit() {
    const amount = parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      alert("To'lov miqdorini to'g'ri kiriting")
      return
    }
    if (amount > remainingDebt) {
      alert("Qarz miqdoridan oshib ketdi")
      return
    }

    setIsPaying(true)
    // Simulate payment processing
    setTimeout(() => {
      addPaymentToOrder(order.id, amount, paymentMethod)
      setShowPaymentSuccess(true)
      setIsPaying(false)
      // Reset form after success
      setPaymentAmount("")
      setTimeout(() => setShowPaymentSuccess(false), 2000)
      // Refresh order data (store will update automatically)
    }, 500)
  }

  return (
    <Drawer open onClose={onClose}>
      <DrawerContent className="max-h-[92vh] bg-white/80 backdrop-blur-3xl border-t border-white/60 shadow-2xl rounded-t-[32px]">
        <DrawerHeader className="pb-2 pt-6 px-5">
          <DrawerTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <Printer className="h-5 w-5 text-indigo-500" />
            Invoys
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-5 pb-8 overflow-y-auto space-y-5">
          {/* Invoice Header with Gradient */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-indigo-100 text-xs uppercase tracking-wider font-semibold">
                  SalesPro
                </p>
                <p className="text-xl font-bold mt-0.5">{order.id}</p>
              </div>
              <Badge className="bg-white/20 text-white border-0 text-xs font-semibold rounded-full px-3 py-1">
                {order.createdAt}
              </Badge>
            </div>
            <div>
              <p className="text-indigo-100 text-xs">Mijoz</p>
              <p className="font-semibold text-base mt-0.5">{order.partnerName}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className={`${glassCardClass} overflow-hidden`}>
            <div className="bg-white/40 px-5 py-3 grid grid-cols-12 gap-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 col-span-5">Mahsulot</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 col-span-2 text-center">Dona</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 col-span-2 text-right">Narx</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 col-span-3 text-right">Summa</p>
            </div>
            {order.items.map((item, i) => {
              const unitPrice = item.requestedPrice ?? item.product.price
              return (
                <div
                  key={i}
                  className="px-5 py-3 grid grid-cols-12 gap-1 items-start border-t border-white/30"
                >
                  <p className="text-sm font-medium text-slate-800 col-span-5 leading-tight">{item.product.name}</p>
                  <p className="text-sm text-center col-span-2 text-slate-600">
                    {item.quantity}
                  </p>
                  <p className="text-sm text-right col-span-2 text-slate-600">
                    {formatCurrency(unitPrice)}
                  </p>
                  <p className="text-sm text-right col-span-3 font-bold text-slate-800">
                    {formatCurrency(unitPrice * item.quantity)}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className={`${glassCardClass} p-5 space-y-3`}>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">To'lov usuli</span>
              <span className="text-sm font-bold text-slate-800">
                {PAYMENT_LABELS[order.paymentMethod]}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">To'langan</span>
              <span className="text-sm font-bold text-green-600">
                {formatCurrency(order.paidAmount)}
              </span>
            </div>
            {hasDebt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Qarz</span>
                <span className="text-sm font-bold text-red-500">
                  {formatCurrency(remainingDebt)}
                </span>
              </div>
            )}
            {order.dueDate && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">To'lov muddati</span>
                <span className="text-sm font-semibold text-slate-700">{order.dueDate}</span>
              </div>
            )}
            <Separator className="bg-white/50" />
            <div className="flex justify-between items-center pt-1">
              <span className="font-bold text-base text-slate-800">Jami</span>
              <span className="font-black text-lg text-indigo-600">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Debt Payment Section (only if debt exists) */}
          {hasDebt && (
            <div className={`${glassCardClass} p-5 space-y-4 transition-all duration-500 animate-in slide-in-from-bottom-4 fade-in`}>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-slate-800">Qarzni to'lash</h3>
              </div>
              <div className="bg-amber-50/50 rounded-xl p-3 text-sm">
                <p className="text-slate-600">Qolgan qarz: <span className="font-bold text-red-600">{formatCurrency(remainingDebt)}</span></p>
              </div>

              {/* Payment amount input */}
              <div>
                <Label className="text-xs font-bold text-slate-600 mb-1.5 block">To'lov miqdori (so'm)</Label>
                <Input
                  type="number"
                  placeholder="Masalan, 500000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="rounded-xl bg-white/60 border-white/50"
                />
              </div>

              {/* Payment method selection */}
              <div>
                <Label className="text-xs font-bold text-slate-600 mb-2 block">To'lov usuli</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["naqd", "plastik", "bank"] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200",
                        paymentMethod === method
                          ? "bg-indigo-100 border-indigo-300 shadow-sm scale-105"
                          : "bg-white/40 border-white/50 hover:bg-white/60"
                      )}
                    >
                      {PAYMENT_ICONS[method]}
                      <span className="text-[11px] font-semibold">{PAYMENT_LABELS[method]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit button with loading state */}
              <Button
                onClick={handlePaymentSubmit}
                disabled={isPaying || !paymentAmount}
                className={cn(
                  "w-full h-11 rounded-xl font-bold transition-all",
                  isPaying && "opacity-70 cursor-not-allowed"
                )}
              >
                {isPaying ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    To'lov amalga oshirilmoqda...
                  </div>
                ) : (
                  "To'lovni amalga oshirish"
                )}
              </Button>

              {/* Success message animation */}
              {showPaymentSuccess && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-300 bg-green-100 border border-green-200 text-green-700 rounded-xl p-2 text-center text-sm font-semibold">
                  ✅ To'lov muvaffaqiyatli amalga oshirildi!
                </div>
              )}
            </div>
          )}

          {order.note && (
            <div className={`${glassCardClass} p-4`}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Izoh</p>
              <p className="text-sm text-slate-700">{order.note}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-2xl gap-2 bg-white/40 backdrop-blur-sm border-white/50 text-slate-700 hover:bg-white/60"
              onClick={() => {
                const text = `Buyurtma: ${order.id}\nMijoz: ${order.partnerName}\nJami: ${formatCurrency(order.totalAmount)}\nSana: ${order.createdAt}`
                if (navigator.share) {
                  navigator.share({ text, title: `Invoys ${order.id}` })
                } else {
                  navigator.clipboard.writeText(text)
                  alert("Maʼlumot nusxalandi")
                }
              }}
            >
              <Share2 className="h-4 w-4" />
              Ulashish
            </Button>
            <Button
              className="flex-1 h-12 rounded-2xl gap-2 font-bold bg-indigo-500 hover:bg-indigo-600 shadow-md"
              onClick={handleMarkSent}
            >
              <CheckCircle2 className="h-4 w-4" />
              Yuborildi
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
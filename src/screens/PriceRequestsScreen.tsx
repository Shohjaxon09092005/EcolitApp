import {
  Tag,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingDown,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore, formatCurrency, type PriceRequestStatus } from "@/lib/store"

// Glassmorphism base class
const glassCardClass = "bg-white/60 backdrop-blur-2xl border-white/50 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] rounded-[28px] overflow-hidden border"

const STATUS_CONFIG: Record<
  PriceRequestStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  kutilmoqda: {
    label: "Kutilmoqda",
    icon: Clock,
    className: "bg-amber-50/80 text-amber-700 border-amber-200/50",
  },
  tasdiqlandi: {
    label: "Tasdiqlandi",
    icon: CheckCircle2,
    className: "bg-green-50/80 text-green-700 border-green-200/50",
  },
  rad_etildi: {
    label: "Rad etildi",
    icon: XCircle,
    className: "bg-red-50/80 text-red-700 border-red-200/50",
  },
}

export function PriceRequestsScreen() {
  const { priceRequests } = useStore()

  const pending = priceRequests.filter((r) => r.status === "kutilmoqda").length
  const approved = priceRequests.filter((r) => r.status === "tasdiqlandi").length
  const rejected = priceRequests.filter((r) => r.status === "rad_etildi").length

  return (
    <div className="flex flex-col h-full pb-28 px-1 pt-4 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-4 px-2">
        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5 text-slate-500">
          Narx so'rovlari
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Narx So'rovlari</h1>
      </div>

      {/* Summary Pills (Glass Cards) */}
      <div className="grid grid-cols-3 gap-3 mb-5 px-2">
        <Card className={`${glassCardClass} p-3`}>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-amber-100/70 flex items-center justify-center mb-2 shadow-sm">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{pending}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Kutilmoqda</p>
          </div>
        </Card>
        <Card className={`${glassCardClass} p-3`}>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-green-100/70 flex items-center justify-center mb-2 shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{approved}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Tasdiqlandi</p>
          </div>
        </Card>
        <Card className={`${glassCardClass} p-3`}>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-red-100/70 flex items-center justify-center mb-2 shadow-sm">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{rejected}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Rad etildi</p>
          </div>
        </Card>
      </div>

      {/* Requests List */}
      <div className="space-y-3 px-2">
        {priceRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/60 backdrop-blur-2xl border-white/50 flex items-center justify-center mb-5 shadow-sm">
              <Tag className="h-10 w-10 text-slate-400" />
            </div>
            <p className="font-bold text-slate-700">So'rovlar yo'q</p>
            <p className="text-sm text-slate-500 mt-1">
              Buyurtma yaratishda narx so'rovlari qo'shiladi
            </p>
          </div>
        ) : (
          priceRequests.map((req) => {
            const cfg = STATUS_CONFIG[req.status]
            const Icon = cfg.icon
            const discount = req.originalPrice - req.requestedPrice
            const discountPct = Math.round((discount / req.originalPrice) * 100)

            return (
              <Card key={req.id} className={`${glassCardClass}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Tag className="h-3.5 w-3.5 text-slate-400" />
                        <p className="text-[11px] font-mono font-semibold text-slate-500">{req.id}</p>
                        <span className="text-slate-300">·</span>
                        <p className="text-[11px] text-slate-500">{req.createdAt}</p>
                      </div>
                      <p className="text-base font-bold text-slate-800 truncate">{req.productName}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold flex-shrink-0 ${cfg.className}`}
                    >
                      <Icon className="h-3 w-3" />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Price comparison */}
                  <div className="rounded-2xl bg-white/40 p-4 mt-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold text-slate-500 mb-0.5">Asl narx</p>
                        <p className="text-sm font-medium text-slate-400 line-through">
                          {formatCurrency(req.originalPrice)}
                        </p>
                      </div>
                      <TrendingDown className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <div className="flex-1 text-right">
                        <p className="text-[11px] font-semibold text-slate-500 mb-0.5">So'ralgan narx</p>
                        <p className="text-base font-bold text-indigo-600">
                          {formatCurrency(req.requestedPrice)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Chegirma miqdori</span>
                      <Badge
                        variant="destructive"
                        className="text-xs py-0 h-5 rounded-full bg-red-100 text-red-700 border-red-200/50"
                      >
                        -{formatCurrency(discount)} ({discountPct}%)
                      </Badge>
                    </div>
                  </div>

                  {req.reason && (
                    <div className="mt-3 flex items-start gap-1.5 p-2 rounded-xl bg-white/30">
                      <p className="text-[11px] font-semibold text-slate-500">Sabab:</p>
                      <p className="text-xs text-slate-700 flex-1">{req.reason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
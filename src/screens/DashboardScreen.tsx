import { useState } from "react"
import {
  TrendingUp,
  Wallet,
  Clock,
  ShoppingCart,
  CreditCard,
  AlertTriangle,
  ChevronRight,
  Award,
  DollarSign,
  Users,
  PackageX,
  BarChart3,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useStore, formatCurrency, type SalaryInfo } from "@/lib/store"

const MONTHS = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn"]

// Qayta ishlatiluvchi Glassmorphism (Shishasimon) sinfi
const glassCardClass = "bg-white/60 backdrop-blur-2xl border-white/50 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] rounded-[28px] overflow-hidden border"

export function DashboardScreen() {
  const {
    monthlyTarget,
    monthlyAchieved,
    monthlyRevenue,
    orders,
    products,
    salaryInfo,
  } = useStore()
  const [salaryOpen, setSalaryOpen] = useState(false)

  const progressPct = Math.min(100, Math.round((monthlyAchieved / monthlyTarget) * 100))
  const totalDebt = orders
    .filter((o) => o.status !== "yetkazildi" && o.status !== "rad_etildi")
    .reduce((s, o) => s + o.debtAmount, 0)
  const todaySales = orders
    .filter((o) => o.createdAt === new Date().toISOString().split("T")[0])
    .reduce((s, o) => s + o.totalAmount, 0)
  const monthOrders = orders.filter(
    (o) => o.createdAt.startsWith("2026-06")
  ).length
  const pendingPayments = orders
    .filter((o) => o.status === "qarz_kutilmoqda")
    .reduce((s, o) => s + o.debtAmount, 0)

  const lowStockProducts = products.filter((p) => p.stock <= p.minStock)

  const totalFines = salaryInfo.fines.reduce((s, f) => s + f.amount, 0)
  const netSalary =
    salaryInfo.baseSalary +
    salaryInfo.kpiBonus +
    salaryInfo.salesBonus +
    salaryInfo.collectionBonus -
    totalFines

  const chartData = monthlyRevenue.map((val, i) => ({
    month: MONTHS[i],
    summa: Math.round(val / 1_000_000),
  }))

  const statCards = [
    {
      label: "Bugungi sotuv",
      value: formatCurrency(todaySales),
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100/70",
    },
    {
      label: "Oylik buyurtmalar",
      value: `${monthOrders} ta`,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-100/70",
    },
    {
      label: "Kutilayotganlar",
      value: formatCurrency(pendingPayments),
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100/70",
    },
    {
      label: "Debitorlik",
      value: formatCurrency(totalDebt),
      icon: CreditCard,
      color: "text-red-600",
      bg: "bg-red-100/70",
    },
  ]

  return (
    // Floating menu yopib qo'ymasligi uchun pb-28 (padding-bottom) berildi
    <div className="flex flex-col gap-5 pb-28 px-1 pt-4 max-w-md mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full overflow-hidden shadow-md border-2 border-white">
            <div className="h-full w-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">SM</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium tracking-tight">Xayrli kun,</p>
            <h1 className="text-xl font-bold text-slate-900 leading-none mt-0.5">Sarvar (Menejer)</h1>
          </div>
        </div>
      </div>

      {/* KPI Hero Card */}
      <Card className={`${glassCardClass} rounded-[32px] p-6`}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-slate-500 text-[13px] font-semibold uppercase tracking-wider mb-1">
              {salaryInfo.month} oylik reja
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                {progressPct}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-green-100/80 text-green-700 rounded-xl px-3 py-2 shadow-sm border border-green-200/50">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-bold">O'smoqda</span>
          </div>
        </div>

        <Progress
          value={progressPct}
          className="h-2.5 bg-slate-200/50 [&>[data-slot=progress-indicator]]:bg-green-500 shadow-inner rounded-full"
        />

        <div className="flex justify-between mt-5">
          <div>
            <p className="text-slate-500 text-xs font-medium mb-1">Yig'ilgan</p>
            <p className="font-bold text-sm text-slate-900">{formatCurrency(monthlyAchieved)}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-xs font-medium mb-1">Maqsad</p>
            <p className="font-bold text-sm text-slate-900">{formatCurrency(monthlyTarget)}</p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className={`${glassCardClass} p-5`}>
            <div className={`h-10 w-10 rounded-[14px] ${card.bg} flex items-center justify-center mb-3 shadow-sm`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="text-slate-500 text-xs font-semibold leading-tight mb-1.5">
              {card.label}
            </p>
            <p className="font-black text-base text-slate-900 tracking-tight">{card.value}</p>
          </Card>
        ))}
      </div>

      {/* Bar Chart */}
      <Card className={`${glassCardClass} pt-4`}>
        <CardHeader className="pb-4 px-5">
          <CardTitle className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            So'nggi 6 oy tushumi (mln so'm)
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-5">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#64748B", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748B", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [`${value} mln`, "Tushum"]}
                contentStyle={{
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  borderRadius: "16px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#0F172A",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)"
                }}
              />
              <Bar
                dataKey="summa"
                fill="#3B82F6"
                radius={[6, 6, 0, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Salary & Bonuses Widget */}
      <Card className={glassCardClass}>
        <CardHeader className="pb-3 pt-5 px-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="h-4 w-4 text-green-600" />
              Maosh hisob-kitobi
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 bg-blue-50/50 hover:bg-blue-100 rounded-xl text-xs h-8 px-3 gap-1 font-semibold"
              onClick={() => setSalaryOpen(true)}
            >
              To'liq ko'rish
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Asosiy maosh</span>
            <span className="font-bold text-sm text-slate-900">{formatCurrency(salaryInfo.baseSalary)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-green-500" /> KPI bonus
            </span>
            <span className="font-bold text-sm text-green-600">
              +{formatCurrency(salaryInfo.kpiBonus)}
            </span>
          </div>
          <Separator className="bg-slate-200/60 my-1" />
          <div className="flex items-center justify-between mt-2 pt-1">
            <span className="font-bold text-sm text-slate-900">Jami (taxminiy)</span>
            <span className="font-black text-lg text-blue-600">
              {formatCurrency(netSalary)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className={`${glassCardClass} border-l-4 border-l-orange-500`}>
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-[15px] font-bold flex items-center gap-2 text-slate-900">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Kam qoldiq ({lowStockProducts.length} mahsulot)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 bg-white/40 border border-white/60 shadow-sm rounded-2xl p-3.5 min-w-[140px]"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <PackageX className="h-4 w-4 text-orange-500" />
                    {product.stock === 0 ? (
                      <Badge className="text-[10px] py-0 h-4.5 bg-red-100 text-red-600 border-none shadow-none rounded-md px-1.5">
                        Tugagan
                      </Badge>
                    ) : (
                      <Badge className="text-[10px] py-0 h-4.5 bg-orange-100 text-orange-600 border-none shadow-none rounded-md px-1.5">
                        {product.stock} ta
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {product.name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card className={glassCardClass}>
        <CardHeader className="pb-3 pt-5 px-5">
          <CardTitle className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            So'nggi buyurtmalar
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-3">
          {orders.slice(0, 4).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-900 truncate">
                  {order.partnerName}
                </p>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{order.id} · {order.createdAt}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 ml-3">
                <p className="text-sm font-black text-slate-900">{formatCurrency(order.totalAmount)}</p>
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>


      {/* Salary Detail Modal */}
      <SalaryDetailModal
        open={salaryOpen}
        onClose={() => setSalaryOpen(false)}
        salaryInfo={salaryInfo}
        netSalary={netSalary}
        totalFines={totalFines}
        kpiPercent={progressPct}
      />
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    kutilmoqda: { label: "Kutilmoqda", className: "bg-orange-100 text-orange-700" },
    tasdiqlangan: { label: "Tasdiqlangan", className: "bg-blue-100 text-blue-700" },
    yuklangan: { label: "Yuklangan", className: "bg-indigo-100 text-indigo-700" },
    yetkazildi: { label: "Yetkazildi", className: "bg-green-100 text-green-700" },
    rad_etildi: { label: "Rad etildi", className: "bg-red-100 text-red-700" },
    qarz_kutilmoqda: { label: "Qarz", className: "bg-yellow-100 text-yellow-700" },
  }
  const s = map[status] ?? { label: status, className: "bg-slate-100 text-slate-600" }
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2 py-1 text-[10px] font-bold tracking-wide uppercase ${s.className}`}
    >
      {s.label}
    </span>
  )
}

import { X } from "lucide-react" // make sure this import exists

function SalaryDetailModal({
  open,
  onClose,
  salaryInfo,
  netSalary,
  totalFines,
  kpiPercent,
}: {
  open: boolean
  onClose: () => void
  salaryInfo: SalaryInfo
  netSalary: number
  totalFines: number
  kpiPercent: number
}) {
  const rows = [
    { label: "Asosiy maosh", amount: salaryInfo.baseSalary, type: "base", note: "Belgilangan stavka" },
    {
      label: "KPI bonusi",
      amount: salaryInfo.kpiBonus,
      type: "bonus",
      note: `KPI bajarilishi: ${kpiPercent}%`,
    },
    {
      label: "Sotuv bonusi",
      amount: salaryInfo.salesBonus,
      type: "bonus",
      note: "Oylik sotuv hajmiga qarab",
    },
    {
      label: "Inkassatsiya bonusi",
      amount: salaryInfo.collectionBonus,
      type: "bonus",
      note: "Qarzlarni yig'ish samaradorligi",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md w-[calc(100%-32px)] max-h-[85vh] bg-white/80 backdrop-blur-3xl border-white/60 shadow-2xl rounded-[32px] overflow-hidden p-0 gap-0 [&>button:first-child]:hidden"
      >
        <div className="flex flex-col h-full">
          <DialogHeader className="p-5 pb-3 bg-white/40 sticky top-0 z-10 relative">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Wallet className="h-5 w-5 text-blue-600" />
              To'liq maosh hisob-kitobi
            </DialogTitle>
            <p className="text-[13px] font-semibold text-slate-500 mt-1">{salaryInfo.month}</p>
            {/* Custom close button (now the only one) */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 bg-white/40 hover:bg-white/60 transition-colors z-20"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </DialogHeader>

          <div className="p-5 pt-2 space-y-5 overflow-y-auto">
            {/* rest of the content unchanged */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Daromadlar
              </p>
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-xl bg-white/50 border border-white/60 p-3 flex items-start justify-between gap-2 shadow-sm"
                >
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{row.label}</p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{row.note}</p>
                  </div>
                  <span className="text-sm font-black text-green-600 whitespace-nowrap ml-2">
                    +{formatCurrency(row.amount)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Jarimalar
              </p>
              {salaryInfo.fines.map((fine) => (
                <div
                  key={fine.id}
                  className="rounded-xl bg-red-50/50 border border-red-100/50 p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-red-600">{fine.reason}</p>
                      <p className="text-[10px] font-semibold text-red-400 mt-0.5">{fine.date}</p>
                    </div>
                    <span className="text-sm font-black text-red-600 whitespace-nowrap ml-2">
                      -{formatCurrency(fine.amount)}
                    </span>
                  </div>
                </div>
              ))}
              {salaryInfo.fines.length === 0 && (
                <div className="rounded-xl bg-green-50/50 border border-green-100/50 p-3 text-center">
                  <p className="text-sm font-bold text-green-600">
                    Tabriklaymiz, jarimalar yo'q! 🎉
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-blue-50/80 border border-blue-100 p-4 mt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-600">Jami daromad</span>
                <span className="text-sm font-black text-green-600">
                  +{formatCurrency(
                    salaryInfo.baseSalary +
                      salaryInfo.kpiBonus +
                      salaryInfo.salesBonus +
                      salaryInfo.collectionBonus
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600">Jami jarimalar</span>
                <span className="text-sm font-black text-red-600">
                  -{formatCurrency(totalFines)}
                </span>
              </div>
              <Separator className="bg-blue-200/50 mb-3" />
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-slate-900">Sof maosh</span>
                <span className="font-black text-xl text-blue-600">
                  {formatCurrency(netSalary)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
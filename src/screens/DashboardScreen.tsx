import { useState } from "react";
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
  // PackageX,
  BarChart3,
  X,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  useStore,
  formatCurrency,
  useDashboardStore,
  type SalaryInfo,
} from "@/lib/store";

const MONTHS = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn"];

// ── Design Tokens ───────────────────────────────────────────
const CARD = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(34,197,94,0.12)",
  borderRadius: 24,
  boxShadow:
    "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
} as const;

const CARD_GLOW = {
  ...CARD,
  boxShadow:
    "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(34,197,94,0.15), inset 0 1px 0 rgba(34,197,94,0.08)",
} as const;

const LABEL_SM = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "rgba(74,222,128,0.6)",
};

const TEXT_SECONDARY = {
  color: "rgba(255,255,255,0.45)",
  fontSize: 12,
  fontWeight: 500,
};
const TEXT_PRIMARY = { color: "rgba(255,255,255,0.9)", fontWeight: 700 };
// ────────────────────────────────────────────────────────────

export function DashboardScreen() {
  const { salesPeriod, setSalesPeriod, weeklySalesData, monthlySalesData } =
    useDashboardStore();
    

  const activeData =
    salesPeriod === "hafta" ? weeklySalesData : monthlySalesData;

  // YAxis raqamlarini "40M", "80M" ko'rinishiga keltirish uchun formatlovchi
  const formatYAxis = (value: number) => {
    if (value === 0) return "0";
    return `${value / 1000000}M`;
  };
  const {
    monthlyTarget,
    monthlyAchieved,
    monthlyRevenue,
    orders,
    // products,
    salaryInfo,
    partners,
    setActiveTab,
  } = useStore();
  // Qarzdor mijozlar statistikasi
  const debtors = partners.filter((p) => p.debtAmount > 0);
  // const debtorCount = debtors.length;
  // const totalDebtFromPartners = debtors.reduce(
  //   (sum, p) => sum + p.debtAmount,
  //   0,
  // );
  // const topDebtor = debtors.sort((a, b) => b.debtAmount - a.debtAmount)[0];
  // const avgDebt = debtorCount ? totalDebtFromPartners / debtorCount : 0;
  const [salaryOpen, setSalaryOpen] = useState(false);

  const progressPct = Math.min(
    100,
    Math.round((monthlyAchieved / monthlyTarget) * 100),
  );
  const totalDebt = orders
    .filter((o) => o.status !== "yetkazildi" && o.status !== "rad_etildi")
    .reduce((s, o) => s + o.debtAmount, 0);
  const todaySales = orders
    .filter((o) => o.createdAt === new Date().toISOString().split("T")[0])
    .reduce((s, o) => s + o.totalAmount, 0);
  const monthOrders = orders.filter((o) =>
    o.createdAt.startsWith("2026-06"),
  ).length;
  const pendingPayments = orders
    .filter((o) => o.status === "qarz_kutilmoqda")
    .reduce((s, o) => s + o.debtAmount, 0);
  // const lowStockProducts = products.filter((p) => p.stock <= p.minStock);
  const totalFines = salaryInfo.fines.reduce((s, f) => s + f.amount, 0);
  const netSalary =
    salaryInfo.baseSalary +
    salaryInfo.kpiBonus +
    salaryInfo.salesBonus +
    salaryInfo.collectionBonus -
    totalFines;

  const chartData = monthlyRevenue.map((val, i) => ({
    month: MONTHS[i],
    summa: Math.round(val / 1_000_000),
  }));

  const statCards = [
    {
      label: "Bugungi sotuv",
      value: formatCurrency(todaySales),
      icon: DollarSign,
      accent: "#4ade80",
      bg: "rgba(34,197,94,0.1)",
      glow: "rgba(34,197,94,0.2)",
    },
    {
      label: "Oylik buyurtmalar",
      value: `${monthOrders} ta`,
      icon: ShoppingCart,
      accent: "#60a5fa",
      bg: "rgba(59,130,246,0.1)",
      glow: "rgba(59,130,246,0.2)",
    },
    {
      label: "Kutilayotganlar",
      value: formatCurrency(pendingPayments),
      icon: Clock,
      accent: "#fb923c",
      bg: "rgba(249,115,22,0.1)",
      glow: "rgba(249,115,22,0.2)",
    },
    {
      label: "Debitorlik",
      value: formatCurrency(totalDebt),
      icon: CreditCard,
      accent: "#f87171",
      bg: "rgba(239,68,68,0.1)",
      glow: "rgba(239,68,68,0.2)",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        paddingBottom: 112,
        paddingTop: 8,
        maxWidth: 440,
        margin: "0 auto",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 4px 8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "linear-gradient(145deg, #16a34a, #15803d)",
              border: "2px solid rgba(74,222,128,0.35)",
              boxShadow: "0 0 16px rgba(34,197,94,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: 16,
                letterSpacing: 1,
              }}
            >
              SM
            </span>
          </div>
          <div>
            <p style={{ ...TEXT_SECONDARY, marginBottom: 2 }}>Xayrli kun,</p>
            <h1
              style={{
                color: "rgba(255,255,255,0.92)",
                fontWeight: 800,
                fontSize: 18,
                lineHeight: 1,
                margin: 0,
              }}
            >
              Sarvar{" "}
              <span
                style={{
                  color: "rgba(74,222,128,0.7)",
                  fontWeight: 500,
                  fontSize: 13,
                }}
              >
                (Menejer)
              </span>
            </h1>
          </div>
        </div>
        {/* Live dot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 20,
            padding: "5px 12px",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 6px #4ade80",
              display: "inline-block",
            }}
          />
          <span
            style={{
              color: "#4ade80",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            JONLI
          </span>
        </div>
      </div>
      {/* ── KPI HERO SALES CARD (RASMDAGI KOMBINATSIYA) ── */}
      <div
        style={{
          // image_8c41b8.png rasmining o'ng tomonidagi juda to'q, sirli yashil fon
          background: "linear-gradient(135deg, #036b2b 0%, #040806 100%)",
          // Rasmdagi yorqin yashil rangdan ingichka premium chegara
          border: "1px solid rgba(34, 197, 94, 0.2)",
          borderRadius: 24,
          padding: "26px 24px 22px",
          boxShadow:
            "0 25px 50px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Burchakdagi yorug'lik effekti (To'q fonda chiroyli neon bo'lib taraladi) */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, transparent 75%)",
            filter: "blur(25px)",
            pointerEvents: "none",
          }}
        />

        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 24,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div>
            <p
              style={{
                ...LABEL_SM,
                marginBottom: 8,
                fontSize: 13,
                color: "rgba(255, 255, 255, 0.4)",
                letterSpacing: "0.5px",
              }}
            >
              {salaryInfo?.month || "Ushbu oy"} savdo rejasi
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              {/* Yorqin toza oq rangdagi ulkan raqam */}
              <span
                style={{
                  fontSize: 56,
                  fontWeight: 950,
                  color: "#ffffff",
                  lineHeight: 1,
                  letterSpacing: "-2px",
                }}
              >
                {progressPct}
              </span>
              {/* Rasmdagi yorqin yashil foiz belgisi */}
              <span style={{ fontSize: 26, fontWeight: 800, color: "#22c55e" }}>
                %
              </span>
            </div>
          </div>

          {/* Status belgisi: To'q fon ustida rasmdagi yorqin yashil kombinatsiya */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: 14,
              padding: "8px 14px",
            }}
          >
            <TrendingUp style={{ width: 16, height: 16, color: "#22c55e" }} />
            <span
              style={{
                color: "#22c55e",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.3px",
              }}
            >
              O'smoqda
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ position: "relative", marginBottom: 22, zIndex: 1 }}>
          <div
            style={{
              height: 10,
              borderRadius: 9999,
              background: "rgba(255, 255, 255, 0.03)", // Chuqur shaffof orqa foni
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.02)",
            }}
          >
            {/* To'ldirish chizig'i: Aynan rasm dagi dumaloq tugmaning yorqin yashil rangi */}
            <div
              style={{
                width: `${progressPct}%`,
                height: "100%",
                background: "linear-gradient(90deg, #16a34a, #22c55e)",
                borderRadius: 9999,
                boxShadow: "0 0 14px rgba(34, 197, 94, 0.5)",
                transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div>
            <p
              style={{
                ...TEXT_SECONDARY,
                marginBottom: 6,
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.35)",
              }}
            >
              Bajarilgan savdo
            </p>
            {/* Rasmdagi yorqin yashil rang summani yaqqol ko'rsatib turadi */}
            <p
              style={{
                color: "#22c55e",
                fontWeight: 850,
                fontSize: 18,
                margin: 0,
              }}
            >
              {formatCurrency(monthlyAchieved)}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                ...TEXT_SECONDARY,
                marginBottom: 6,
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.35)",
              }}
            >
              Savdo maqsadi
            </p>
            {/* Maqsad oq rangda, lekin fonga singib ketmaydi */}
            <p
              style={{
                color: "#ffffff",
                fontWeight: 850,
                fontSize: 18,
                margin: 0,
              }}
            >
              {formatCurrency(monthlyTarget)}
            </p>
          </div>
        </div>
      </div>
      {/* ── Stats Grid 2x2 ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              ...CARD,
              padding: "18px 16px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* bg glow blob */}
            <div
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: card.glow,
                filter: "blur(20px)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: card.bg,
                border: `1px solid ${card.accent}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <card.icon
                style={{ width: 18, height: 18, color: card.accent }}
              />
            </div>
            <p style={{ ...TEXT_SECONDARY, marginBottom: 4 }}>{card.label}</p>
            <p style={{ ...TEXT_PRIMARY, fontSize: 14, margin: 0 }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>
      {/* ── Bar Chart ── */}
      <div style={{ ...CARD, padding: "18px 6px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
            paddingLeft: 14,
          }}
        >
          <BarChart3 style={{ width: 16, height: 16, color: "#4ade80" }} />
          <span
            style={{
              color: "rgba(255,255,255,0.8)",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            So'nggi 6 oy tushumi (mln so'm)
          </span>
        </div>
        <ResponsiveContainer width="100%" height={170}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 8, left: -24, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{
                fontSize: 11,
                fill: "rgba(255,255,255,0.4)",
                fontWeight: 600,
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{
                fontSize: 11,
                fill: "rgba(255,255,255,0.4)",
                fontWeight: 600,
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [`${value} mln`, "Tushum"]}
              contentStyle={{
                background: "rgba(4,20,10,0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(34,197,94,0.25)",
                borderRadius: 14,
                fontSize: 12,
                fontWeight: 700,
                color: "#4ade80",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              }}
              cursor={{ fill: "rgba(34,197,94,0.05)" }}
            />
            <Bar
              dataKey="summa"
              fill="url(#barGrad)"
              radius={[6, 6, 0, 0]}
              barSize={26}
            />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0.6} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* ── Salary Widget ── */}
      <div style={{ ...CARD_GLOW, padding: "18px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Wallet style={{ width: 16, height: 16, color: "#4ade80" }} />
            <span
              style={{
                color: "rgba(255,255,255,0.85)",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Maosh hisob-kitobi
            </span>
          </div>
          <button
            onClick={() => setSalaryOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 10,
              padding: "5px 10px",
              cursor: "pointer",
              color: "#4ade80",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Ko'rish <ChevronRight style={{ width: 12, height: 12 }} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={TEXT_SECONDARY}>Asosiy maosh</span>
            <span
              style={{
                color: "rgba(255,255,255,0.8)",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {formatCurrency(salaryInfo.baseSalary)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                ...TEXT_SECONDARY,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Award style={{ width: 13, height: 13, color: "#4ade80" }} /> KPI
              bonus
            </span>
            <span style={{ color: "#4ade80", fontWeight: 700, fontSize: 13 }}>
              +{formatCurrency(salaryInfo.kpiBonus)}
            </span>
          </div>
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.06)",
              margin: "2px 0",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.7)",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Jami (taxminiy)
            </span>
            <span style={{ color: "#60a5fa", fontWeight: 900, fontSize: 17 }}>
              {formatCurrency(netSalary)}
            </span>
          </div>
        </div>
      </div>
      {/*savdo tahlili */}
      <div
        style={{
          backgroundColor: "rgba(18, 74, 39, 0.2)", // Stats cardingiz foni (yoki loyihadagi ...CARD obyekti)
          borderRadius: 24,
          padding: "24px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
          marginBottom: "24px",
          fontFamily: "sans-serif",
          color: "#ffffff",
          // ── Stats carddan ko'chirilgan muhim stillar ──
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 🌌 bg glow blob (Stats cardingizdagi effekt, grafik rangiga mos yashil neon holatda) */}
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 130, // Katta card bo'lgani uchun blob o'lchami biroz kattalashtirildi
            height: 130,
            borderRadius: "50%",
            background: "rgba(22, 163, 74, 0.3)", // Yashil neon glow effekti
            filter: "blur(30px)",
            pointerEvents: "none",
            zIndex: 1, // Grafik ustiga chiqib ketmasligi uchun
          }}
        />

        {/* Kontentlarni glow'dan ustunroq ko'rsatish uchun wrapper */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Header: Sarlavha va Hafta/Oy Knopkalari */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 24,
              justifyContent: "space-between",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: "#ffffff", // 🌟 Yorqin oq matn
              }}
            >
              Sotuv Dinamikasi
            </h3>

            {/* Hafta / Oy Switcher (Pill dizayn) */}
            <div
              style={{
                display: "flex",
                background: "#0f172a", // Ichki qorong'u fon
                padding: 4,
                borderRadius: 100,
              }}
            >
              <button
                onClick={() => setSalesPeriod("hafta")}
                style={{
                  border: "none",
                  padding: "6px 16px",
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  backgroundColor:
                    salesPeriod === "hafta"
                      ? "rgba(34,197,94,0.2)"
                      : "transparent",
                  color: "#ffffff", // 🌟 Yorqin oq matn
                  boxShadow:
                    salesPeriod === "hafta"
                      ? "0px 2px 8px rgba(0,0,0,0.2)"
                      : "none",
                  transition: "all 0.2s",
                }}
              >
                Hafta
              </button>
              <button
                onClick={() => setSalesPeriod("oy")}
                style={{
                  border: "none",
                  padding: "6px 16px",
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  backgroundColor:
                    salesPeriod === "oy" ? "#334155" : "transparent",
                  color: "#ffffff", // 🌟 Yorqin oq matn
                  boxShadow:
                    salesPeriod === "oy"
                      ? "0px 2px 8px rgba(0,0,0,0.2)"
                      : "none",
                  transition: "all 0.2s",
                }}
              >
                Oy
              </button>
            </div>
          </div>

          {/* Grafik Qismi */}
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activeData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                {/* Setka chiziqlari */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#334155"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
                  tickFormatter={formatYAxis}
                  domain={[0, 160000000]}
                  ticks={[0, 40000000, 80000000, 120000000, 160000000]}
                />

                {/* To'q fonli zamonaviy Tooltip */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: 12,
                    border: "1px solid #334155",
                  }}
                  labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                  itemStyle={{ color: "#22c55e" }}
                  formatter={(value: any) => [
                    `${Number(value).toLocaleString()} UZS`,
                    "Sotuv",
                  ]}
                />

                {/* Silliq chiziqli yashil Area */}
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* // ================== QARZDORLAR RO'YXATI KARTOCHKASI ==================
      // (Joylashtirish: masalan, Maosh widgeti va Savdo dinamikasi orasiga) */}
      <div style={{ ...CARD, padding: "18px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle
              style={{ width: 16, height: 16, color: "#fb923c" }}
            />
            <span
              style={{
                color: "rgba(255,255,255,0.85)",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Eng katta qarzdorlar
            </span>
          </div>
          <button
            onClick={() => setActiveTab("customers")} // customers tabiga o'tish
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 11,
              fontWeight: 700,
              color: "#4ade80",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Umumiy ko‘rish <ChevronRight size={14} />
          </button>
        </div>

        {debtors.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px 0",
              color: "#a3e635",
              fontWeight: 500,
            }}
          >
            🎉 Qarzdor mijozlar mavjud emas!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {debtors.slice(0, 3).map((debtor, idx) => (
              <div
                key={debtor.id}
                style={{
                  background: "rgba(34,197,94,0.05)",
                  borderRadius: 16,
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid rgba(34,197,94,0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background:
                        idx === 0
                          ? "#fbbf24"
                          : idx === 1
                            ? "#94a3b8"
                            : "#cd7f32",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#0a0f1a",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#ffffff" }}>
                      {debtor.name}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}
                    >
                      {debtor.phone}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{ fontSize: 14, fontWeight: 800, color: "#f87171" }}
                  >
                    {formatCurrency(debtor.debtAmount)}
                  </div>
                  <div style={{ fontSize: 10, color: "#fb923c" }}>
                    Limit: {formatCurrency(debtor.debtLimit)}
                  </div>
                </div>
              </div>
            ))}
            {debtors.length > 3 && (
              <div style={{ textAlign: "center", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                  + {debtors.length - 3} ta yana qarzdor
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      {/* ── Recent Orders ── */}
      <div style={{ ...CARD, padding: "18px 18px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <Users style={{ width: 15, height: 15, color: "#60a5fa" }} />
          <span
            style={{
              color: "rgba(255,255,255,0.8)",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            So'nggi buyurtmalar
          </span>
        </div>
        <div>
          {orders.slice(0, 4).map((order, i) => (
            <div
              key={order.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "11px 0",
                borderBottom:
                  i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.85)",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {order.partnerName}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.3)",
                    marginTop: 3,
                    margin: "3px 0 0",
                  }}
                >
                  {order.id} · {order.createdAt}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 5,
                  marginLeft: 12,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "rgba(255,255,255,0.85)",
                    margin: 0,
                  }}
                >
                  {formatCurrency(order.totalAmount)}
                </p>
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ── Salary Modal ── */}
      <SalaryDetailModal
        open={salaryOpen}
        onClose={() => setSalaryOpen(false)}
        salaryInfo={salaryInfo}
        netSalary={netSalary}
        totalFines={totalFines}
        kpiPercent={progressPct}
      />
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { label: string; color: string; bg: string; border: string }
  > = {
    kutilmoqda: {
      label: "Kutilmoqda",
      color: "#fb923c",
      bg: "rgba(249,115,22,0.1)",
      border: "rgba(249,115,22,0.25)",
    },
    tasdiqlangan: {
      label: "Tasdiqlangan",
      color: "#60a5fa",
      bg: "rgba(59,130,246,0.1)",
      border: "rgba(59,130,246,0.25)",
    },
    yuklangan: {
      label: "Yuklangan",
      color: "#a78bfa",
      bg: "rgba(139,92,246,0.1)",
      border: "rgba(139,92,246,0.25)",
    },
    yetkazildi: {
      label: "Yetkazildi",
      color: "#4ade80",
      bg: "rgba(34,197,94,0.1)",
      border: "rgba(34,197,94,0.25)",
    },
    rad_etildi: {
      label: "Rad etildi",
      color: "#f87171",
      bg: "rgba(239,68,68,0.1)",
      border: "rgba(239,68,68,0.25)",
    },
    qarz_kutilmoqda: {
      label: "Qarz",
      color: "#fbbf24",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.25)",
    },
  };
  const s = map[status] ?? {
    label: status,
    color: "rgba(255,255,255,0.5)",
    bg: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.1)",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 8,
        padding: "3px 7px",
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.label}
    </span>
  );
}

// ── Salary Detail Modal ───────────────────────────────────────
function SalaryDetailModal({
  open,
  onClose,
  salaryInfo,
  netSalary,
  totalFines,
  kpiPercent,
}: {
  open: boolean;
  onClose: () => void;
  salaryInfo: SalaryInfo;
  netSalary: number;
  totalFines: number;
  kpiPercent: number;
}) {
  const rows = [
    {
      label: "Asosiy maosh",
      amount: salaryInfo.baseSalary,
      note: "Belgilangan stavka",
    },
    {
      label: "KPI bonusi",
      amount: salaryInfo.kpiBonus,
      note: `KPI bajarilishi: ${kpiPercent}%`,
    },
    {
      label: "Sotuv bonusi",
      amount: salaryInfo.salesBonus,
      note: "Oylik sotuv hajmiga qarab",
    },
    {
      label: "Inkassatsiya bonusi",
      amount: salaryInfo.collectionBonus,
      note: "Qarzlarni yig'ish samaradorligi",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md w-[calc(100%-32px)] max-h-[85vh] overflow-hidden p-0 gap-0 [&>button:first-child]:hidden"
        style={{
          background: "rgba(3,14,7,0.97)",
          backdropFilter: "blur(32px)",
          border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: 28,
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(34,197,94,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "85vh",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px 20px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              position: "relative",
              background: "rgba(34,197,94,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <Wallet style={{ width: 18, height: 18, color: "#4ade80" }} />
              <span
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                To'liq maosh hisob-kitobi
              </span>
            </div>
            <p
              style={{
                color: "rgba(74,222,128,0.6)",
                fontSize: 12,
                fontWeight: 600,
                margin: 0,
              }}
            >
              {salaryInfo.month}
            </p>
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X
                style={{
                  width: 14,
                  height: 14,
                  color: "rgba(255,255,255,0.5)",
                }}
              />
            </button>
          </div>

          {/* Scrollable body */}
          <div
            style={{
              padding: "16px 20px 20px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* Income rows */}
            <div>
              <p style={{ ...LABEL_SM, marginBottom: 10 }}>Daromadlar</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rows.map((row) => (
                  <div
                    key={row.label}
                    style={{
                      background: "rgba(34,197,94,0.05)",
                      border: "1px solid rgba(34,197,94,0.1)",
                      borderRadius: 14,
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          fontWeight: 700,
                          fontSize: 13,
                          margin: 0,
                        }}
                      >
                        {row.label}
                      </p>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.3)",
                          fontSize: 10,
                          margin: "3px 0 0",
                        }}
                      >
                        {row.note}
                      </p>
                    </div>
                    <span
                      style={{
                        color: "#4ade80",
                        fontWeight: 800,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                      }}
                    >
                      +{formatCurrency(row.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fines */}
            <div>
              <p
                style={{
                  ...LABEL_SM,
                  color: "rgba(248,113,113,0.6)",
                  marginBottom: 10,
                }}
              >
                Jarimalar
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {salaryInfo.fines.map((fine) => (
                  <div
                    key={fine.id}
                    style={{
                      background: "rgba(239,68,68,0.05)",
                      border: "1px solid rgba(239,68,68,0.15)",
                      borderRadius: 14,
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          color: "#f87171",
                          fontWeight: 700,
                          fontSize: 13,
                          margin: 0,
                        }}
                      >
                        {fine.reason}
                      </p>
                      <p
                        style={{
                          color: "rgba(248,113,113,0.4)",
                          fontSize: 10,
                          margin: "3px 0 0",
                        }}
                      >
                        {fine.date}
                      </p>
                    </div>
                    <span
                      style={{
                        color: "#f87171",
                        fontWeight: 800,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                      }}
                    >
                      -{formatCurrency(fine.amount)}
                    </span>
                  </div>
                ))}
                {salaryInfo.fines.length === 0 && (
                  <div
                    style={{
                      background: "rgba(34,197,94,0.06)",
                      border: "1px solid rgba(34,197,94,0.15)",
                      borderRadius: 14,
                      padding: "14px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        color: "#4ade80",
                        fontWeight: 700,
                        fontSize: 13,
                        margin: 0,
                      }}
                    >
                      Tabriklaymiz, jarimalar yo'q! 🎉
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Total summary */}
            <div
              style={{
                background: "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.15)",
                borderRadius: 18,
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span style={TEXT_SECONDARY}>Jami daromad</span>
                <span
                  style={{ color: "#4ade80", fontWeight: 800, fontSize: 13 }}
                >
                  +
                  {formatCurrency(
                    salaryInfo.baseSalary +
                      salaryInfo.kpiBonus +
                      salaryInfo.salesBonus +
                      salaryInfo.collectionBonus,
                  )}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <span style={TEXT_SECONDARY}>Jami jarimalar</span>
                <span
                  style={{ color: "#f87171", fontWeight: 800, fontSize: 13 }}
                >
                  -{formatCurrency(totalFines)}
                </span>
              </div>
              <div
                style={{
                  height: 1,
                  background: "rgba(34,197,94,0.15)",
                  marginBottom: 12,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  Sof maosh
                </span>
                <span
                  style={{ color: "#60a5fa", fontWeight: 900, fontSize: 20 }}
                >
                  {formatCurrency(netSalary)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

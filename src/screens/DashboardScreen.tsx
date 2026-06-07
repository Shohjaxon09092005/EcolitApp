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
  BarChart3,
} from "lucide-react";
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
import { useStore, formatCurrency, useDashboardStore, } from "@/lib/store";

const MONTHS = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn"];

// ---------- Enhanced Light Theme with Emerald Borders & 3D ----------
const CARD = {
  background: "rgba(255, 255, 255, 0.92)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "2px solid #10b981", // emerald border
  borderRadius: 28,
  boxShadow:
    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255,255,255,0.9)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
} as const;

const CARD_3D_HOVER = {
  transform: "translateY(-4px) scale(1.01)",
  boxShadow: "0 20px 35px -10px rgba(16, 185, 129, 0.3), 0 0 0 2px #10b981",
};

const LABEL_SM = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#10b981",
};

const TEXT_SECONDARY = {
  color: "rgba(30, 41, 59, 0.7)",
  fontSize: 12,
  fontWeight: 500,
} as const;

const TEXT_PRIMARY = {
  color: "#0f172a",
  fontWeight: 800,
} as const;

// --------------------------------------------------------------
export function DashboardScreen() {
  const { salesPeriod, setSalesPeriod, weeklySalesData, monthlySalesData } =
    useDashboardStore();
  const activeData =
    salesPeriod === "hafta" ? weeklySalesData : monthlySalesData;
  const formatYAxis = (value: number) => {
    if (value === 0) return "0";
    return `${value / 1000000}M`;
  };

  const {
    monthlyTarget,
    monthlyAchieved,
    monthlyRevenue,
    orders,
    salaryInfo,
    partners,
    setActiveTab,
  } = useStore();

  const debtors = partners.filter((p) => p.debtAmount > 0);

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
      accent: "#10b981",
      bg: "rgba(16, 185, 129, 0.08)",
      glow: "rgba(16, 185, 129, 0.2)",
    },
    {
      label: "Oylik buyurtmalar",
      value: `${monthOrders} ta`,
      icon: ShoppingCart,
      accent: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.08)",
      glow: "rgba(59, 130, 246, 0.2)",
    },
    {
      label: "Kutilayotganlar",
      value: formatCurrency(pendingPayments),
      icon: Clock,
      accent: "#f97316",
      bg: "rgba(249, 115, 22, 0.08)",
      glow: "rgba(249, 115, 22, 0.2)",
    },
    {
      label: "Debitorlik",
      value: formatCurrency(totalDebt),
      icon: CreditCard,
      accent: "#ef4444",
      bg: "rgba(239, 68, 68, 0.08)",
      glow: "rgba(239, 68, 68, 0.2)",
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #f0fdf4 0%, #ecfdf5 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        paddingBottom: 112,
        paddingTop: 8,
        maxWidth: 440,
        margin: "0 auto",
      }}
    >
      {/* Header */}
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
              background: "linear-gradient(145deg, #10b981, #059669)",
              border: "2px solid #10b981",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>
              SM
            </span>
          </div>
          <div>
            <p style={{ ...TEXT_SECONDARY, marginBottom: 2 }}>Xayrli kun,</p>
            <h1
              style={{
                color: "#0f172a",
                fontWeight: 800,
                fontSize: 18,
                lineHeight: 1,
                margin: 0,
              }}
            >
              Sarvar{" "}
              <span style={{ color: "#10b981", fontWeight: 500, fontSize: 13 }}>
                (Menejer)
              </span>
            </h1>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid #10b981",
            borderRadius: 20,
            padding: "5px 12px",
            boxShadow: "0 2px 6px rgba(16,185,129,0.2)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 6px #10b981",
            }}
          />
          <span style={{ color: "#10b981", fontSize: 11, fontWeight: 700 }}>
            JONLI
          </span>
        </div>
      </div>

      {/* KPI Hero Card with Emerald Border */}
      <div
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
          border: "2px solid #10b981",
          borderRadius: 28,
          padding: "26px 24px 22px",
          boxShadow:
            "0 12px 28px -8px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255,255,255,0.8)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 75%)",
            filter: "blur(30px)",
          }}
        />
        <div
          style={{
            display: "flex",
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
                fontSize: 13,
                color: "#10b981",
                marginBottom: 8,
              }}
            >
              {salaryInfo?.month || "Ushbu oy"} savdo rejasi
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 56, fontWeight: 950, color: "#0f172a" }}>
                {progressPct}
              </span>
              <span style={{ fontSize: 26, fontWeight: 800, color: "#10b981" }}>
                %
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(16,185,129,0.1)",
              border: "1px solid #10b981",
              borderRadius: 14,
              padding: "8px 14px",
            }}
          >
            <TrendingUp size={16} color="#10b981" />
            <span style={{ color: "#10b981", fontWeight: 800 }}>O'smoqda</span>
          </div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <div
            style={{
              height: 10,
              borderRadius: 9999,
              background: "rgba(0,0,0,0.05)",
              overflow: "hidden",
              border: "1px solid rgba(16,185,129,0.2)",
            }}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: "100%",
                background: "linear-gradient(90deg, #10b981, #34d399)",
                borderRadius: 9999,
                boxShadow: "0 0 8px #10b981",
                transition: "width 1s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ ...TEXT_SECONDARY, marginBottom: 6 }}>
              Bajarilgan savdo
            </p>
            <p style={{ color: "#10b981", fontWeight: 850, fontSize: 18 }}>
              {formatCurrency(monthlyAchieved)}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ ...TEXT_SECONDARY, marginBottom: 6 }}>Savdo maqsadi</p>
            <p style={{ color: "#0f172a", fontWeight: 850, fontSize: 18 }}>
              {formatCurrency(monthlyTarget)}
            </p>
          </div>
        </div>
      </div>

      {/* STATS GRID (2x2) - enhanced with 3D, background icons, larger text */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              ...CARD,
              padding: "20px 16px",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, CARD_3D_HOVER);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = CARD.boxShadow;
            }}
          >
            {/* Background icon (semi-transparent, huge) */}
            <div
              style={{
                position: "absolute",
                bottom: -10,
                right: -10,
                opacity: 0.12,
                transform: "rotate(-5deg)",
              }}
            >
              <card.icon size={90} color={card.accent} strokeWidth={1.2} />
            </div>

            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                background: card.bg,
                border: `1px solid ${card.accent}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
                position: "relative",
                zIndex: 2,
              }}
            >
              <card.icon size={22} color={card.accent} />
            </div>
            <p
              style={{
                ...TEXT_SECONDARY,
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.03em",
                position: "relative",
                zIndex: 2,
              }}
            >
              {card.label}
            </p>
            <p
              style={{
                ...TEXT_PRIMARY,
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: "-0.3px",
                margin: 0,
                position: "relative",
                zIndex: 2,
                color: "#0f172a",
              }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Bar Chart (6 months) */}
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
          <BarChart3 size={16} color="#10b981" />
          <span style={{ color: "#0f172a", fontWeight: 700, fontSize: 14 }}>
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
              stroke="rgba(0,0,0,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#475569" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#475569" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [`${value} mln`, "Tushum"]}
              contentStyle={{
                background: "#ffffffcc",
                backdropFilter: "blur(8px)",
                border: "1px solid #10b981",
                borderRadius: 14,
                fontSize: 12,
                fontWeight: 700,
                color: "#0f172a",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              }}
              cursor={{ fill: "rgba(16,185,129,0.08)" }}
            />
            <Bar
              dataKey="summa"
              fill="url(#barGradLight)"
              radius={[6, 6, 0, 0]}
              barSize={28}
            />
            <defs>
              <linearGradient id="barGradLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.4} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Salary Widget */}
      <div style={{ ...CARD_3D_HOVER, ...CARD, padding: "18px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Wallet size={16} color="#10b981" />
            <span style={{ color: "#0f172a", fontWeight: 700, fontSize: 14 }}>
              Maosh hisob-kitobi
            </span>
          </div>
          <button
            onClick={() => setActiveTab("salary")}
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid #10b981",
              borderRadius: 30,
              padding: "6px 14px",
              fontSize: 11,
              fontWeight: 700,
              color: "#10b981",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            Ko'rish <ChevronRight size={12} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={TEXT_SECONDARY}>Asosiy maosh</span>
            <span style={{ color: "#0f172a", fontWeight: 700 }}>
              {formatCurrency(salaryInfo.baseSalary)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                ...TEXT_SECONDARY,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Award size={13} color="#10b981" /> KPI bonus
            </span>
            <span style={{ color: "#10b981", fontWeight: 700 }}>
              +{formatCurrency(salaryInfo.kpiBonus)}
            </span>
          </div>
          <div style={{ height: 1, background: "rgba(0,0,0,0.06)" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, color: "#0f172a" }}>
              Jami (taxminiy)
            </span>
            <span style={{ color: "#3b82f6", fontWeight: 900, fontSize: 17 }}>
              {formatCurrency(netSalary)}
            </span>
          </div>
        </div>
      </div>

      {/* Sales Dynamics Area Chart */}
      <div
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          borderRadius: 28,
          padding: "24px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.05), 0 0 0 2px #10b981",
          marginBottom: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 130,
            height: 130,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 75%)",
            filter: "blur(30px)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              Sotuv Dinamikasi
            </h3>
            <div
              style={{
                display: "flex",
                background: "#e2e8f0",
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
                    salesPeriod === "hafta" ? "#ffffff" : "transparent",
                  color: salesPeriod === "hafta" ? "#10b981" : "#475569",
                  boxShadow:
                    salesPeriod === "hafta"
                      ? "0 2px 8px rgba(0,0,0,0.1)"
                      : "none",
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
                    salesPeriod === "oy" ? "#ffffff" : "transparent",
                  color: salesPeriod === "oy" ? "#10b981" : "#475569",
                  boxShadow:
                    salesPeriod === "oy" ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                }}
              >
                Oy
              </button>
            </div>
          </div>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activeData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorSalesLight"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#cbd5e1"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 12 }}
                  tickFormatter={formatYAxis}
                  domain={[0, 160000000]}
                  ticks={[0, 40000000, 80000000, 120000000, 160000000]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: 12,
                    border: "1px solid #10b981",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  labelStyle={{ color: "#0f172a", fontWeight: "bold" }}
                  itemStyle={{ color: "#10b981" }}
                  formatter={(value: any) => [
                    `${Number(value).toLocaleString()} UZS`,
                    "Sotuv",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSalesLight)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Debtors Widget */}
      <div style={{ ...CARD, padding: "18px 20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={16} color="#f97316" />
            <span style={{ color: "#0f172a", fontWeight: 700 }}>
              Eng katta qarzdorlar
            </span>
          </div>
          <button
            onClick={() => setActiveTab("customers")}
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid #10b981",
              borderRadius: 30,
              padding: "6px 14px",
              fontSize: 11,
              fontWeight: 700,
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
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
              color: "#10b981",
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
                  background: "rgba(16,185,129,0.05)",
                  borderRadius: 18,
                  padding: "12px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid rgba(16,185,129,0.2)",
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
                      fontWeight: 800,
                      fontSize: 12,
                      color: "#0a0f1a",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>
                      {debtor.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#475569" }}>
                      {debtor.phone}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{ fontSize: 14, fontWeight: 800, color: "#ef4444" }}
                  >
                    {formatCurrency(debtor.debtAmount)}
                  </div>
                  <div style={{ fontSize: 10, color: "#f97316" }}>
                    Limit: {formatCurrency(debtor.debtLimit)}
                  </div>
                </div>
              </div>
            ))}
            {debtors.length > 3 && (
              <div
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  color: "#64748b",
                  marginTop: 4,
                }}
              >
                + {debtors.length - 3} ta yana qarzdor
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div style={{ ...CARD, padding: "18px 18px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <Users size={15} color="#3b82f6" />
          <span style={{ color: "#0f172a", fontWeight: 700, fontSize: 14 }}>
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
                borderBottom: i < 3 ? "1px solid rgba(0,0,0,0.05)" : "none",
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  {order.partnerName}
                </p>
                <p style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>
                  {order.id} · {order.createdAt}
                </p>
              </div>
              <div style={{ textAlign: "right", marginLeft: 12 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#0f172a",
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
    </div>
  );
}

// ---------- Status Badge (light theme with emerald touch) ----------
function StatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { label: string; color: string; bg: string; border: string }
  > = {
    kutilmoqda: {
      label: "Kutilmoqda",
      color: "#f97316",
      bg: "rgba(249,115,22,0.1)",
      border: "#f97316",
    },
    tasdiqlangan: {
      label: "Tasdiqlangan",
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
      border: "#3b82f6",
    },
    yuklangan: {
      label: "Yuklangan",
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
      border: "#8b5cf6",
    },
    yetkazildi: {
      label: "Yetkazildi",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      border: "#10b981",
    },
    rad_etildi: {
      label: "Rad etildi",
      color: "#ef4444",
      bg: "rgba(239,68,68,0.1)",
      border: "#ef4444",
    },
    qarz_kutilmoqda: {
      label: "Qarz",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      border: "#f59e0b",
    },
  };
  const s = map[status] ?? {
    label: status,
    color: "#475569",
    bg: "rgba(0,0,0,0.05)",
    border: "#cbd5e1",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 20,
        padding: "3px 10px",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.05em",
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

// src/screens/SalaryScreen.tsx
import { Award, CheckCircle2 } from "lucide-react";
import { useStore, formatCurrency } from "@/lib/store";
import { Separator } from "@/components/ui/separator";

// Design tokens (light / emerald / 3D) matching the app
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
  boxShadow:
    "0 20px 35px -10px rgba(16, 185, 129, 0.25), 0 0 0 2px #10b981",
};

const LABEL_STYLE = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#10b981",
};

const TEXT_SECONDARY = {
  color: "rgba(30, 41, 59, 0.65)",
  fontSize: 12,
  fontWeight: 500,
} as const;

export function SalaryScreen() {
  const { salaryInfo } = useStore();

  const totalIncome =
    salaryInfo.baseSalary +
    salaryInfo.kpiBonus +
    salaryInfo.salesBonus +
    salaryInfo.collectionBonus;
  const totalFines = salaryInfo.fines.reduce((sum, f) => sum + f.amount, 0);
  const netSalary = totalIncome - totalFines;
  const kpiPercent = Math.min(
    100,
    Math.round((salaryInfo.kpiBonus / salaryInfo.baseSalary) * 100)
  );

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
        <div style={{ ...LABEL_STYLE, marginBottom: 4 }}>Maosh hisob-kitobi</div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.5px",
          }}
        >
          {salaryInfo.month}
        </h1>
      </div>

      {/* KPI Hero Card */}
      <div
        style={{ ...CARD, padding: "20px", marginBottom: 24 }}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, CARD_3D_HOVER)}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = CARD.boxShadow;
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>
              KPI bajarilishi
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#0f172a" }}>
              {kpiPercent}%
            </div>
          </div>
          <div
            style={{
              background: "#d1fae5",
              borderRadius: 30,
              padding: "6px 14px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Award size={16} color="#10b981" />
            <span style={{ fontWeight: 700, color: "#10b981" }}>
              Bonusli oy
            </span>
          </div>
        </div>
        <div
          style={{
            height: 10,
            background: "#e2e8f0",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${kpiPercent}%`,
              height: "100%",
              background: "linear-gradient(90deg, #10b981, #34d399)",
              borderRadius: 12,
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* Income Section */}
      <div
        style={{ ...CARD, padding: "20px", marginBottom: 24 }}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, CARD_3D_HOVER)}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = CARD.boxShadow;
        }}
      >
        <div style={LABEL_STYLE}>Daromadlar</div>
        <div
          style={{
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: "#0f172a" }}>
                Asosiy maosh
              </div>
              <div style={{ fontSize: 11, color: "#475569" }}>
                Belgilangan stavka
              </div>
            </div>
            <div style={{ fontWeight: 700, color: "#0f172a" }}>
              {formatCurrency(salaryInfo.baseSalary)}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: "#0f172a" }}>
                KPI bonus
              </div>
              <div style={{ fontSize: 11, color: "#475569" }}>
                KPI bajarilishi: {kpiPercent}%
              </div>
            </div>
            <div style={{ fontWeight: 700, color: "#10b981" }}>
              +{formatCurrency(salaryInfo.kpiBonus)}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: "#0f172a" }}>
                Sotuv bonusi
              </div>
              <div style={{ fontSize: 11, color: "#475569" }}>
                Oylik sotuv hajmiga qarab
              </div>
            </div>
            <div style={{ fontWeight: 700, color: "#10b981" }}>
              +{formatCurrency(salaryInfo.salesBonus)}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: "#0f172a" }}>
                Inkassatsiya bonusi
              </div>
              <div style={{ fontSize: 11, color: "#475569" }}>
                Qarzlarni yig'ish samaradorligi
              </div>
            </div>
            <div style={{ fontWeight: 700, color: "#10b981" }}>
              +{formatCurrency(salaryInfo.collectionBonus)}
            </div>
          </div>
        </div>
      </div>

      {/* Fines Section */}
      <div
        style={{ ...CARD, padding: "20px", marginBottom: 24 }}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, CARD_3D_HOVER)}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = CARD.boxShadow;
        }}
      >
        <div style={{ ...LABEL_STYLE, color: "#ef4444" }}>Jarimalar</div>
        {salaryInfo.fines.length === 0 ? (
          <div
            style={{
              marginTop: 12,
              background: "#d1fae5",
              borderRadius: 20,
              padding: "12px",
              textAlign: "center",
              color: "#10b981",
              fontWeight: 600,
            }}
          >
            <CheckCircle2
              size={16}
              style={{ display: "inline", marginRight: 6 }}
            />
            Tabriklaymiz, jarimalar yo'q! 🎉
          </div>
        ) : (
          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {salaryInfo.fines.map((fine) => (
              <div
                key={fine.id}
                style={{
                  background: "#fef2f2",
                  borderRadius: 20,
                  padding: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #fecaca",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "#dc2626" }}>
                    {fine.reason}
                  </div>
                  <div style={{ fontSize: 11, color: "#f87171" }}>
                    {fine.date}
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: "#dc2626" }}>
                  -{formatCurrency(fine.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Net Salary Summary */}
      <div
        style={{ ...CARD, padding: "20px", border: "2px solid #10b981" }}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, CARD_3D_HOVER)}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = CARD.boxShadow;
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span style={TEXT_SECONDARY}>Jami daromad</span>
          <span style={{ fontWeight: 700, color: "#10b981" }}>
            +{formatCurrency(totalIncome)}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span style={TEXT_SECONDARY}>Jami jarimalar</span>
          <span style={{ fontWeight: 700, color: "#ef4444" }}>
            -{formatCurrency(totalFines)}
          </span>
        </div>
        <Separator style={{ background: "#e2e8f0", margin: "12px 0" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
            Sof maosh
          </span>
          <span
            style={{ fontWeight: 900, fontSize: 24, color: "#3b82f6" }}
          >
            {formatCurrency(netSalary)}
          </span>
        </div>
      </div>
    </div>
  );
}
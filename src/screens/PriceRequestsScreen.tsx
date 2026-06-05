// src/screens/PriceRequestsScreen.tsx
import {
  Tag,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useStore, formatCurrency, type PriceRequestStatus } from "@/lib/store";

// --------------------------------------------------------------
// Dizayn tokenlari (dashboard bilan bir xil)
// --------------------------------------------------------------
const CARD = {
  background: "rgba(9, 25, 13, 0.7)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(34, 197, 94, 0.25)",
  borderRadius: 24,
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
} as const;

const STATUS_CONFIG: Record<
  PriceRequestStatus,
  { label: string; icon: React.ElementType; color: string; bg: string; border: string }
> = {
  kutilmoqda: {
    label: "Kutilmoqda",
    icon: Clock,
    color: "#fb923c",
    bg: "rgba(251,146,60,0.15)",
    border: "rgba(251,146,60,0.4)",
  },
  tasdiqlandi: {
    label: "Tasdiqlandi",
    icon: CheckCircle2,
    color: "#4ade80",
    bg: "rgba(74,222,128,0.15)",
    border: "rgba(74,222,128,0.4)",
  },
  rad_etildi: {
    label: "Rad etildi",
    icon: XCircle,
    color: "#f87171",
    bg: "rgba(248,113,113,0.15)",
    border: "rgba(248,113,113,0.4)",
  },
};

export function PriceRequestsScreen() {
  const { priceRequests } = useStore();

  const pending = priceRequests.filter((r) => r.status === "kutilmoqda").length;
  const approved = priceRequests.filter((r) => r.status === "tasdiqlandi").length;
  const rejected = priceRequests.filter((r) => r.status === "rad_etildi").length;

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
          Narx so'rovlari
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.5px",
          }}
        >
          Narx So'rovlari
        </h1>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24, padding: "0 8px" }}>
        <div style={{ ...CARD, padding: "14px", textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(251,146,60,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 10px",
            }}
          >
            <Clock size={20} color="#fb923c" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#ffffff" }}>{pending}</div>
          <div style={{ fontSize: 11, color: "#86efacb3", marginTop: 6 }}>Kutilmoqda</div>
        </div>
        <div style={{ ...CARD, padding: "14px", textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(74,222,128,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 10px",
            }}
          >
            <CheckCircle2 size={20} color="#4ade80" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#ffffff" }}>{approved}</div>
          <div style={{ fontSize: 11, color: "#86efacb3", marginTop: 6 }}>Tasdiqlandi</div>
        </div>
        <div style={{ ...CARD, padding: "14px", textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(248,113,113,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 10px",
            }}
          >
            <XCircle size={20} color="#f87171" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#ffffff" }}>{rejected}</div>
          <div style={{ fontSize: 11, color: "#86efacb3", marginTop: 6 }}>Rad etildi</div>
        </div>
      </div>

      {/* Requests List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "0 8px" }}>
        {priceRequests.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 16px" }}>
            <Tag size={48} style={{ marginBottom: 12, opacity: 0.5, color: "#86efac" }} />
            <div style={{ fontWeight: 600, fontSize: 16, color: "#ffffff" }}>So'rovlar yo'q</div>
            <div style={{ fontSize: 13, color: "#86efacb3", marginTop: 6 }}>
              Buyurtma yaratishda narx so'rovlari qo'shiladi
            </div>
          </div>
        ) : (
          priceRequests.map((req) => {
            const cfg = STATUS_CONFIG[req.status];
            const Icon = cfg.icon;
            const discount = req.originalPrice - req.requestedPrice;
            const discountPct = Math.round((discount / req.originalPrice) * 100);

            return (
              <div key={req.id} style={{ ...CARD, padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Tag size={12} color="#86efac" />
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "#86efacb3" }}>{req.id}</span>
                      <span style={{ color: "#86efacb3" }}>·</span>
                      <span style={{ fontSize: 11, color: "#86efacb3" }}>{req.createdAt}</span>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>{req.productName}</div>
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                      borderRadius: 40,
                      padding: "4px 12px",
                      fontSize: 10,
                      fontWeight: 700,
                      color: cfg.color,
                    }}
                  >
                    <Icon size={12} />
                    {cfg.label}
                  </div>
                </div>

                {/* Price comparison */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 20,
                    padding: "14px",
                    marginBottom: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#86efac", marginBottom: 4 }}>Asl narx</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#86efac80", textDecoration: "line-through" }}>
                        {formatCurrency(req.originalPrice)}
                      </div>
                    </div>
                    <TrendingDown size={16} color="#f87171" />
                    <div style={{ flex: 1, textAlign: "right" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#86efac", marginBottom: 4 }}>So'ralgan narx</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#4ade80" }}>
                        {formatCurrency(req.requestedPrice)}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 12,
                      paddingTop: 10,
                      borderTop: "1px solid rgba(34,197,94,0.2)",
                    }}
                  >
                    <span style={{ fontSize: 12, color: "#86efacb3" }}>Chegirma miqdori</span>
                    <Badge
                      style={{
                        background: "rgba(248,113,113,0.15)",
                        color: "#f87171",
                        border: "1px solid rgba(248,113,113,0.4)",
                        borderRadius: 30,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 10px",
                      }}
                    >
                      -{formatCurrency(discount)} ({discountPct}%)
                    </Badge>
                  </div>
                </div>

                {req.reason && (
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: 16,
                      padding: "10px 12px",
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#86efac" }}>Sabab:</span>
                    <span style={{ fontSize: 12, color: "#ffffffcc", flex: 1 }}>{req.reason}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
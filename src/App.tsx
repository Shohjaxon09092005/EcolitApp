import {
  LayoutDashboard,
  PlusCircle,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { DashboardScreen } from "@/screens/DashboardScreen";
import { NewOrderScreen } from "@/screens/NewOrderScreen";
import { OrdersScreen } from "@/screens/OrdersScreen";
// import { PriceRequestsScreen } from "@/screens/PriceRequestsScreen";
import { CustomersScreen } from "@/screens/CustomersScreen";
import { Toaster } from "@/components/ui/sonner";
import { SalaryScreen } from "@/screens/SalaryScreen";
const TABS = [
  { key: "dashboard", icon: LayoutDashboard },
  { key: "orders", icon: ShoppingBag },
  { key: "new-order", icon: PlusCircle },
  { key: "customers", icon: Users },
  // { key: "prices", icon: Tag },
  { key: "salary", icon: Wallet },
];

export default function App() {
  const { activeTab, setActiveTab, cart, priceRequests } = useStore();

  const pendingPriceRequests = priceRequests.filter(
    (r) => r.status === "kutilmoqda",
  ).length;

  return (
    <div
      className="min-h-svh flex flex-col"
      style={{
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
        // === YANGILANGAN PREMIUM TO'Q FON (Tepa va pasti qora-yashil) ===
        background: "linear-gradient(145deg, #f8fafc 0%, #eef2ff 100%)",
        overflow: "hidden",
      }}
    >
      {/* CSS Animatsiyalar uchun Style tegi */}
      <style>{`
        @keyframes pulseGlow {
          0% {
            transform: translate(-50%, -50%) scale(0.85);
            opacity: 0.4;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.85);
            opacity: 0.4;
          }
        }
        .moving-ball {
          animation: pulseGlow 8s infinite ease-in-out;
        }
      `}</style>

      {/* Aurora/Glow overlay effects */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          maxWidth: 480,
          margin: "0 auto",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {/* === O'RTADA O'YNAB TURUVCHI YUMALOQ SHAKL === */}
        <div
          className="moving-ball"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.18) 0%, rgba(0,153,34,0.03) 60%, transparent 80%)",
            filter: "blur(30px)",
          }}
        />

        {/* Tepa-chap aurora (sal xiralashtirildi, fonga moslash uchun) */}
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        {/* Tepa-o'ng glow */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: -80,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 65%)",
            filter: "blur(35px)",
          }}
        />
      </div>

      {/* Main content */}
      <div
        className="flex-1 overflow-y-auto px-4 pt-4 pb-28"
        style={{ position: "relative", zIndex: 1 }}
      >
        {activeTab === "dashboard" && <DashboardScreen />}
        {activeTab === "new-order" && <NewOrderScreen />}
        {activeTab === "orders" && <OrdersScreen />}
        {activeTab === "customers" && <CustomersScreen />}
        {/* {activeTab === "prices" && <PriceRequestsScreen />} */}
        {activeTab === "salary" && <SalaryScreen />}
      </div>

      {/* Floating Glassmorphism Bottom Nav */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        style={{ width: "calc(100% - 32px)", maxWidth: 440 }}
      >
        {/* Nav outer glow */}
        <div
          style={{
            position: "absolute",
            inset: -2,
            borderRadius: 9999,
            background:
              "linear-gradient(90deg, transparent, rgba(34,197,94,0.12), transparent)",
            filter: "blur(8px)",
            pointerEvents: "none",
          }}
        />
        <div
          className="flex items-center justify-between px-5"
          style={{
            background: "rgba(4, 20, 10, 0.75)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            borderRadius: 9999,
            border: "1px solid rgba(34,197,94,0.18)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,197,94,0.08), inset 0 1px 0 rgba(34,197,94,0.1)",
            height: 64,
            position: "relative",
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isCenter = tab.key === "new-order";
            const isActive = activeTab === tab.key;
            const badgeCount =
              tab.key === "orders"
                ? cart.length
                : tab.key === "prices"
                  ? pendingPriceRequests
                  : 0;

            if (isCenter) {
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    background: "linear-gradient(145deg, #22c55e, #16a34a)",
                    color: "#fff",
                    border: "1px solid rgba(74,222,128,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    cursor: "pointer",
                    boxShadow:
                      "0 0 20px rgba(34,197,94,0.5), 0 0 40px rgba(34,197,94,0.2), 0 4px 16px rgba(0,0,0,0.4)",
                    transition:
                      "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.12)";
                    e.currentTarget.style.boxShadow =
                      "0 0 28px rgba(34,197,94,0.65), 0 0 56px rgba(34,197,94,0.3), 0 6px 20px rgba(0,0,0,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 0 20px rgba(34,197,94,0.5), 0 0 40px rgba(34,197,94,0.2), 0 4px 16px rgba(0,0,0,0.4)";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.94)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "scale(1.08)";
                  }}
                >
                  <Icon style={{ width: 24, height: 24 }} />
                </button>
              );
            }

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: isActive ? "1px solid rgba(34,197,94,0.3)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  cursor: "pointer",
                  background: isActive ? "rgba(34,197,94,0.12)" : "transparent",
                  color: isActive ? "#4ade80" : "rgba(255,255,255,0.35)",
                  boxShadow: isActive
                    ? "0 0 12px rgba(34,197,94,0.15)"
                    : "none",
                  transition:
                    "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(34,197,94,0.08)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }
                  e.currentTarget.style.transform =
                    "scale(1.18) translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                  }
                  e.currentTarget.style.transform = "scale(1) translateY(0)";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.9) translateY(0)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform =
                    "scale(1.1) translateY(-2px)";
                }}
              >
                <Icon style={{ width: 20, height: 20 }} />
                {badgeCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#ef4444",
                      color: "white",
                      fontSize: 9,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1.5px solid rgba(4,20,10,0.8)",
                      boxShadow: "0 0 6px rgba(239,68,68,0.4)",
                    }}
                  >
                    {badgeCount}
                  </span>
                )}
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 3,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: "#4ade80",
                      boxShadow: "0 0 6px #4ade80",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Toaster position="top-center" richColors />
    </div>
  );
}

import { LayoutDashboard, PlusCircle, ShoppingBag, Tag, Users, Settings2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { DashboardScreen } from "@/screens/DashboardScreen"
import { NewOrderScreen } from "@/screens/NewOrderScreen"
import { OrdersScreen } from "@/screens/OrdersScreen"
import { PriceRequestsScreen } from "@/screens/PriceRequestsScreen"
import { CustomersScreen } from "@/screens/CustomersScreen"
import { Toaster } from "@/components/ui/sonner"

const TABS = [
  { key: "dashboard", icon: LayoutDashboard },
  { key: "orders", icon: ShoppingBag },
  { key: "new-order", icon: PlusCircle },
  { key: "customers", icon: Users },      // New Customers tab
  { key: "prices", icon: Tag },
  // { key: "settings", icon: Settings2 },
]

export default function App() {
  const { activeTab, setActiveTab, cart, priceRequests } = useStore()

  const pendingPriceRequests = priceRequests.filter(
    (r) => r.status === "kutilmoqda"
  ).length

  return (
    <div
      className="min-h-svh flex flex-col"
      style={{
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
        background:
          "linear-gradient(135deg, rgba(173,216,230,0.4) 0%, rgba(147,112,219,0.4) 100%)",
      }}
    >
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
        {activeTab === "dashboard" && <DashboardScreen />}
        {activeTab === "new-order" && <NewOrderScreen />}
        {activeTab === "orders" && <OrdersScreen />}
        {activeTab === "customers" && <CustomersScreen />}
        {activeTab === "prices" && <PriceRequestsScreen />}
      </div>

      {/* Floating Glassmorphism Bottom Nav */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        style={{ width: "calc(100% - 32px)", maxWidth: 440 }}
      >
        <div
          className="flex items-center justify-between px-5"
          style={{
            background: "rgba(30, 30, 35, 0.55)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderRadius: 9999,
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.1)",
            height: 64,
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isCenter = tab.key === "new-order"
            const isActive = activeTab === tab.key
            const badgeCount =
              tab.key === "orders"
                ? cart.length
                : tab.key === "prices"
                ? pendingPriceRequests
                : 0

            if (isCenter) {
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "linear-gradient(145deg, #34d058, #22c55e)",
                    color: "white",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    cursor: "pointer",
                    boxShadow:
                      "0 0 0 3px rgba(34,197,94,0.25), 0 4px 16px rgba(34,197,94,0.45)",
                    transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.12)"
                    e.currentTarget.style.boxShadow =
                      "0 0 0 5px rgba(34,197,94,0.3), 0 6px 20px rgba(34,197,94,0.55)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)"
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(34,197,94,0.25), 0 4px 16px rgba(34,197,94,0.45)"
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.94)"
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "scale(1.08)"
                  }}
                >
                  <Icon style={{ width: 24, height: 24 }} />
                </button>
              )
            }

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  cursor: "pointer",
                  background: isActive
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                  color: isActive
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.45)",
                  transition:
                    "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease, color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)"
                    e.currentTarget.style.color = "rgba(255,255,255,0.8)"
                  }
                  e.currentTarget.style.transform = "scale(1.18) translateY(-2px)"
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.color = "rgba(255,255,255,0.45)"
                  }
                  e.currentTarget.style.transform = "scale(1) translateY(0)"
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.9) translateY(0)"
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1.1) translateY(-2px)"
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
                      border: "1.5px solid rgba(30,30,35,0.6)",
                    }}
                  >
                    {badgeCount}
                  </span>
                )}
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 2,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: "#22c55e",
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <Toaster position="top-center" richColors />
    </div>
  )
}
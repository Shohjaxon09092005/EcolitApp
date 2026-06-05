// src/screens/CustomersScreen.tsx
import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Building2,
  MapPin,
  FileText,
  AlertTriangle,
  TrendingUp,
//   ChevronRight,
  X,
  UserPlus,
  DollarSign,
} from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStore, formatCurrency, type Partner } from "@/lib/store";

// --------------------------------------------------------------
// Dizayn tokenlari (dashboard bilan bir xil)
// --------------------------------------------------------------
const CARD = {
  background: "rgba(9, 25, 13, 0.7)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(34, 197, 94, 0.25)",
  borderRadius: 24,
  boxShadow:
    "0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
} as const;

const INPUT_STYLE = {
  width: "100%",
  padding: "10px 26px",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(34, 197, 94, 0.4)",
  borderRadius: 28,
  fontSize: 14,
  color: "#ffffff",
  outline: "none",
  transition: "all 0.2s",
};

const BUTTON_PRIMARY = {
  background: "#22c55e",
  border: "none",
  borderRadius: 40,
  padding: "10px 16px",
  fontWeight: 700,
  color: "#000000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  cursor: "pointer",
};

const BUTTON_SECONDARY = {
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(34, 197, 94, 0.4)",
  borderRadius: 40,
  padding: "10px 16px",
  fontWeight: 600,
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  cursor: "pointer",
};

// --------------------------------------------------------------
// Asosiy komponent
// --------------------------------------------------------------
export function CustomersScreen() {
  const { partners, addPartner } = useStore();
  const [search, setSearch] = useState("");
  const [filterDebtors, setFilterDebtors] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Partner | null>(
    null,
  );
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    address: "",
    note: "",
  });
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    phone?: string;
  }>({});

  const totalCustomers = partners.length;
  const debtors = partners.filter((p) => p.debtAmount > 0);
  const totalDebt = debtors.reduce((sum, p) => sum + p.debtAmount, 0);

  const filtered = partners.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search);
    const matchesDebtor = !filterDebtors || p.debtAmount > 0;
    return matchesSearch && matchesDebtor;
  });

  function formatCompactCurrency(amount: number): string {
    if (amount >= 1_000_000_000)
      return (amount / 1_000_000_000).toFixed(1) + " mlrd so'm";
    if (amount >= 1_000_000)
      return (amount / 1_000_000).toFixed(1) + " mln so'm";
    return formatCurrency(amount);
  }

  function handleCreateCustomer() {
    const errors: { name?: string; phone?: string } = {};
    if (!newCustomer.name.trim()) errors.name = "Ism majburiy";
    if (!newCustomer.phone.trim()) errors.phone = "Telefon majburiy";
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }
    addPartner({
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      company: newCustomer.company,
      address: newCustomer.address,
      note: newCustomer.note,
      debtAmount: 0,
      debtLimit: 0,
    });
    setCreateModalOpen(false);
    setNewCustomer({
      name: "",
      phone: "",
      email: "",
      company: "",
      address: "",
      note: "",
    });
    setFormErrors({});
  }

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
          Mijozlar bazasi
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.5px",
          }}
        >
          Mijozlar
        </h1>
      </div>

      {/* Statistics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          marginBottom: 24,
          padding: "0 8px",
        }}
      >
        {[
          {
            label: "Jami mijozlar",
            value: totalCustomers,
            icon: Users,
            color: "#60a5fa",
            bg: "rgba(96,165,250,0.1)",
          },
          {
            label: "Qarzdorlar",
            value: debtors.length,
            icon: AlertTriangle,
            color: "#fb923c",
            bg: "rgba(251,146,60,0.1)",
          },
          {
            label: "Jami qarz",
            value: formatCompactCurrency(totalDebt),
            icon: DollarSign,
            color: "#f87171",
            bg: "rgba(248,113,113,0.1)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{ ...CARD, padding: "14px 10px", textAlign: "center" }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: stat.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px",
              }}
            >
              <stat.icon size={18} color={stat.color} />
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.1,
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: 11, color: "#86efacb3", marginTop: 6 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter + Add */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 24, padding: "0 8px" }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#86efac80",
            }}
          />
          <input
            placeholder="Ism yoki telefon bo‘yicha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={INPUT_STYLE}
          />
        </div>
        <button
          onClick={() => setFilterDebtors(!filterDebtors)}
          style={{
            ...(filterDebtors ? BUTTON_PRIMARY : BUTTON_SECONDARY),
            padding: "0 18px",
            whiteSpace: "nowrap",
          }}
        >
          <AlertTriangle size={16} />
          Qarzdorlar
        </button>
        <button
          onClick={() => setCreateModalOpen(true)}
          style={{
            ...BUTTON_PRIMARY,
            width: 44,
            height: 44,
            padding: 0,
            justifyContent: "center",
          }}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Customers List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: "0 8px",
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 16px" }}>
            <Users
              size={48}
              style={{ marginBottom: 12, opacity: 0.5, color: "#86efac" }}
            />
            <div style={{ fontWeight: 600, fontSize: 16, color: "#ffffff" }}>
              Mijoz topilmadi
            </div>
            <div style={{ fontSize: 13, color: "#86efacb3", marginTop: 6 }}>
              Yangi mijoz qo‘shish uchun + tugmasini bosing
            </div>
          </div>
        ) : (
          filtered.map((customer, idx) => (
            <button
              key={customer.id}
              onClick={() => setSelectedCustomer(customer)}
              style={{
                ...CARD,
                padding: "16px",
                textAlign: "left",
                width: "100%",
                transition: "transform 0.1s",
                animation: `fadeInUp 0.3s ease ${idx * 0.05}s both`,
              }}
              className="active:scale-[0.98]"
            >
              <style>
                {`
                  @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}
              </style>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "rgba(74,222,128,0.15)",
                        border: "1px solid rgba(74,222,128,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#4ade80",
                        }}
                      >
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 16,
                          color: "#ffffff",
                        }}
                      >
                        {customer.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#86efacb3",
                          marginTop: 2,
                        }}
                      >
                        {customer.phone}
                      </div>
                    </div>
                  </div>
                  {customer.email && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        color: "#86efacb3",
                        marginBottom: 4,
                      }}
                    >
                      <Mail size={12} />
                      <span>{customer.email}</span>
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  {customer.debtAmount > 0 ? (
                    <Badge
                      style={{
                        background: "rgba(248,113,113,0.15)",
                        color: "#f87171",
                        border: "1px solid rgba(248,113,113,0.4)",
                        borderRadius: 20,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 10px",
                      }}
                    >
                      Qarz: {formatCurrency(customer.debtAmount)}
                    </Badge>
                  ) : (
                    <Badge
                      style={{
                        background: "rgba(74,222,128,0.15)",
                        color: "#4ade80",
                        border: "1px solid rgba(74,222,128,0.4)",
                        borderRadius: 20,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 10px",
                      }}
                    >
                      To'lovchi
                    </Badge>
                  )}
                  
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Create Customer Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent
          style={{
            background: "rgba(3,14,7,0.98)",
            backdropFilter: "blur(32px)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 32,
            maxWidth: 400,
          }}
          className="[&>button]:hidden"
        >
          <DialogHeader>
            <DialogTitle
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#ffffff",
                fontWeight: 700,
              }}
            >
              <UserPlus size={20} color="#4ade80" />
              Yangi mijoz qo'shish
            </DialogTitle>
          </DialogHeader>
          <div className="[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ marginTop: 16, maxHeight: "70vh", overflowY: "auto", }}>
            <div style={{ marginBottom: 16 }}>
              <Label
                style={{ color: "#86efac", fontSize: 12, fontWeight: 600 }}
              >
                Ism <span style={{ color: "#f87171" }}>*</span>
              </Label>
              <input
                type="text"
                placeholder="To'liq ism yoki kompaniya"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
                style={{
                  ...INPUT_STYLE,
                  marginTop: 6,
                  borderColor: formErrors.name
                    ? "#f87171"
                    : "rgba(34,197,94,0.4)",
                }}
              />
              {formErrors.name && (
                <div style={{ fontSize: 11, color: "#f87171", marginTop: 4 }}>
                  {formErrors.name}
                </div>
              )}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Label
                style={{ color: "#86efac", fontSize: 12, fontWeight: 600 }}
              >
                Telefon <span style={{ color: "#f87171" }}>*</span>
              </Label>
              <input
                type="tel"
                placeholder="+998 90 123 45 67"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
                style={{
                  ...INPUT_STYLE,
                  marginTop: 6,
                  borderColor: formErrors.phone
                    ? "#f87171"
                    : "rgba(34,197,94,0.4)",
                }}
              />
              {formErrors.phone && (
                <div style={{ fontSize: 11, color: "#f87171", marginTop: 4 }}>
                  {formErrors.phone}
                </div>
              )}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Label
                style={{ color: "#86efac", fontSize: 12, fontWeight: 600 }}
              >
                Email
              </Label>
              <input
                type="email"
                placeholder="email@example.com"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
                style={{ ...INPUT_STYLE, marginTop: 6 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Label
                style={{ color: "#86efac", fontSize: 12, fontWeight: 600 }}
              >
                Kompaniya
              </Label>
              <input
                type="text"
                placeholder="Kompaniya nomi"
                value={newCustomer.company}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, company: e.target.value })
                }
                style={{ ...INPUT_STYLE, marginTop: 6 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Label
                style={{ color: "#86efac", fontSize: 12, fontWeight: 600 }}
              >
                Manzil
              </Label>
              <input
                type="text"
                placeholder="Shahar, ko'cha, uy"
                value={newCustomer.address}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, address: e.target.value })
                }
                style={{ ...INPUT_STYLE, marginTop: 6 }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label
                style={{ color: "#86efac", fontSize: 12, fontWeight: 600 }}
              >
                Izoh
              </Label>
              <Textarea
                placeholder="Qo'shimcha ma'lumot..."
                value={newCustomer.note}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, note: e.target.value })
                }
                style={{
                  ...INPUT_STYLE,
                  marginTop: 6,
                  minHeight: 80,
                  borderRadius: 20,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setCreateModalOpen(false)}
                style={{ ...BUTTON_SECONDARY, flex: 1 }}
              >
                Bekor qilish
              </button>
              <button
                onClick={handleCreateCustomer}
                style={{ ...BUTTON_PRIMARY, flex: 1 }}
              >
                Saqlash
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <CustomerDetailDrawer
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}

// --------------------------------------------------------------
// Customer Detail Drawer (to‘liq qayta stilizatsiya)
// --------------------------------------------------------------
function CustomerDetailDrawer({
  customer,
  onClose,
}: {
  customer: Partner;
  onClose: () => void;
}) {
  const { orders } = useStore();
  const customerOrders = orders.filter((o) => o.partnerId === customer.id);
  const totalSpent = customerOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const lastOrder = customerOrders.sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )[0];

  return (
    <Drawer open onClose={onClose}>
      <DrawerContent
        style={{
          background: "rgba(3,14,7,0.98)",
          backdropFilter: "blur(32px)",
          borderTop: "1px solid rgba(34,197,94,0.3)",
          borderRadius: "32px 32px 0 0",
        }}
        className="[&>div]:bg-transparent"
      >
        <DrawerHeader
          style={{
            padding: "20px 20px 12px",
            borderBottom: "1px solid rgba(34,197,94,0.2)",
            position: "relative",
          }}
        >
          <DrawerTitle
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 4,
                  height: 24,
                  borderRadius: 2,
                  background: "#4ade80",
                }}
              />
              <span style={{ fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
                {customer.name}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={16} color="#86efac" />
            </button>
          </DrawerTitle>
        </DrawerHeader>

        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Contact Info */}
          <div style={{ ...CARD, padding: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Phone size={14} color="#86efac" />
              <span style={{ color: "#ffffff" }}>{customer.phone}</span>
            </div>
            {customer.email && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <Mail size={14} color="#86efac" />
                <span style={{ color: "#ffffff" }}>{customer.email}</span>
              </div>
            )}
            {customer.company && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <Building2 size={14} color="#86efac" />
                <span style={{ color: "#ffffff" }}>{customer.company}</span>
              </div>
            )}
            {customer.address && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <MapPin size={14} color="#86efac" />
                <span style={{ color: "#ffffff", flex: 1 }}>
                  {customer.address}
                </span>
              </div>
            )}
            {customer.note && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  marginTop: 8,
                  paddingTop: 8,
                  borderTop: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                <FileText size={14} color="#86efac" />
                <span style={{ color: "#ffffffcc", flex: 1 }}>
                  {customer.note}
                </span>
              </div>
            )}
          </div>

          {/* Financial Stats */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div style={{ ...CARD, padding: "12px", textAlign: "center" }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#86efac",
                  marginBottom: 6,
                }}
              >
                Qarzi
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#f87171" }}>
                {formatCurrency(customer.debtAmount)}
              </div>
            </div>
            <div style={{ ...CARD, padding: "12px", textAlign: "center" }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#86efac",
                  marginBottom: 6,
                }}
              >
                Umumiy xarid
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#4ade80" }}>
                {formatCurrency(totalSpent)}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          {customerOrders.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: "#86efac",
                  marginBottom: 12,
                }}
              >
                So'nggi buyurtmalar
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {customerOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    style={{
                      ...CARD,
                      padding: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          fontFamily: "monospace",
                          color: "#86efac",
                        }}
                      >
                        {order.id}
                      </div>
                      <div style={{ fontSize: 10, color: "#86efacb3" }}>
                        {order.createdAt}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#4ade80",
                        }}
                      >
                        {formatCurrency(order.totalAmount)}
                      </div>
                      <Badge
                        style={{
                          background:
                            order.status === "yetkazildi"
                              ? "rgba(74,222,128,0.15)"
                              : "rgba(251,146,60,0.15)",
                          color:
                            order.status === "yetkazildi"
                              ? "#4ade80"
                              : "#fb923c",
                          border: "1px solid currentColor",
                          fontSize: 9,
                          padding: "2px 8px",
                          borderRadius: 20,
                        }}
                      >
                        {order.status === "yetkazildi"
                          ? "Yetkazildi"
                          : "Jarayonda"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lastOrder && (
            <div
              style={{
                ...CARD,
                padding: "14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: "#86efacb3" }}>
                  Oxirgi buyurtma
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: "#ffffff" }}
                >
                  {lastOrder.createdAt}
                </div>
              </div>
              <TrendingUp size={20} color="#4ade80" />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

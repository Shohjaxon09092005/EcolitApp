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
  X,
  UserPlus,
  DollarSign,
} from "lucide-react";
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
// Light / Emerald / 3D design tokens (matching Dashboard)
// --------------------------------------------------------------
const CARD = {
  background: "rgba(255, 255, 255, 0.92)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "2px solid #10b981",
  borderRadius: 28,
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255,255,255,0.9)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
} as const;

const CARD_3D_HOVER = {
  transform: "translateY(-4px) scale(1.01)",
  boxShadow: "0 20px 35px -10px rgba(16, 185, 129, 0.25), 0 0 0 2px #10b981",
};

const INPUT_STYLE = {
  width: "100%",
  padding: "10px 25px",
  background: "#ffffff",
  border: "2px solid #10b981",
  borderRadius: 32,
  fontSize: 14,
  color: "#0f172a",
  outline: "none",
  transition: "all 0.2s",
} as const;

const BUTTON_PRIMARY = {
  background: "#10b981",
  border: "none",
  borderRadius: 40,
  padding: "10px 16px",
  fontWeight: 700,
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  cursor: "pointer",
  transition: "all 0.2s",
} as const;

const BUTTON_SECONDARY = {
  background: "rgba(255, 255, 255, 0.6)",
  backdropFilter: "blur(8px)",
  border: "2px solid #10b981",
  borderRadius: 40,
  padding: "10px 16px",
  fontWeight: 600,
  color: "#0f172a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  cursor: "pointer",
  transition: "all 0.2s",
} as const;

const LABEL_STYLE = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#10b981",
};

// --------------------------------------------------------------
// Main Component
// --------------------------------------------------------------
export function CustomersScreen() {
  const { partners, addPartner } = useStore();
  const [search, setSearch] = useState("");
  const [filterDebtors, setFilterDebtors] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Partner | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    address: "",
    note: "",
  });
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({});

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
    if (amount >= 1_000_000_000) return (amount / 1_000_000_000).toFixed(1) + " mlrd so'm";
    if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(1) + " mln so'm";
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
      email: newCustomer.email || undefined,
      company: newCustomer.company || undefined,
      address: newCustomer.address || '',
      note: newCustomer.note || undefined,
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
        <div style={{ ...LABEL_STYLE, marginBottom: 6, fontSize: 12 }}>
          Mijozlar bazasi
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#0f172a",
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
            color: "#3b82f6",
            bg: "rgba(59,130,246,0.1)",
          },
          {
            label: "Qarzdorlar",
            value: debtors.length,
            icon: AlertTriangle,
            color: "#f97316",
            bg: "rgba(249,115,22,0.1)",
          },
          {
            label: "Jami qarz",
            value: formatCompactCurrency(totalDebt),
            icon: DollarSign,
            color: "#ef4444",
            bg: "rgba(239,68,68,0.1)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{ ...CARD, padding: "14px 10px", textAlign: "center" }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, CARD_3D_HOVER)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = CARD.boxShadow;
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 16,
                background: stat.bg,
                border: `1px solid ${stat.color}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}
            >
              <stat.icon size={20} color={stat.color} />
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.1,
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter + Add */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, padding: "0 8px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#10b981",
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
      <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "0 8px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 16px" }}>
            <Users size={48} style={{ marginBottom: 12, opacity: 0.5, color: "#10b981" }} />
            <div style={{ fontWeight: 600, fontSize: 16, color: "#0f172a" }}>
              Mijoz topilmadi
            </div>
            <div style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>
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
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, CARD_3D_HOVER)}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = CARD.boxShadow;
              }}
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
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "#f1f5f9",
                        border: "2px solid #10b981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#10b981",
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
                          color: "#0f172a",
                        }}
                      >
                        {customer.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#475569",
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
                        color: "#475569",
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
                        background: "#fee2e2",
                        color: "#ef4444",
                        border: "1px solid #ef4444",
                        borderRadius: 30,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "4px 12px",
                      }}
                    >
                      Qarz: {formatCurrency(customer.debtAmount)}
                    </Badge>
                  ) : (
                    <Badge
                      style={{
                        background: "#d1fae5",
                        color: "#10b981",
                        border: "1px solid #10b981",
                        borderRadius: 30,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "4px 12px",
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
            background: "#ffffff",
            border: "2px solid #10b981",
            borderRadius: 32,
            maxWidth: 400,
            boxShadow: "0 20px 35px -10px rgba(0,0,0,0.15)",
          }}
          className="[&>button]:hidden"
        >
          <DialogHeader>
            <DialogTitle
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#0f172a",
                fontWeight: 700,
              }}
            >
              <UserPlus size={20} color="#10b981" />
              Yangi mijoz qo'shish
            </DialogTitle>
          </DialogHeader>
          <div
            style={{
              marginTop: 16,
              maxHeight: "70vh",
              overflowY: "auto",
            }}
            className="[&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
          >
            <div style={{ marginBottom: 16 }}>
              <Label style={{ color: "#10b981", fontSize: 12, fontWeight: 600 }}>
                Ism <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <input
                type="text"
                placeholder="To'liq ism yoki kompaniya"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                style={{
                  ...INPUT_STYLE,
                  marginTop: 6,
                  borderColor: formErrors.name ? "#ef4444" : "#10b981",
                }}
              />
              {formErrors.name && (
                <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>
                  {formErrors.name}
                </div>
              )}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Label style={{ color: "#10b981", fontSize: 12, fontWeight: 600 }}>
                Telefon <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <input
                type="tel"
                placeholder="+998 90 123 45 67"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                style={{
                  ...INPUT_STYLE,
                  marginTop: 6,
                  borderColor: formErrors.phone ? "#ef4444" : "#10b981",
                }}
              />
              {formErrors.phone && (
                <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>
                  {formErrors.phone}
                </div>
              )}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Label style={{ color: "#10b981", fontSize: 12, fontWeight: 600 }}>Email</Label>
              <input
                type="email"
                placeholder="email@example.com"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                style={{ ...INPUT_STYLE, marginTop: 6 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Label style={{ color: "#10b981", fontSize: 12, fontWeight: 600 }}>Kompaniya</Label>
              <input
                type="text"
                placeholder="Kompaniya nomi"
                value={newCustomer.company}
                onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                style={{ ...INPUT_STYLE, marginTop: 6 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Label style={{ color: "#10b981", fontSize: 12, fontWeight: 600 }}>Manzil</Label>
              <input
                type="text"
                placeholder="Shahar, ko'cha, uy"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                style={{ ...INPUT_STYLE, marginTop: 6 }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <Label style={{ color: "#10b981", fontSize: 12, fontWeight: 600 }}>Izoh</Label>
              <Textarea
                placeholder="Qo'shimcha ma'lumot..."
                value={newCustomer.note}
                onChange={(e) => setNewCustomer({ ...newCustomer, note: e.target.value })}
                style={{
                  ...INPUT_STYLE,
                  marginTop: 6,
                  minHeight: 80,
                  borderRadius: 24,
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
              <button onClick={handleCreateCustomer} style={{ ...BUTTON_PRIMARY, flex: 1 }}>
                Saqlash
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <CustomerDetailDrawer customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}
    </div>
  );
}

// --------------------------------------------------------------
// Customer Detail Drawer (Light / Emerald)
// --------------------------------------------------------------
function CustomerDetailDrawer({ customer, onClose }: { customer: Partner; onClose: () => void }) {
  const { orders } = useStore();
  const customerOrders = orders.filter((o) => o.partnerId === customer.id);
  const totalSpent = customerOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const lastOrder = customerOrders.sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  return (
    <Drawer open onClose={onClose}>
      <DrawerContent
        style={{
          background: "#ffffff",
          borderTop: "2px solid #10b981",
          borderRadius: "32px 32px 0 0",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <DrawerHeader
          style={{
            padding: "20px 20px 12px",
            borderBottom: "1px solid rgba(16,185,129,0.2)",
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
              <div style={{ width: 5, height: 28, borderRadius: 4, background: "#10b981" }} />
              <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                {customer.name}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "#f1f5f9",
                border: "2px solid #10b981",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={16} color="#0f172a" />
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
          <div
            style={{
              ...CARD,
              padding: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Phone size={14} color="#10b981" />
              <span style={{ color: "#0f172a" }}>{customer.phone}</span>
            </div>
            {customer.email && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Mail size={14} color="#10b981" />
                <span style={{ color: "#0f172a" }}>{customer.email}</span>
              </div>
            )}
            {customer.company && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Building2 size={14} color="#10b981" />
                <span style={{ color: "#0f172a" }}>{customer.company}</span>
              </div>
            )}
            {customer.address && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <MapPin size={14} color="#10b981" />
                <span style={{ color: "#0f172a", flex: 1 }}>{customer.address}</span>
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
                  borderTop: "1px solid rgba(16,185,129,0.2)",
                }}
              >
                <FileText size={14} color="#10b981" />
                <span style={{ color: "#475569", flex: 1 }}>{customer.note}</span>
              </div>
            )}
          </div>

          {/* Financial Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ ...CARD, padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#10b981", marginBottom: 6 }}>
                Qarzi
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#ef4444" }}>
                {formatCurrency(customer.debtAmount)}
              </div>
            </div>
            <div style={{ ...CARD, padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#10b981", marginBottom: 6 }}>
                Umumiy xarid
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#10b981" }}>
                {formatCurrency(totalSpent)}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          {customerOrders.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#10b981", marginBottom: 12 }}>
                So'nggi buyurtmalar
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
                          color: "#10b981",
                        }}
                      >
                        {order.id}
                      </div>
                      <div style={{ fontSize: 10, color: "#475569" }}>{order.createdAt}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                        {formatCurrency(order.totalAmount)}
                      </div>
                      <Badge
                        style={{
                          background: order.status === "yetkazildi" ? "#d1fae5" : "#fed7aa",
                          color: order.status === "yetkazildi" ? "#10b981" : "#f97316",
                          border: "1px solid currentColor",
                          fontSize: 9,
                          padding: "2px 8px",
                          borderRadius: 20,
                        }}
                      >
                        {order.status === "yetkazildi" ? "Yetkazildi" : "Jarayonda"}
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
                <div style={{ fontSize: 11, color: "#475569" }}>Oxirgi buyurtma</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                  {lastOrder.createdAt}
                </div>
              </div>
              <TrendingUp size={20} color="#10b981" />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
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
  ChevronRight,
  X,
  CheckCircle,
  UserPlus,
  DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStore, formatCurrency, type Partner } from "@/lib/store";

// Glassmorphism base class
const glassCardClass =
  "bg-white/60 backdrop-blur-2xl border-white/50 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] rounded-[28px] overflow-hidden border";

// Animation classes
const fadeInClass = "animate-in fade-in duration-500";
const scaleInClass = "animate-in zoom-in-95 duration-300";

export function CustomersScreen() {
  const { partners, addPartner } = useStore();
  const [search, setSearch] = useState("");
  const [filterDebtors, setFilterDebtors] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Partner | null>(
    null,
  );
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New customer form state
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

  // Statistics
  const totalCustomers = partners.length;
  const debtors = partners.filter((p) => p.debtAmount > 0);
  const totalDebt = debtors.reduce((sum, p) => sum + p.debtAmount, 0);
  const avgDebt = totalCustomers ? totalDebt / totalCustomers : 0;

  // Filter customers
  const filtered = partners.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search);
    const matchesDebtor = !filterDebtors || p.debtAmount > 0;
    return matchesSearch && matchesDebtor;
  });

  function handleCreateCustomer() {
    // Validation
    const errors: { name?: string; phone?: string } = {};
    if (!newCustomer.name.trim()) errors.name = "Ism majburiy";
    if (!newCustomer.phone.trim()) errors.phone = "Telefon majburiy";
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }
    // Add partner (using existing store method)
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
  function formatCompactCurrency(amount: number): string {
    if (amount >= 1_000_000_000) {
      return (amount / 1_000_000_000).toFixed(1) + " mlrd so'm";
    }
    if (amount >= 1_000_000) {
      return (amount / 1_000_000).toFixed(1) + " mln so'm";
    }
    return formatCurrency(amount);
  }
  return (
    <div className="flex flex-col h-full pb-28 px-1 pt-4 max-w-md mx-auto">
      {/* Header with animation */}
      <div className={`mb-4 px-2 ${fadeInClass}`}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5 text-slate-500">
          Mijozlar bazasi
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Mijozlar</h1>
      </div>

      {/* Statistics Cards with hover animation */}
      <div className="grid grid-cols-3 gap-3 mb-5 px-2">
        {[
          {
            label: "Jami mijozlar",
            value: totalCustomers,
            icon: Users,
            color: "#6366f1",
            bg: "bg-indigo-100/70",
            delay: 0,
          },
          {
            label: "Qarzdorlar",
            value: debtors.length,
            icon: AlertTriangle,
            color: "#f59e0b",
            bg: "bg-amber-100/70",
            delay: 100,
          },
          {
            label: "Jami qarz",
            value: formatCompactCurrency(totalDebt),
            icon: DollarSign,
            color: "#ef4444",
            bg: "bg-red-100/70",
            delay: 200,
          },
        ].map((stat, idx) => (
          <Card
            key={stat.label}
            className={`${glassCardClass} p-4 transition-all hover:scale-105 hover:shadow-xl ${scaleInClass}`}
            style={{ animationDelay: `${stat.delay}ms` }}
          >
            <div
              className={`w-10 h-10 rounded-[14px] ${stat.bg} flex items-center justify-center mb-3 shadow-sm`}
            >
              <stat.icon style={{ width: 18, height: 18, color: stat.color }} />
            </div>
            <p className="text-lg font-black text-slate-900 leading-tight break-words">
              {stat.value}
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1.5">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      {/* Search + Filter + Add Button */}
      <div className="flex gap-2 mb-4 px-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            placeholder="Ism yoki telefon bo‘yicha..."
            className="w-full h-11 pl-9 pr-4 text-sm rounded-2xl outline-none transition-all bg-white/60 backdrop-blur-2xl border-white/50 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.05)] text-slate-800 placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant={filterDebtors ? "default" : "outline"}
          className={`h-11 px-4 rounded-2xl gap-2 transition-all ${
            filterDebtors
              ? "bg-indigo-500 text-white shadow-md"
              : "bg-white/60 backdrop-blur-2xl border-white/50 text-slate-600"
          }`}
          onClick={() => setFilterDebtors(!filterDebtors)}
        >
          <AlertTriangle className="h-4 w-4" />
          Qarzdorlar
        </Button>
        <Button
          className="h-11 w-11 rounded-2xl bg-indigo-500 text-white shadow-md hover:bg-indigo-600 transition-all active:scale-95"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Customers List */}
      <div className="space-y-3 px-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/60 backdrop-blur-2xl border-white/50 flex items-center justify-center mb-5 shadow-sm">
              <Users className="h-10 w-10 text-slate-400" />
            </div>
            <p className="font-bold text-slate-700">Mijoz topilmadi</p>
            <p className="text-sm text-slate-500 mt-1">
              Yangi mijoz qo'shish uchun + tugmasini bosing
            </p>
          </div>
        ) : (
          filtered.map((customer, idx) => (
            <button
              key={customer.id}
              className="w-full text-left transition-all active:scale-[0.98] animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${idx * 50}ms` }}
              onClick={() => setSelectedCustomer(customer)}
            >
              <Card className={`${glassCardClass} relative overflow-hidden`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-bold text-sm">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-base font-bold text-slate-900 truncate">
                          {customer.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Phone className="h-3 w-3" />
                        <span>{customer.phone}</span>
                      </div>
                      {customer.email && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {customer.debtAmount > 0 ? (
                        <Badge className="bg-red-100 text-red-700 border-red-200 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                          Qarz: {formatCurrency(customer.debtAmount)}
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700 border-green-200 rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                          To'lovchi
                        </Badge>
                      )}
                      <ChevronRight className="h-4 w-4 text-slate-400 mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))
        )}
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <CustomerDetailDrawer
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {/* Create Customer Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-sm mx-auto rounded-3xl bg-white/80 backdrop-blur-3xl border-white/60 shadow-2xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-5 pb-2 bg-white/40">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <UserPlus className="h-5 w-5 text-indigo-500" />
              Yangi mijoz qo'shish
            </DialogTitle>
          </DialogHeader>
          <div className="p-5 pt-3 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Name */}
            <div>
              <Label className="text-xs font-bold text-slate-700">
                Ism <span className="text-red-500">*</span>
              </Label>
              <input
                type="text"
                placeholder="To'liq ism yoki kompaniya"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
                className={`w-full h-11 px-4 text-sm rounded-2xl outline-none bg-white/60 backdrop-blur border-white/50 text-slate-800 mt-1.5 ${
                  formErrors.name ? "border-red-400 ring-1 ring-red-400" : ""
                }`}
              />
              {formErrors.name && (
                <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label className="text-xs font-bold text-slate-700">
                Telefon <span className="text-red-500">*</span>
              </Label>
              <input
                type="tel"
                placeholder="+998 90 123 45 67"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
                className={`w-full h-11 px-4 text-sm rounded-2xl outline-none bg-white/60 backdrop-blur border-white/50 text-slate-800 mt-1.5 ${
                  formErrors.phone ? "border-red-400 ring-1 ring-red-400" : ""
                }`}
              />
              {formErrors.phone && (
                <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label className="text-xs font-bold text-slate-700">Email</Label>
              <input
                type="email"
                placeholder="email@example.com"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
                className="w-full h-11 px-4 text-sm rounded-2xl outline-none bg-white/60 backdrop-blur border-white/50 text-slate-800 mt-1.5"
              />
            </div>

            {/* Company */}
            <div>
              <Label className="text-xs font-bold text-slate-700">
                Kompaniya
              </Label>
              <input
                type="text"
                placeholder="Kompaniya nomi"
                value={newCustomer.company}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, company: e.target.value })
                }
                className="w-full h-11 px-4 text-sm rounded-2xl outline-none bg-white/60 backdrop-blur border-white/50 text-slate-800 mt-1.5"
              />
            </div>

            {/* Address */}
            <div>
              <Label className="text-xs font-bold text-slate-700">Manzil</Label>
              <input
                type="text"
                placeholder="Shahar, ko'cha, uy"
                value={newCustomer.address}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, address: e.target.value })
                }
                className="w-full h-11 px-4 text-sm rounded-2xl outline-none bg-white/60 backdrop-blur border-white/50 text-slate-800 mt-1.5"
              />
            </div>

            {/* Note */}
            <div>
              <Label className="text-xs font-bold text-slate-700">Izoh</Label>
              <Textarea
                placeholder="Qo'shimcha ma'lumot..."
                value={newCustomer.note}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, note: e.target.value })
                }
                className="resize-none rounded-2xl bg-white/60 backdrop-blur border-white/50 mt-1.5"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-3">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-2xl bg-white/40 border-white/50 text-slate-700"
                onClick={() => setCreateModalOpen(false)}
              >
                Bekor qilish
              </Button>
              <Button
                className="flex-1 h-11 rounded-2xl font-bold bg-indigo-500 hover:bg-indigo-600"
                onClick={handleCreateCustomer}
              >
                Saqlash
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Customer Detail Drawer Component
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
      <DrawerContent className="max-h-[92vh] bg-white/80 backdrop-blur-3xl border-t border-white/60 shadow-2xl rounded-t-[32px]">
        <DrawerHeader className="pb-2 pt-6 px-5">
          <DrawerTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 rounded-full bg-indigo-500" />
              <span className="text-lg font-bold text-slate-900">
                {customer.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full bg-white/40"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-5 pb-8 overflow-y-auto space-y-5">
          {/* Contact Info Card */}
          <div
            className={`bg-white/40 backdrop-blur rounded-2xl p-4 space-y-2`}
          >
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-slate-500" />
              <span className="text-slate-700">{customer.phone}</span>
            </div>
            {customer.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="text-slate-700">{customer.email}</span>
              </div>
            )}
            {customer.company && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-slate-500" />
                <span className="text-slate-700">{customer.company}</span>
              </div>
            )}
            {customer.address && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                <span className="text-slate-700 flex-1">
                  {customer.address}
                </span>
              </div>
            )}
            {customer.note && (
              <div className="flex items-start gap-2 text-sm mt-2 pt-2 border-t border-white/30">
                <FileText className="h-4 w-4 text-slate-500 mt-0.5" />
                <span className="text-slate-700 flex-1">{customer.note}</span>
              </div>
            )}
          </div>

          {/* Financial Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/40 backdrop-blur rounded-2xl p-3 text-center">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">
                Qarzi
              </p>
              <p className="text-lg font-black text-red-600">
                {formatCurrency(customer.debtAmount)}
              </p>
            </div>
            <div className="bg-white/40 backdrop-blur rounded-2xl p-3 text-center">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">
                Umumiy xarid
              </p>
              <p className="text-lg font-black text-indigo-600">
                {formatCurrency(totalSpent)}
              </p>
            </div>
          </div>

          {/* Order History */}
          {customerOrders.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                So'nggi buyurtmalar
              </p>
              {customerOrders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="bg-white/40 backdrop-blur rounded-2xl p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-mono font-semibold text-slate-600">
                      {order.id}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {order.createdAt}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-indigo-600">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <Badge
                      className="text-[9px] px-2 py-0 h-4 rounded-full"
                      style={{
                        background:
                          order.status === "yetkazildi"
                            ? "rgba(34,197,94,0.1)"
                            : "rgba(245,158,11,0.1)",
                        color:
                          order.status === "yetkazildi" ? "#16a34a" : "#d97706",
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
          )}

          {lastOrder && (
            <div className="bg-gradient-to-r from-indigo-50 to-white/40 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500">
                  Oxirgi buyurtma
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {lastOrder.createdAt}
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-indigo-500" />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

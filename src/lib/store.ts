import { create } from "zustand"

export type OrderStatus =
  | "kutilmoqda"
  | "tasdiqlangan"
  | "yuklangan"
  | "yetkazildi"
  | "rad_etildi"
  | "qarz_kutilmoqda"

export type PriceRequestStatus = "kutilmoqda" | "tasdiqlandi" | "rad_etildi"

export type PaymentMethod = "naqd" | "plastik" | "bank" | "qarz"

export interface Partner {
  id: string
  name: string
  phone: string
  address: string
  debtAmount: number
  debtLimit: number
  totalOrders: number
  email?: string
  company?: string
  note?: string
}

export interface Product {
  id: string
  name: string
  unit: string
  price: number
  stock: number
  minStock: number
  category: string
}

export interface CartItem {
  product: Product
  quantity: number
  requestedPrice?: number
  priceRequestStatus?: PriceRequestStatus
}

export interface Order {
  id: string
  partnerId: string
  partnerName: string
  items: CartItem[]
  totalAmount: number
  paidAmount: number
  debtAmount: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  carNumber?: string
  createdAt: string
  dueDate?: string
  note?: string
  invoiceSent: boolean
}

export interface PriceRequest {
  id: string
  orderId?: string
  productId: string
  productName: string
  originalPrice: number
  requestedPrice: number
  status: PriceRequestStatus
  createdAt: string
  reason?: string
}

export interface SalaryInfo {
  baseSalary: number
  kpiBonus: number
  salesBonus: number
  collectionBonus: number
  fines: Fine[]
  month: string
}

export interface Fine {
  id: string
  reason: string
  amount: number
  date: string
}

export interface AppState {
  partners: Partner[]
  products: Product[]
  orders: Order[]
  priceRequests: PriceRequest[]
  salaryInfo: SalaryInfo
  cart: CartItem[]
  selectedPartner: Partner | null
  activeTab: string
  monthlyTarget: number
  monthlyAchieved: number
  monthlyRevenue: number[]

  setActiveTab: (tab: string) => void
  setSelectedPartner: (partner: Partner | null) => void
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  updateCartPrice: (productId: string, price: number) => void
  clearCart: () => void
  addPaymentToOrder: (orderId: string, amount: number, paymentMethod: PaymentMethod) => void
  placeOrder: (
    paymentMethod: PaymentMethod,
    paidAmount: number,
    dueDate?: string,
    note?: string
  ) => Order
  updateOrderStatus: (orderId: string, status: OrderStatus, carNumber?: string) => void
  addPriceRequest: (productId: string, requestedPrice: number, reason?: string) => void
  updatePriceRequestStatus: (id: string, status: PriceRequestStatus) => void
  addPartner: (partner: Omit<Partner, 'id' | 'debtAmount' | 'debtLimit' | 'totalOrders'> & { debtAmount?: number; debtLimit?: number }) => void
}

const initialPartners: Partner[] = [
  {
    id: "p1",
    name: "Alisher Karimov",
    phone: "+998 90 123 45 67",
    address: "Toshkent, Chilonzor tumani",
    debtAmount: 1500000,
    debtLimit: 5000000,
    totalOrders: 24,
  },
  {
    id: "p2",
    name: "Sardor Toshmatov",
    phone: "+998 91 234 56 78",
    address: "Toshkent, Yunusobod tumani",
    debtAmount: 4800000,
    debtLimit: 5000000,
    totalOrders: 18,
  },
  {
    id: "p3",
    name: "Malika Yusupova",
    phone: "+998 93 345 67 89",
    address: "Samarqand shahar",
    debtAmount: 200000,
    debtLimit: 3000000,
    totalOrders: 31,
  },
  {
    id: "p4",
    name: "Bobur Xolmatov",
    phone: "+998 97 456 78 90",
    address: "Namangan, Uychi tumani",
    debtAmount: 6200000,
    debtLimit: 5000000,
    totalOrders: 12,
  },
  {
    id: "p5",
    name: "Nilufar Rahimova",
    phone: "+998 99 567 89 01",
    address: "Buxoro shahar",
    debtAmount: 0,
    debtLimit: 8000000,
    totalOrders: 45,
  },
]

const initialProducts: Product[] = [
  {
    id: "pr1",
    name: "Samsung Galaxy A54",
    unit: "dona",
    price: 4_500_000,
    stock: 12,
    minStock: 5,
    category: "Telefonlar",
  },
  {
    id: "pr2",
    name: "Xiaomi Redmi Note 12",
    unit: "dona",
    price: 2_800_000,
    stock: 3,
    minStock: 5,
    category: "Telefonlar",
  },
  {
    id: "pr3",
    name: "AirPods Pro 2",
    unit: "dona",
    price: 1_900_000,
    stock: 8,
    minStock: 3,
    category: "Aksessuarlar",
  },
  {
    id: "pr4",
    name: "USB-C Kabel 2m",
    unit: "dona",
    price: 45_000,
    stock: 2,
    minStock: 10,
    category: "Aksessuarlar",
  },
  {
    id: "pr5",
    name: "Power Bank 20000mAh",
    unit: "dona",
    price: 320_000,
    stock: 15,
    minStock: 5,
    category: "Aksessuarlar",
  },
  {
    id: "pr6",
    name: "iPhone 15 Pro",
    unit: "dona",
    price: 14_500_000,
    stock: 4,
    minStock: 3,
    category: "Telefonlar",
  },
  {
    id: "pr7",
    name: "Smart Soat Amazfit",
    unit: "dona",
    price: 890_000,
    stock: 1,
    minStock: 4,
    category: "Soatlar",
  },
  {
    id: "pr8",
    name: "Tarmoq Adapter",
    unit: "dona",
    price: 65_000,
    stock: 0,
    minStock: 8,
    category: "Aksessuarlar",
  },
]

const initialOrders: Order[] = [
  {
    id: "ORD-001",
    partnerId: "p1",
    partnerName: "Alisher Karimov",
    items: [
      {
        product: initialProducts[0],
        quantity: 2,
      },
    ],
    totalAmount: 9_000_000,
    paidAmount: 9_000_000,
    debtAmount: 0,
    status: "yetkazildi",
    paymentMethod: "plastik",
    createdAt: "2026-05-28",
    invoiceSent: true,
  },
  {
    id: "ORD-002",
    partnerId: "p2",
    partnerName: "Sardor Toshmatov",
    items: [
      { product: initialProducts[5], quantity: 1 },
      { product: initialProducts[2], quantity: 2 },
    ],
    totalAmount: 18_300_000,
    paidAmount: 13_500_000,
    debtAmount: 4_800_000,
    status: "tasdiqlangan",
    paymentMethod: "qarz",
    createdAt: "2026-06-01",
    dueDate: "2026-06-30",
    invoiceSent: true,
  },
  {
    id: "ORD-003",
    partnerId: "p3",
    partnerName: "Malika Yusupova",
    items: [{ product: initialProducts[1], quantity: 3 }],
    totalAmount: 8_400_000,
    paidAmount: 8_200_000,
    debtAmount: 200_000,
    status: "yuklangan",
    paymentMethod: "bank",
    createdAt: "2026-06-02",
    invoiceSent: false,
  },
  {
    id: "ORD-004",
    partnerId: "p4",
    partnerName: "Bobur Xolmatov",
    items: [{ product: initialProducts[0], quantity: 1 }],
    totalAmount: 4_500_000,
    paidAmount: 0,
    debtAmount: 4_500_000,
    status: "kutilmoqda",
    paymentMethod: "qarz",
    createdAt: "2026-06-03",
    invoiceSent: false,
  },
  {
    id: "ORD-005",
    partnerId: "p5",
    partnerName: "Nilufar Rahimova",
    items: [
      { product: initialProducts[4], quantity: 5 },
      { product: initialProducts[3], quantity: 10 },
    ],
    totalAmount: 2_050_000,
    paidAmount: 2_050_000,
    debtAmount: 0,
    status: "yetkazildi",
    paymentMethod: "naqd",
    createdAt: "2026-06-03",
    invoiceSent: true,
  },
  {
    id: "ORD-006",
    partnerId: "p1",
    partnerName: "Alisher Karimov",
    items: [{ product: initialProducts[2], quantity: 1 }],
    totalAmount: 1_900_000,
    paidAmount: 1_900_000,
    debtAmount: 0,
    status: "rad_etildi",
    paymentMethod: "naqd",
    createdAt: "2026-06-04",
    invoiceSent: false,
  },
]

const initialPriceRequests: PriceRequest[] = [
  {
    id: "PR-001",
    orderId: "ORD-002",
    productId: "pr6",
    productName: "iPhone 15 Pro",
    originalPrice: 14_500_000,
    requestedPrice: 13_800_000,
    status: "tasdiqlandi",
    createdAt: "2026-06-01",
    reason: "Mijoz katta miqdorda xarid qilmoqda",
  },
  {
    id: "PR-002",
    productId: "pr1",
    productName: "Samsung Galaxy A54",
    originalPrice: 4_500_000,
    requestedPrice: 4_100_000,
    status: "kutilmoqda",
    createdAt: "2026-06-03",
    reason: "Raqobatchi narxiga moslashish",
  },
  {
    id: "PR-003",
    productId: "pr2",
    productName: "Xiaomi Redmi Note 12",
    originalPrice: 2_800_000,
    requestedPrice: 2_500_000,
    status: "rad_etildi",
    createdAt: "2026-05-29",
    reason: "Mijoz boshqa joydan narx so'ragan",
  },
  {
    id: "PR-004",
    productId: "pr5",
    productName: "Power Bank 20000mAh",
    originalPrice: 320_000,
    requestedPrice: 280_000,
    status: "kutilmoqda",
    createdAt: "2026-06-04",
  },
]

const initialSalaryInfo: SalaryInfo = {
  baseSalary: 3_000_000,
  kpiBonus: 1_500_000,
  salesBonus: 800_000,
  collectionBonus: 500_000,
  month: "Iyun 2026",
  fines: [
    {
      id: "f1",
      reason: "Hisobot kech topshirildi",
      amount: 200_000,
      date: "2026-06-01",
    },
    {
      id: "f2",
      reason: "KPI 70% dan past",
      amount: 300_000,
      date: "2026-06-03",
    },
  ],
}

let orderCounter = 7
let partnerCounter = 6

export const useStore = create<AppState>((set, get) => ({

  partners: initialPartners,
  products: initialProducts,
  orders: initialOrders,
  priceRequests: initialPriceRequests,
  salaryInfo: initialSalaryInfo,
  cart: [],
  selectedPartner: null,
  activeTab: "dashboard",
  monthlyTarget: 80_000_000,
  monthlyAchieved: 54_200_000,
  monthlyRevenue: [38_500_000, 42_000_000, 51_000_000, 47_800_000, 62_000_000, 54_200_000],

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedPartner: (partner) => set({ selectedPartner: partner, cart: [] }),

  addToCart: (product, quantity = 1) =>
    set((state) => {
      const existing = state.cart.find((i) => i.product.id === product.id)
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        }
      }
      return { cart: [...state.cart, { product, quantity }] }
    }),
  addPaymentToOrder: (orderId, amount, paymentMethod) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId)
      if (!order) return state

      const newPaid = order.paidAmount + amount
      const newDebt = order.totalAmount - newPaid

      const updatedOrder = {
        ...order,
        paidAmount: newPaid,
        debtAmount: Math.max(0, newDebt),
        paymentMethod: order.paymentMethod === "qarz" ? paymentMethod : order.paymentMethod,
        status: newDebt === 0 && order.status === "qarz_kutilmoqda" ? "tasdiqlangan" : order.status,
      }

      return {
        orders: state.orders.map((o) => (o.id === orderId ? updatedOrder : o)),
      }
    }),

  removeFromCart: (productId) =>
    set((state) => ({ cart: state.cart.filter((i) => i.product.id !== productId) })),

  updateCartQuantity: (productId, quantity) =>
    set((state) => ({
      cart: quantity <= 0
        ? state.cart.filter((i) => i.product.id !== productId)
        : state.cart.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        ),
    })),

  updateCartPrice: (productId, price) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        i.product.id === productId ? { ...i, requestedPrice: price } : i
      ),
    })),

  clearCart: () => set({ cart: [], selectedPartner: null }),

  placeOrder: (paymentMethod, paidAmount, dueDate, note) => {
    const state = get()
    const total = state.cart.reduce(
      (sum, item) =>
        sum + (item.requestedPrice ?? item.product.price) * item.quantity,
      0
    )
    const debt = total - paidAmount

    const newOrder: Order = {
      id: `ORD-${String(orderCounter++).padStart(3, "0")}`,
      partnerId: state.selectedPartner?.id ?? "",
      partnerName: state.selectedPartner?.name ?? "",
      items: [...state.cart],
      totalAmount: total,
      paidAmount,
      debtAmount: debt,
      status: debt > 0 ? "qarz_kutilmoqda" : "kutilmoqda",
      paymentMethod,
      createdAt: new Date().toISOString().split("T")[0],
      dueDate,
      note,
      invoiceSent: false,
    }

    set((state) => ({
      orders: [newOrder, ...state.orders],
      cart: [],
      selectedPartner: null,
    }))

    return newOrder
  },

  updateOrderStatus: (orderId, status, carNumber) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? { ...o, status, ...(carNumber ? { carNumber } : {}) }
          : o
      ),
    })),

  addPriceRequest: (productId, requestedPrice, reason) => {
    const state = get()
    const product = state.products.find((p) => p.id === productId)
    if (!product) return
    const pr: PriceRequest = {
      id: `PR-${String(state.priceRequests.length + 1).padStart(3, "0")}`,
      productId,
      productName: product.name,
      originalPrice: product.price,
      requestedPrice,
      status: "kutilmoqda",
      createdAt: new Date().toISOString().split("T")[0],
      reason,
    }
    set((state) => ({ priceRequests: [pr, ...state.priceRequests] }))
  },

  updatePriceRequestStatus: (id, status) =>
    set((state) => ({
      priceRequests: state.priceRequests.map((r) =>
        r.id === id ? { ...r, status } : r
      ),
    })),

  addPartner: (partnerData) => {
    const newPartner: Partner = {
      id: `p${partnerCounter++}`,
      name: partnerData.name,
      phone: partnerData.phone,
      address: partnerData.address || "",
      debtAmount: partnerData.debtAmount ?? 0,
      debtLimit: partnerData.debtLimit ?? 0,
      totalOrders: 0,
      email: partnerData.email,
      company: partnerData.company,
      note: partnerData.note,
    }
    set((state) => ({
      partners: [...state.partners, newPartner],
    }))
  },

}))

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("uz-UZ", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount) + " so'm"
}
// store.ts ichiga qo'shing:

export interface SalesDataPoint {
  name: string; // Dush, Sesh, yoki Yan, Fev...
  amount: number; // Masalan: 80000000 (80M)
}

interface DashboardState {
  salesPeriod: 'hafta' | 'oy';
  setSalesPeriod: (period: 'hafta' | 'oy') => void;
  // Rasmdagi grafik chizig'iga mos keluvchi realistik ma'lumotlar
  weeklySalesData: SalesDataPoint[];
  monthlySalesData: SalesDataPoint[];
}

export const useDashboardStore = create<DashboardState>((set) => ({
  salesPeriod: 'hafta',
  setSalesPeriod: (period) => set({ salesPeriod: period }),
  
  // Haftalik ma'lumotlar (Rasmdagi grafik to'lqiniga juda yaqin)
  weeklySalesData: [
    { name: 'Dush', amount: 85000000 },
    { name: 'Sesh', amount: 120000000 },
    { name: 'Chor', amount: 95000000 },
    { name: 'Pay', amount: 150000000 },
    { name: 'Jum', amount: 120000000 },
    { name: 'Shan', amount: 70000000 },
    { name: 'Yak', amount: 50000000 },
  ],
  
  // Oylik ma'lumotlar (Namuna uchun)
  monthlySalesData: [
    { name: 'Yan', amount: 110000000 },
    { name: 'Fev', amount: 140000000 },
    { name: 'Mar', amount: 135000000 },
    { name: 'Apr', amount: 160000000 },
    { name: 'May', amount: 90000000 },
    { name: 'Iyun', amount: 125000000 },
  ]
}));
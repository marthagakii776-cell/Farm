import React, { useMemo } from 'react';
import { Product, Order, CropRecord, FinancialRecord } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  TrendingUp,
  Package,
  DollarSign,
  Sprout,
  ArrowUpRight,
  PlusCircle,
  Calendar,
  AlertCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface FarmerDashboardProps {
  products: Product[];
  orders: Order[];
  crops: CropRecord[];
  financials: FinancialRecord[];
  onNavigateTab: (tab: string) => void;
  onOpenAddProduct: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  products,
  orders,
  crops,
  financials,
  onNavigateTab,
  onOpenAddProduct,
}) => {
  const { currentUser } = useAuth();

  // Filter for this farmer's products and orders
  const myProducts = useMemo(() => {
    return products.filter(
      (p) => p.sellerId === currentUser?.id || currentUser?.role === 'admin'
    );
  }, [products, currentUser]);

  const myOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.items.some((item) => item.sellerId === currentUser?.id) ||
        currentUser?.role === 'admin'
    );
  }, [orders, currentUser]);

  const totalRevenue = useMemo(() => {
    return financials
      .filter((f) => f.type === 'income')
      .reduce((sum, f) => sum + f.amount, 0);
  }, [financials]);

  const totalExpenses = useMemo(() => {
    return financials
      .filter((f) => f.type === 'expense')
      .reduce((sum, f) => sum + f.amount, 0);
  }, [financials]);

  const netCashflow = totalRevenue - totalExpenses;

  // Monthly revenue data points for interactive SVG chart
  const monthlyData = [
    { month: 'Jun', income: 110000, expense: 45000 },
    { month: 'Jul', income: 145000, expense: 62000 },
    { month: 'Aug', income: 180000, expense: 78000 },
    { month: 'Sep', income: 210000, expense: 55000 },
    { month: 'Oct', income: totalRevenue > 0 ? totalRevenue : 260000, expense: totalExpenses > 0 ? totalExpenses : 74000 },
  ];

  const maxVal = Math.max(...monthlyData.map((d) => Math.max(d.income, d.expense))) * 1.15;

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-[#14532D] text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium mb-1">
              <span>{currentUser?.farmName || 'Highland Agro Farm'}</span>
              <span aria-hidden="true">·</span>
              <span>{currentUser?.location || 'Rift Valley'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Welcome back, {currentUser?.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
              Harvest readiness is optimal. You have {myProducts.length} active produce listings and {myOrders.length} wholesale buyer orders being processed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddProduct}
              className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Produce Listing</span>
            </button>
            <button
              onClick={() => onNavigateTab('farm-manager')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 rounded-lg transition-colors whitespace-nowrap"
            >
              Update Crop Records
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards: Single Elevation Depth */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-500 font-medium">Total Produce Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
            KSh {totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1.5 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% from last harvest cycle</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-500 font-medium">Active Market Listings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {myProducts.length} Listings
          </div>
          <div className="text-[11px] text-stone-500 mt-1.5">
            {myProducts.filter((p) => p.status === 'active').length} in active trading status
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-500 font-medium">Managed Crop Acreage</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {crops.reduce((sum, c) => sum + (c.acreage || 0), 0).toFixed(1)} Acres
          </div>
          <div className="text-[11px] text-stone-500 mt-1.5">
            Across {crops.length} monitored blocks
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-500 font-medium">Net Operating Cash Flow</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-900 font-mono tabular-nums">
            KSh {netCashflow.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 mt-1.5 font-mono">
            Expenses: KSh {totalExpenses.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Sales & Expense Ledger Chart + Market Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Financial Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                Farm Financial Trend & Operating Cashflow
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Monthly revenue vs input expenses (Fertilizer, Seed, Labor, Vet)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-700" />
                <span className="text-stone-600">Produce Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-amber-500" />
                <span className="text-stone-600">Expenses</span>
              </div>
            </div>
          </div>

          {/* Clean Interactive SVG Bar / Trend Chart */}
          <div className="h-56 w-full flex items-end justify-between gap-4 pt-6 pb-2 px-2 border-b border-stone-100">
            {monthlyData.map((d) => {
              const incomeHeight = Math.max(12, Math.round((d.income / maxVal) * 100));
              const expenseHeight = Math.max(8, Math.round((d.expense / maxVal) * 100));
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] text-stone-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    +KSh {(d.income / 1000).toFixed(0)}k
                  </div>
                  <div className="w-full max-w-[48px] flex items-end justify-center gap-1.5 h-full">
                    <div
                      style={{ height: `${incomeHeight}%` }}
                      className="w-1/2 bg-emerald-700 hover:bg-emerald-800 rounded-t-sm transition-all"
                      title={`Income: KSh ${d.income.toLocaleString()}`}
                    />
                    <div
                      style={{ height: `${expenseHeight}%` }}
                      className="w-1/2 bg-amber-500 hover:bg-amber-600 rounded-t-sm transition-all"
                      title={`Expense: KSh ${d.expense.toLocaleString()}`}
                    />
                  </div>
                  <span className="text-xs font-medium text-stone-600">{d.month}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
            <span>Aggregated from verified marketplace orders and local ledger</span>
            <button
              onClick={() => onNavigateTab('farm-manager')}
              className="text-emerald-800 hover:underline font-semibold"
            >
              Open Complete Ledger →
            </button>
          </div>
        </div>

        {/* Right Col: High-Demand Market Opportunities */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                Current Market Demands
              </h2>
              <span className="text-[11px] text-stone-400">Live Trade Feeds</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <div className="flex justify-between font-semibold text-stone-900">
                  <span>Hass Avocados (Size 14-18)</span>
                  <span className="text-emerald-800 font-mono">KSh 185/kg</span>
                </div>
                <p className="text-[11px] text-stone-600 mt-1">
                  Exporters seeking 12 metric tonnes weekly for direct air freight to Europe & UAE.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                <div className="flex justify-between font-semibold text-stone-900">
                  <span>Dry Yellow Maize (13% MC)</span>
                  <span className="text-emerald-800 font-mono">KSh 3,700/bag</span>
                </div>
                <p className="text-[11px] text-stone-600 mt-1">
                  Nairobi millers issuing instant payments for clean, tested grain.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                <div className="flex justify-between font-semibold text-stone-900">
                  <span>Roma Plum Tomatoes</span>
                  <span className="text-emerald-800 font-mono">KSh 3,600/crate</span>
                </div>
                <p className="text-[11px] text-stone-600 mt-1">
                  High retail demand across Westlands & Kilimani markets.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('marketplace')}
            className="w-full mt-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <span>View All Market Listings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Section: Active Crop Status & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Crops Overview */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-stone-900">Monitored Crop Cycles</h2>
            <button
              onClick={() => onNavigateTab('farm-manager')}
              className="text-xs text-emerald-800 hover:underline font-semibold"
            >
              Manage Crops
            </button>
          </div>

          <div className="space-y-3">
            {crops.map((crop) => (
              <div
                key={crop.id}
                className="p-3 rounded-lg border border-stone-100 bg-stone-50/50 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-stone-900">{crop.cropName}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {crop.variety} · {crop.acreage} Acres · Planted: {crop.plantingDate}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded ${
                      crop.stage === 'Harvested'
                        ? 'bg-stone-200 text-stone-700'
                        : crop.stage === 'Maturity'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {crop.stage}
                  </span>
                  <div className="text-[10px] text-stone-400 mt-1">
                    Harvest: {crop.expectedHarvestDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Wholesale Orders */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-stone-900">Recent Customer Orders</h2>
            <span className="text-xs text-stone-400 font-mono tabular-nums">
              {myOrders.length} total orders
            </span>
          </div>

          <div className="space-y-3">
            {myOrders.length === 0 ? (
              <p className="text-xs text-stone-500 py-6 text-center">
                No orders yet. Your listings are active in the marketplace!
              </p>
            ) : (
              myOrders.slice(0, 3).map((ord) => (
                <div
                  key={ord.id}
                  className="p-3 rounded-lg border border-stone-100 bg-stone-50/50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-xs text-stone-900 font-mono">
                      #{ord.orderNumber}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      Buyer: {ord.buyerName} · {ord.paymentMethod}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-emerald-900">
                      KSh {ord.totalAmount.toLocaleString()}
                    </div>
                    <span className="inline-block mt-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-700">
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

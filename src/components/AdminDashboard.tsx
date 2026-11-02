import React, { useState } from 'react';
import { User, Product, Order, Article } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Shield,
  Users,
  Package,
  ShoppingBag,
  BookOpen,
  DollarSign,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  articles: Article[];
  onDeleteProduct: (id: string) => Promise<void>;
  onDeleteArticle: (id: string) => Promise<void>;
  onUpdateOrderStatus: (id: string, status: Order['orderStatus']) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  articles,
  onDeleteProduct,
  onDeleteArticle,
  onUpdateOrderStatus,
}) => {
  const { currentUser, allDemoUsers } = useAuth();
  const [adminTab, setAdminTab] = useState<'users' | 'products' | 'orders' | 'articles'>('users');

  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeProducts = products.filter((p) => p.status === 'active');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5 text-amber-700" />
            <span>Platform Governance & Audit</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-emerald-950">
            System Administrator Control Console
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Role-protected command console for monitoring users, approving wholesale listings, auditing financial flows, and regulating educational publications.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setAdminTab('users')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              adminTab === 'users'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Users ({allDemoUsers.length})
          </button>
          <button
            onClick={() => setAdminTab('products')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              adminTab === 'products'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Marketplace ({products.length})
          </button>
          <button
            onClick={() => setAdminTab('orders')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              adminTab === 'orders'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Transactions ({orders.length})
          </button>
          <button
            onClick={() => setAdminTab('articles')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              adminTab === 'articles'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Articles ({articles.length})
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Total Registered Members</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
            {allDemoUsers.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Across 5 distinct roles</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Active Market Listings</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-900 mt-1">
            {activeProducts.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {products.length - activeProducts.length} closed or sold
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Gross Platform Trade</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-900 mt-1">
            KSh {totalSales.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Processed orders</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Educational Guides</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
            {articles.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Peer-reviewed materials</div>
        </div>
      </div>

      {/* 1. USERS MANAGEMENT TAB */}
      {adminTab === 'users' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-200">
            <h3 className="text-sm font-bold text-stone-900">
              Registered System Accounts & Verification Status
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
                <tr>
                  <th className="px-4 py-3">User & Contact</th>
                  <th className="px-4 py-3">Account Type</th>
                  <th className="px-4 py-3">Location / County</th>
                  <th className="px-4 py-3">Holding / Entity</th>
                  <th className="px-4 py-3">Verification</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {allDemoUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/50">
                    <td className="px-4 py-3">
                      <div className="font-bold text-stone-900">{u.name}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{u.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{u.location}</td>
                    <td className="px-4 py-3 text-stone-600">{u.farmName || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                        Verified
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => alert(`Auditing activity log for ${u.name}`)}
                        className="text-xs text-emerald-800 hover:underline font-medium"
                      >
                        Inspect Log
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. MARKETPLACE MODERATION TAB */}
      {adminTab === 'products' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-200">
            <h3 className="text-sm font-bold text-stone-900">
              Produce Listings Moderation & Compliance
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
                <tr>
                  <th className="px-4 py-3">Produce Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Seller</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Moderate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/50">
                    <td className="px-4 py-3 font-semibold text-stone-900 max-w-xs truncate">
                      {p.title}
                    </td>
                    <td className="px-4 py-3 text-stone-600">{p.category}</td>
                    <td className="px-4 py-3 text-stone-600">{p.sellerName}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold tabular-nums">
                      KSh {p.price.toLocaleString()} / {p.unit}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">
                      {p.quantityAvailable.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 capitalize">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Remove listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ORDERS & SETTLEMENTS TAB */}
      {adminTab === 'orders' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-200">
            <h3 className="text-sm font-bold text-stone-900">
              Transaction Orders & Escrow Tracking
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
                <tr>
                  <th className="px-4 py-3">Order Number</th>
                  <th className="px-4 py-3">Buyer</th>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">Ref ID</th>
                  <th className="px-4 py-3 text-right">Amount (KSh)</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Lifecycle Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/50">
                    <td className="px-4 py-3 font-mono font-bold text-stone-900">
                      #{ord.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-stone-700 font-medium">{ord.buyerName}</td>
                    <td className="px-4 py-3 text-stone-600">{ord.paymentMethod}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-stone-500">
                      {ord.transactionReference}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-900 tabular-nums">
                      KSh {ord.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 uppercase tracking-wider">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={ord.orderStatus}
                        onChange={(e: any) => onUpdateOrderStatus(ord.id, e.target.value)}
                        className="text-[11px] border border-stone-300 rounded px-2 py-1 bg-white font-medium"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ARTICLES AUDIT TAB */}
      {adminTab === 'articles' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-200">
            <h3 className="text-sm font-bold text-stone-900">Published Agronomy Guides</h3>
          </div>
          <div className="divide-y divide-stone-100">
            {articles.map((art) => (
              <div key={art.id} className="p-4 flex items-center justify-between hover:bg-stone-50/50">
                <div className="max-w-xl">
                  <div className="text-[11px] text-emerald-800 font-semibold mb-0.5">
                    {art.category} · by {art.authorName} ({art.authorRole})
                  </div>
                  <h4 className="text-sm font-bold text-stone-900">{art.title}</h4>
                  <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{art.excerpt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteArticle(art.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded"
                    title="Delete article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

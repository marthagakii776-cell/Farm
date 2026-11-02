import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Search, MapPin, Plus, ShoppingBag, MessageSquare, Filter } from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal.tsx';
import { AddProductModal } from './AddProductModal.tsx';

interface MarketplaceProps {
  products: Product[];
  onProductAdded: (prod: Product) => void;
  onContactSeller: (product: Product) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

const CATEGORIES: Array<'All' | ProductCategory> = [
  'All',
  'Maize',
  'Beans',
  'Potatoes',
  'Tomatoes',
  'Avocados',
  'Onions',
  'Fruits',
  'Vegetables',
  'Dairy',
  'Poultry',
  'Livestock',
];

export const Marketplace: React.FC<MarketplaceProps> = ({
  products,
  onProductAdded,
  onContactSeller,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        prod.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        prod.title.toLowerCase().includes(query) ||
        prod.description.toLowerCase().includes(query) ||
        prod.location.toLowerCase().includes(query) ||
        prod.sellerName.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            Certified Produce Exchange
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-emerald-950">
            Agricultural Marketplace
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Source fresh highland harvests directly from certified farmers. Zero middlemen, guaranteed traceability, and secure M-Pesa & Card transactions.
          </p>
        </div>

        {/* Action Button: Farmer produce listing */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>List Farm Produce</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-stone-200 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search produce (e.g. Yellow Maize, Hass Avocados, Nakuru, Shangi)..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50/50"
          />
        </div>

        {/* Category Filter Pills (Functional interactive Segmented Control buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.slice(0, 7).map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary category row for deeper specialty browsing */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-4 text-xs">
        <span className="text-stone-400 text-xs font-medium mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> More Categories:
        </span>
        {CATEGORIES.slice(7).map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto my-12">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900 mb-1">No Produce Found</h3>
          <p className="text-xs text-stone-500 mb-4">
            No active listings matched your search criteria. Try a different crop keyword or clear your category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              {/* Product Image: 65% height discipline */}
              <div
                onClick={() => setSelectedProduct(prod)}
                className="relative aspect-4/3 overflow-hidden bg-stone-100 cursor-pointer"
              >
                <img
                  src={prod.image}
                  alt={prod.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 bg-stone-900/75 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded">
                  {prod.category}
                </div>
              </div>

              {/* Product Body: Zero-pill metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1.5">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      {prod.location}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums whitespace-nowrap">
                      {prod.quantityAvailable.toLocaleString()} {prod.unit}s left
                    </span>
                  </div>

                  <h3
                    onClick={() => setSelectedProduct(prod)}
                    className="text-sm font-bold text-stone-900 line-clamp-1 hover:text-emerald-800 cursor-pointer transition-colors"
                  >
                    {prod.title}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-2 mt-1 mb-3">
                    {prod.description}
                  </p>
                </div>

                <div>
                  {/* Price & Unit (Tabular Numerals) */}
                  <div className="flex items-baseline justify-between mb-3 border-t border-stone-100 pt-2.5">
                    <div className="text-base font-bold text-emerald-900 font-mono tabular-nums">
                      KSh {prod.price.toLocaleString()}
                      <span className="text-[11px] font-sans font-normal text-stone-500 ml-1">
                        / {prod.unit}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400">
                      by {prod.sellerName.split(' ')[0]}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="w-full py-2 px-2.5 rounded-lg text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Order</span>
                    </button>
                    <button
                      onClick={() => onContactSeller(prod)}
                      className="w-full py-2 px-2 rounded-lg text-xs font-medium text-stone-700 border border-stone-200 hover:bg-stone-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onContactSeller={onContactSeller}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={onProductAdded}
      />
    </section>
  );
};

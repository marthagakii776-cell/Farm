import React, { useState } from 'react';
import { Product } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { X, MapPin, Phone, User, ShoppingBag, MessageSquare, Check, ShieldCheck } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onContactSeller: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onContactSeller,
}) => {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200">
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative h-64 md:h-full min-h-[280px] bg-stone-100">
            <img
              src={product.image}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback styled visual if remote URL doesn't load
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs">
              <span>{product.category}</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                <span className="font-medium text-emerald-800">{product.category}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  {product.location}
                </span>
              </div>

              <h2 className="text-xl font-bold font-display text-stone-900 leading-snug mb-2">
                {product.title}
              </h2>

              <div className="text-2xl font-bold text-emerald-800 font-mono tabular-nums mb-4">
                KSh {product.price.toLocaleString()}
                <span className="text-xs font-sans text-stone-500 font-normal ml-1">
                  / {product.unit}
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Stock and Seller verification */}
              <div className="border-t border-b border-stone-100 py-3 mb-5 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span className="text-stone-400">Available Quantity:</span>
                  <span className="font-semibold text-stone-800 font-mono tabular-nums">
                    {product.quantityAvailable.toLocaleString()} {product.unit}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Listed By:</span>
                  <span className="font-medium text-stone-800 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    {product.sellerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Direct Contact:</span>
                  <span className="font-mono text-stone-800 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    {product.sellerPhone}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">Direct Producer Verified Guarantee</span>
                </div>
              </div>
            </div>

            {/* Purchase / Enquire Actions */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-xs text-stone-600 whitespace-nowrap">Quantity:</label>
                <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 bg-stone-50 text-stone-600 hover:bg-stone-100 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-mono font-semibold text-stone-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.quantityAvailable, q + 1))
                    }
                    className="px-3 py-1.5 bg-stone-50 text-stone-600 hover:bg-stone-100 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="text-xs text-stone-500 font-mono">
                  Total: KSh {(product.price * quantity).toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={product.quantityAvailable === 0}
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : product.quantityAvailable === 0
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Order Cart
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onContactSeller(product);
                  }}
                  className="w-full py-2.5 px-4 rounded-lg font-medium text-xs text-stone-800 border border-stone-300 hover:bg-stone-50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-800" />
                  Message Farmer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

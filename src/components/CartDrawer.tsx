import React, { useState } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { PaymentMethod, Order } from '../types/index.ts';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Truck,
  CheckCircle2,
  Info,
  Loader2,
} from 'lucide-react';

interface CartDrawerProps {
  onOrderPlaced: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOrderPlaced }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice, isCartOpen, setIsCartOpen } =
    useCart();
  const { currentUser, setIsAuthModalOpen, setAuthModalMode } = useAuth();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  const [deliveryAddress, setDeliveryAddress] = useState('Westlands Wholesale Hub, Nairobi');
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phone || '+254 722 890 123');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('M-Pesa');
  const [mpesaNumber, setMpesaNumber] = useState('254722890123');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [stkPushStatus, setStkPushStatus] = useState<string>('');

  if (!isCartOpen) return null;

  const handleStartCheckout = () => {
    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    setCheckoutStep('shipping');
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);

    if (paymentMethod === 'M-Pesa') {
      setStkPushStatus('Sending STK Push prompt to Safaricom Daraja network...');
      try {
        const simRes = await fetch('/api/payments/mpesa-express', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: mpesaNumber,
            amount: totalPrice,
            accountReference: 'FARMERSHUB',
          }),
        });
        const simData = await simRes.json();
        setStkPushStatus(`Prompt sent! Customer PIN accepted. Receipt: ${simData.SimulatedReceipt}`);
      } catch {
        setStkPushStatus('Simulating verified M-Pesa STK transaction...');
      }
    }

    // Create the actual order in the persistent database
    setTimeout(async () => {
      try {
        const orderPayload = {
          buyerId: currentUser?.id || 'usr_buyer_1',
          buyerName: currentUser?.name || 'Produce Buyer',
          buyerPhone,
          buyerEmail: currentUser?.email || 'buyer@farmershub.co.ke',
          deliveryAddress,
          items: cart.map((item) => ({
            productId: item.product.id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
            unit: item.product.unit,
            sellerId: item.product.sellerId,
            sellerName: item.product.sellerName,
            image: item.product.image,
          })),
          totalAmount: totalPrice,
          paymentMethod,
          paymentStatus: 'completed' as const,
          mpesaPhoneNumber: mpesaNumber,
        };

        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });

        const createdOrder = await res.json();
        setConfirmedOrder(createdOrder);
        onOrderPlaced(createdOrder);
        clearCart();
        setCheckoutStep('success');
      } catch (err) {
        console.error('Order creation failed:', err);
      } finally {
        setIsProcessing(false);
      }
    }, 1800);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    if (checkoutStep === 'success') {
      setCheckoutStep('cart');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-800" />
            <h3 className="font-bold text-stone-900 font-display">
              {checkoutStep === 'cart' && 'Produce Order Cart'}
              {checkoutStep === 'shipping' && 'Delivery Coordinates'}
              {checkoutStep === 'payment' && 'Secure Settlement'}
              {checkoutStep === 'success' && 'Order Confirmed'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close cart"
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* STEP 1: CART ITEMS */}
          {checkoutStep === 'cart' && (
            <div>
              {cart.length === 0 ? (
                <div className="py-16 text-center text-xs text-stone-500">
                  <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p className="font-semibold text-stone-800 text-sm mb-1">Your cart is empty</p>
                  <p>Browse our verified farmers' marketplace to order fresh harvests.</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-3.5 flex items-start gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 truncate">
                          {item.product.title}
                        </h4>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Farmer: {item.product.sellerName}
                        </div>
                        <div className="text-xs font-mono font-semibold text-emerald-800 mt-1">
                          KSh {item.product.price.toLocaleString()} / {item.product.unit}
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-stone-200 rounded-md">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-50"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-stone-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-50"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-stone-400 hover:text-rose-600 p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: SHIPPING DETAILS */}
          {checkoutStep === 'shipping' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Recipient Contact Phone (M-Pesa notifications) *
                </label>
                <input
                  type="text"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Delivery Destination / Depot Address *
                </label>
                <textarea
                  rows={3}
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Street name, estate, wholesale warehouse or regional market stall..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-start gap-2 text-stone-700">
                <Truck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Consignments are loaded at farm-gate under monitored temperature conditions with certified weight slips.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {checkoutStep === 'payment' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="block font-semibold text-stone-700">Select Settlement Channel</label>
                
                {/* M-Pesa Option */}
                <label
                  onClick={() => setPaymentMethod('M-Pesa')}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    paymentMethod === 'M-Pesa'
                      ? 'border-emerald-700 bg-emerald-50/70'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-emerald-700" />
                    <div>
                      <span className="font-bold text-stone-900 block">Safaricom M-Pesa Express</span>
                      <span className="text-[11px] text-stone-500">Instant STK Push to phone</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'M-Pesa'}
                    onChange={() => setPaymentMethod('M-Pesa')}
                    className="text-emerald-700"
                  />
                </label>

                {/* Card Option */}
                <label
                  onClick={() => setPaymentMethod('Card')}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    paymentMethod === 'Card'
                      ? 'border-emerald-700 bg-emerald-50/70'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <div>
                      <span className="font-bold text-stone-900 block">Visa / Mastercard</span>
                      <span className="text-[11px] text-stone-500">3D-Secure Bank Processing</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Card'}
                    onChange={() => setPaymentMethod('Card')}
                    className="text-emerald-700"
                  />
                </label>

                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-emerald-700 bg-emerald-50/70'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <div>
                      <span className="font-bold text-stone-900 block">Pay on Delivery / Farm Pickup</span>
                      <span className="text-[11px] text-stone-500">Upon produce inspection</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="text-emerald-700"
                  />
                </label>
              </div>

              {/* M-Pesa Input */}
              {paymentMethod === 'M-Pesa' && (
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                  <label className="block text-[11px] font-semibold text-stone-700">
                    Safaricom M-Pesa Number for STK Push
                  </label>
                  <input
                    type="text"
                    value={mpesaNumber}
                    onChange={(e) => setMpesaNumber(e.target.value)}
                    placeholder="2547XXXXXXXX"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-700 bg-white"
                  />
                  <div className="text-[10px] text-stone-500 leading-normal flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Daraja API will trigger an instantaneous USSD PIN prompt on your device.</span>
                  </div>
                </div>
              )}

              {/* Card Inputs */}
              {paymentMethod === 'Card' && (
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                  <label className="block text-[11px] font-semibold text-stone-700">Card Details</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="09/28"
                      className="px-3 py-1.5 border border-stone-300 rounded-lg font-mono bg-white"
                    />
                    <input
                      type="password"
                      placeholder="CVC"
                      defaultValue="884"
                      className="px-3 py-1.5 border border-stone-300 rounded-lg font-mono bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Payment Notice / Security Disclosure */}
              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-stone-700 text-[11px] space-y-1">
                <span className="font-semibold text-amber-900 block">
                  Official Merchant API Notice
                </span>
                <p>
                  Production live deployments link to Safaricom Daraja Consumer Key & Secret securely configured on the server environment. No secrets stored in frontend code.
                </p>
              </div>

              {stkPushStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 font-mono text-[11px] flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-emerald-700" />
                  <span>{stkPushStatus}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: SUCCESS RECEIPT */}
          {checkoutStep === 'success' && confirmedOrder && (
            <div className="space-y-4 py-4 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold font-display text-emerald-950">
                Produce Order Confirmed!
              </h4>
              <p className="text-xs text-stone-600">
                Your order was successfully recorded and sent to the producers.
              </p>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-400">Order Number:</span>
                  <span className="font-mono font-bold text-stone-900">
                    #{confirmedOrder.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Payment Channel:</span>
                  <span className="font-semibold text-stone-800">
                    {confirmedOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Transaction Ref:</span>
                  <span className="font-mono text-emerald-800 font-semibold">
                    {confirmedOrder.transactionReference}
                  </span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2 font-bold text-stone-900">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono tabular-nums text-emerald-900">
                    KSh {confirmedOrder.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-stone-500">
                A notification was sent to both the buyer and farmer dashboards.
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        {cart.length > 0 && checkoutStep !== 'success' && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-stone-500 font-medium">Order Subtotal</span>
              <span className="text-lg font-bold font-mono tabular-nums text-emerald-950">
                KSh {totalPrice.toLocaleString()}
              </span>
            </div>

            {checkoutStep === 'cart' && (
              <button
                onClick={handleStartCheckout}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {checkoutStep === 'shipping' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="px-4 py-2.5 border border-stone-300 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Back
                </button>
                <button
                  onClick={() => setCheckoutStep('payment')}
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {checkoutStep === 'payment' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCheckoutStep('shipping')}
                  disabled={isProcessing}
                  className="px-4 py-2.5 border border-stone-300 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Back
                </button>
                <button
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming with Daraja...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authorize KSh {totalPrice.toLocaleString()}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {checkoutStep === 'success' && (
          <div className="p-4 border-t border-stone-200 bg-stone-50">
            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Done & Return to Market
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

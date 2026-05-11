import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Banknote,
  Check,
  Clock,
  MapPin,
  Smartphone,
  Tag,
  Truck,
  TrendingUp,
} from 'lucide-react';
import { apiClient } from '../api';

const RESTAURANT_BRANCHES = [
  { id: 1, name: 'Downtown Branch', address: '123 Main St, City Center' },
  { id: 2, name: 'Riverside Plaza', address: '456 River Ave, Waterfront' },
  { id: 3, name: 'East Market', address: '789 East Blvd, Market District' },
];

const ORDER_STATUSES = [
  { step: 1, label: 'Order Placed', icon: 'check' },
  { step: 2, label: 'Preparing', icon: 'clock' },
  { step: 3, label: 'Ready for Pickup', icon: 'trending' },
  { step: 4, label: 'Out for Delivery', icon: 'truck' },
];

const VOUCHERS = [
  { code: 'WELCOME10', discount: 10, description: '10% off first order' },
  { code: 'SAVE20', discount: 20, description: '$20 off orders over $100' },
  { code: 'SUMMER15', discount: 15, description: '15% off summer menu' },
];

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const existing = document.querySelector('script[data-razorpay-sdk="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpaySdk = 'true';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const formatINR = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

const Checkout = ({ cart = [], onClose }) => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null); // 'upi' | 'cod'
  const [orderStatus, setOrderStatus] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const timeoutsRef = useRef([]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const discountAmount = useMemo(
    () => (appliedVoucher ? (cartTotal * appliedVoucher.discount) / 100 : 0),
    [appliedVoucher, cartTotal]
  );
  const finalTotal = useMemo(() => cartTotal - discountAmount, [cartTotal, discountAmount]);

  const statusProgress = useMemo(() => {
    if (ORDER_STATUSES.length <= 1) return 0;
    return Math.max(0, Math.min(1, (orderStatus - 1) / (ORDER_STATUSES.length - 1)));
  }, [orderStatus]);

  const clearProgressTimers = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  const startProgressSimulation = () => {
    clearProgressTimers();
    setOrderStatus(1);
    const intervals = [2000, 4000, 6000,];
    intervals.forEach((delay, index) => {
      const id = setTimeout(() => setOrderStatus(index + 2), delay);
      timeoutsRef.current.push(id);
    });
  };

  useEffect(() => () => clearProgressTimers(), []);

  const handleApplyVoucher = () => {
    const voucher = VOUCHERS.find((v) => v.code === voucherCode.toUpperCase());
    if (voucher) {
      setAppliedVoucher(voucher);
      setVoucherCode('');
    }
  };

  const handleOrderPlaced = (orderDoc) => {
    setPlacedOrder(orderDoc);
    setOrderPlaced(true);
    startProgressSimulation();
  };

  const handlePlaceOrder = async () => {
    if (!selectedBranch || !deliveryAddress || !paymentMethod || cart.length === 0) return;

    setErrorMessage('');
    setIsPlacing(true);

    const branch = RESTAURANT_BRANCHES.find((b) => b.id === selectedBranch);
    const payload = {
      items: cart,
      totalAmount: Number(finalTotal.toFixed(2)),
      branchId: branch?.id ?? null,
      branchName: branch?.name ?? '',
      deliveryAddress,
      voucherCode: appliedVoucher?.code ?? '',
      discountAmount: Number(discountAmount.toFixed(2)),
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod: paymentMethod === 'cod' ? 'cod' : 'razorpay',
      paymentType: paymentMethod,
    };

    try {
      if (paymentMethod === 'cod') {
        const response = await apiClient.post('/orders', payload);
        handleOrderPlaced(response.data?.data);
        return;
      }

      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        throw new Error('Razorpay checkout failed to load. Please disable ad-blocker and try again.');
      }

      const orderResponse = await apiClient.post('/payments/razorpay/order', payload);
      const { keyId, orderId, razorpayOrderId, amount, currency } = orderResponse.data?.data || {};

      if (!keyId || !orderId || !razorpayOrderId) {
        throw new Error('Failed to create a payment order. Please try again.');
      }

      const options = {
        key: keyId,
        amount,
        currency: currency || 'INR',
        name: 'Food Order',
        description: 'Pay securely with Razorpay',
        order_id: razorpayOrderId,
        prefill: {
          name: customerName || undefined,
          email: customerEmail || undefined,
          contact: customerPhone || undefined,
        },
        notes: {
          deliveryAddress,
          branchName: branch?.name ?? '',
        },
        method: paymentMethod === 'upi' ? 'upi' : undefined,
        theme: {
          color: '#111827',
        },
        handler: async (paymentResponse) => {
          try {
            setIsPlacing(true);
            const verifyResponse = await apiClient.post('/payments/razorpay/verify', {
              orderId,
              ...paymentResponse,
            });
            handleOrderPlaced(verifyResponse.data?.data);
          } catch (error) {
            setErrorMessage(
              error?.response?.data?.message || error?.message || 'Payment verification failed'
            );
          } finally {
            setIsPlacing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setErrorMessage('Payment cancelled. You can try again.');
          },
        },
      };

      const razorpayCheckout = new window.Razorpay(options);
      razorpayCheckout.on('payment.failed', (err) => {
        const msg =
          err?.error?.description ||
          err?.error?.reason ||
          err?.error?.code ||
          'Payment failed. Please try again.';
        setErrorMessage(msg);
      });
      razorpayCheckout.open();
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Something went wrong');
    } finally {
      setIsPlacing(false);
    }
  };

  if (orderPlaced) {
    const branchName =
      placedOrder?.branchName ||
      RESTAURANT_BRANCHES.find((b) => b.id === selectedBranch)?.name ||
      '';
    const paymentLabel =
      placedOrder?.paymentMethod === 'razorpay'
        ? `UPI (Razorpay) - ${placedOrder?.paymentStatus || 'pending'}`
        : 'Cash on Delivery';

    return (
      <div className="explosive-checkout-container">
        <div className="explosive-order-confirmation">
          <h2>Order Placed Successfully!</h2>

          <div className="explosive-order-tracking">
            <h3>Order Status</h3>

            <div className="explosive-progress-bar-container">
              <div
                className="explosive-progress-bar-fill"
                style={{
                  width: `${(Math.min(orderStatus, ORDER_STATUSES.length) / ORDER_STATUSES.length) * 100}%`,
                }}
              />
            </div>

            <div className="explosive-status-steps" style={{ '--progress': statusProgress }}>
              {ORDER_STATUSES.map((status) => (
                <div
                  key={status.step}
                  className={`explosive-status-step ${orderStatus >= status.step ? 'active' : ''}`}
                >
                  <div className="explosive-step-number">{status.step}</div>
                  <div className="explosive-status-icon">
                    {status.icon === 'check' && <Check size={20} />}
                    {status.icon === 'clock' && <Clock size={20} />}
                    {status.icon === 'trending' && <TrendingUp size={20} />}
                    {status.icon === 'truck' && <Truck size={20} />}
                  </div>
                  <span className="explosive-status-label">{status.label}</span>
                  {orderStatus >= status.step && (
                    <span className="explosive-status-checkmark">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="explosive-order-details">
            <h3>Order Details</h3>
            {placedOrder?._id && (
              <p>
                <strong>Order ID:</strong> {placedOrder._id}
              </p>
            )}
            <p>
              <strong>Restaurant:</strong> {branchName}
            </p>
            <p>
              <strong>Delivery To:</strong> {placedOrder?.deliveryAddress || deliveryAddress}
            </p>
            <p>
              <strong>Payment Method:</strong> {paymentLabel}
            </p>
            <p>
              <strong>Order Total:</strong> {formatINR(placedOrder?.totalAmount ?? finalTotal)}
            </p>
            {placedOrder?.discountAmount ? (
              <p>
                <strong>Discount:</strong> -{formatINR(placedOrder.discountAmount)}
              </p>
            ) : null}
          </div>

          <button className="explosive-continue-btn" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="explosive-checkout-container">
      <h2>Checkout</h2>

      <div className="explosive-checkout-section">
        <h3 className="explosive-section-title">Select Restaurant</h3>
        <div className="explosive-branches-grid">
          {RESTAURANT_BRANCHES.map((branch) => (
            <div
              key={branch.id}
              className={`explosive-branch-card ${selectedBranch === branch.id ? 'selected' : ''}`}
              onClick={() => setSelectedBranch(branch.id)}
            >
              <MapPin size={24} />
              <h4>{branch.name}</h4>
              <p>{branch.address}</p>
              {selectedBranch === branch.id && <div className="explosive-checkmark">✓</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="explosive-checkout-section">
        <h3 className="explosive-section-title">Delivery Address</h3>
        <input
          type="text"
          placeholder="Enter your delivery address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          className="explosive-input"
        />
      </div>

      <div className="explosive-checkout-section">
        <h3 className="explosive-section-title">Customer Details</h3>
        <input
          type="text"
          placeholder="Full name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="explosive-input"
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="explosive-input"
          style={{ marginTop: 10 }}
        />
        <input
          type="tel"
          placeholder="Phone (optional)"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="explosive-input"
          style={{ marginTop: 10 }}
        />
      </div>

      <div className="explosive-checkout-section">
        <h3 className="explosive-section-title">Apply Voucher</h3>

        <div className="explosive-voucher-input-group">
          <input
            type="text"
            placeholder="Enter voucher code"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            className="explosive-input"
          />
          <button className="explosive-apply-btn" onClick={handleApplyVoucher}>
            Apply
          </button>
        </div>

        {appliedVoucher && (
          <div className="explosive-voucher-badge">
            <Tag size={18} />
            <span>{appliedVoucher.code}</span>
            <span className="explosive-discount">-{appliedVoucher.discount}%</span>
          </div>
        )}

        <div className="explosive-voucher-list">
          <p className="explosive-voucher-title">Available Vouchers:</p>
          {VOUCHERS.map((v) => (
            <button
              key={v.code}
              className="explosive-voucher-option"
              onClick={() => {
                setVoucherCode(v.code);
                setAppliedVoucher(v);
              }}
            >
              <span className="explosive-voucher-code">{v.code}</span>
              <span className="explosive-voucher-desc">{v.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="explosive-checkout-section">
        <h3 className="explosive-section-title">Payment Method</h3>
        <div className="explosive-payment-options">
          <button
            className={`explosive-payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('upi')}
          >
            <Smartphone size={32} />
            <div className="explosive-payment-info">
              <span className="explosive-payment-name">UPI</span>
              <span className="explosive-payment-desc">Google Pay, PhonePe, PayTM</span>
            </div>
            {paymentMethod === 'upi' && <Check size={24} />}
          </button>

          <button
            className={`explosive-payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('cod')}
          >
            <Banknote size={32} />
            <div className="explosive-payment-info">
              <span className="explosive-payment-name">Cash on Delivery</span>
              <span className="explosive-payment-desc">Pay when your order arrives</span>
            </div>
            {paymentMethod === 'cod' && <Check size={24} />}
          </button>
        </div>
      </div>

      <div className="explosive-checkout-section">
        <h3 className="explosive-section-title">Order Summary</h3>
        <div className="explosive-summary-table">
          <div className="explosive-summary-row">
            <span>Subtotal:</span>
            <span>{formatINR(cartTotal)}</span>
          </div>
          {appliedVoucher && (
            <div className="explosive-summary-row explosive-discount-row">
              <span>Discount ({appliedVoucher.code}):</span>
              <span>-{formatINR(discountAmount)}</span>
            </div>
          )}
          <div className="explosive-summary-row explosive-total-row">
            <span>Total:</span>
            <span>{formatINR(finalTotal)}</span>
          </div>
        </div>
      </div>

      {errorMessage ? (
        <div className="explosive-checkout-section" style={{ color: '#b91c1c' }}>
          {errorMessage}
        </div>
      ) : null}

      <button
        className="explosive-place-order-btn"
        onClick={handlePlaceOrder}
        disabled={
          isPlacing || !selectedBranch || !deliveryAddress || !paymentMethod || cart.length === 0
        }
      >
        {isPlacing ? 'Processing...' : 'Place Order Now'}
      </button>
    </div>
  );
};

export default Checkout;


import React, { useState } from 'react';
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

const Checkout = ({ cart = [], onClose }) => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderStatus, setOrderStatus] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedVoucher ? (cartTotal * appliedVoucher.discount) / 100 : 0;
  const finalTotal = cartTotal - discountAmount;
  const statusProgress =
    ORDER_STATUSES.length > 1
      ? Math.max(0, Math.min(1, (orderStatus - 1) / (ORDER_STATUSES.length - 1)))
      : 0;

  const handleApplyVoucher = () => {
    const voucher = VOUCHERS.find((v) => v.code === voucherCode.toUpperCase());
    if (voucher) {
      setAppliedVoucher(voucher);
      setVoucherCode('');
    }
  };

  const handlePlaceOrder = () => {
    if (selectedBranch && deliveryAddress && paymentMethod) {
      setOrderPlaced(true);
      setOrderStatus(1);

      // Simulate order progress
      const intervals = [2000, 4000, 6000];
      intervals.forEach((delay, index) => {
        setTimeout(() => setOrderStatus(index + 2), delay);
      });
    }
  };

  if (orderPlaced) {
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
            <p>
              <strong>Restaurant:</strong>{' '}
              {RESTAURANT_BRANCHES.find((b) => b.id === selectedBranch)?.name}
            </p>
            <p>
              <strong>Delivery To:</strong> {deliveryAddress}
            </p>
            <p>
              <strong>Payment Method:</strong> {paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}
            </p>
            <p>
              <strong>Order Total:</strong> ${finalTotal.toFixed(2)}
            </p>
            {appliedVoucher && (
              <p>
                <strong>Discount:</strong> -${discountAmount.toFixed(2)}
              </p>
            )}
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
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          {appliedVoucher && (
            <div className="explosive-summary-row explosive-discount-row">
              <span>Discount ({appliedVoucher.code}):</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="explosive-summary-row explosive-total-row">
            <span>Total:</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        className="explosive-place-order-btn"
        onClick={handlePlaceOrder}
        disabled={!selectedBranch || !deliveryAddress || !paymentMethod || cart.length === 0}
      >
        Place Order Now
      </button>
    </div>
  );
};

export default Checkout;


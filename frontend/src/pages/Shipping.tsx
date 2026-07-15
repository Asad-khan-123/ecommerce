import { useState, useEffect } from 'react';
import { settingsApi } from '../utils/api';

const Shipping = () => {
  const [shippingFee, setShippingFee] = useState(150);
  const [shippingThreshold, setShippingThreshold] = useState(2000);

  useEffect(() => {
    const fetchShippingSettings = async () => {
      try {
        const res = await settingsApi.getSettings();
        if (res.success && res.data) {
          if (res.data.shippingFee !== undefined) {
            setShippingFee(Number(res.data.shippingFee));
          }
          if (res.data.shippingThreshold !== undefined) {
            setShippingThreshold(Number(res.data.shippingThreshold));
          }
        }
      } catch (err) {
        console.error('Error fetching shipping settings:', err);
      }
    };
    fetchShippingSettings();
  }, []);

  return (
    <div className="min-h-screen bg-white font-['Poppins'] text-[#212121]">
      <div className="mx-auto max-w-[780px] px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-[#999] font-medium mb-3">
            Customer Care
          </p>
          <h1 className="text-[28px] md:text-[36px] font-light tracking-tight text-[#212121]">
            Delivery &amp; Shipping
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-8 text-[13px] md:text-[14px] leading-relaxed text-[#666] font-light">
          <p>
            At <strong>I AM TROUBLE BY KC</strong>, we are committed to delivering your orders as quickly and securely as possible. All pieces are processed with utmost care and attention to detail.
          </p>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              1. Domestic Shipping Costs
            </h2>
            <p className="mb-3">
              We offer free standard shipping on all domestic orders across India that have a total cart value of <strong>₹{shippingThreshold.toLocaleString('en-IN')} or above</strong>.
            </p>
            <p>
              For domestic orders below ₹{shippingThreshold.toLocaleString('en-IN')}, a flat shipping and handling fee of <strong>₹{shippingFee}</strong> is charged at checkout.
            </p>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              2. Delivery Timelines
            </h2>
            <p className="mb-3">
              Because our collections feature hand-finished detailing, ready-to-wear items are typically dispatched within <strong>7 to 14 business days</strong> of order receipt.
            </p>
            <p>
              Made-To-Measure or custom items require custom fittings and pattern creation, which can extend the dispatch timeline. The customer support team will communicate your specific order timeline in such cases.
            </p>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              3. Courier and Tracking Information
            </h2>
            <p className="mb-3">
              All orders are shipped via reputed, insured domestic courier agencies.
            </p>
            <p>
              Once your shipment has been handed over to the courier partner, we will email you a tracking confirmation link. You can also trace your package status in the customer dashboard under the <strong>My Orders</strong> section.
            </p>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              4. Damaged Packages
            </h2>
            <p>
              If you receive a package that appears damaged, opened, or tampered with during transit, we advise you <strong>not to accept the delivery</strong>. Please photograph the package and contact our customer support team immediately at <a href="mailto:cc@iamtroublebykc.com" className="underline underline-offset-4 hover:opacity-70 text-[#212121]">cc@iamtroublebykc.com</a> or via phone/WhatsApp.
            </p>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              5. Shipping Address Modifications
            </h2>
            <p>
              If you need to change your delivery address after placing an order, please email us within <strong>24 hours</strong> of purchase. Address modifications cannot be made once an order has been dispatched.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;

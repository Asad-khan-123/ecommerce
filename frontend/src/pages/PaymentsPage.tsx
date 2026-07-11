const PaymentsPage = () => {
  return (
    <div className="min-h-screen bg-white font-['Poppins'] text-[#212121]">
      <div className="mx-auto max-w-[780px] px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-[#999] font-medium mb-3">
            Customer Care
          </p>
          <h1 className="text-[28px] md:text-[36px] font-light tracking-tight text-[#212121]">
            Payments
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-8 text-[13px] md:text-[14px] leading-relaxed text-[#666] font-light">
          <p>
            At <strong>I AM TROUBLE BY KC</strong>, we offer safe, secure, and seamless payment options for all our customers. All online transactions are processed through encrypted security systems.
          </p>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              1. Accepted Payment Methods
            </h2>
            <p className="mb-3">
              Through our secure payment gateway partner, Razorpay, we accept the following payment options:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>All major Credit &amp; Debit cards (Visa, Mastercard, American Express, RuPay).</li>
              <li>UPI payments (Google Pay, PhonePe, Paytm, BHIM, etc.).</li>
              <li>Netbanking across major banks.</li>
              <li>Popular mobile wallets.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              2. Transaction Security
            </h2>
            <p>
              Your payment information is fully protected. Our checkout processes are secured with 256-bit SSL encryption. <strong>I AM TROUBLE BY KC does not store, record, or access your credit card numbers, passwords, or netbanking credentials.</strong>
            </p>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              3. Payment Failures &amp; Double Deductions
            </h2>
            <p className="mb-3">
              If your net banking or card transaction fails but the amount has been debited from your account:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The bank typically rolls back the transaction and returns the funds to your account within <strong>7 business days</strong> automatically.</li>
              <li>If the payment has cleared from your bank but is not reflected in your order list, please email our support team at <a href="mailto:cc@iamtroublebykc.com" className="underline underline-offset-4 hover:opacity-70 text-[#212121]">cc@iamtroublebykc.com</a> with your transaction details and order estimate. We will check the gateway logs and resolve it immediately.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              4. Prices and Billing
            </h2>
            <p>
              All prices displayed on the store are in Indian Rupees (INR). GST and taxes are computed in compliance with local regulations and displayed itemized at the checkout screen before final payments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;

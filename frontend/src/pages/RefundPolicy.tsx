const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-white font-['Poppins'] text-[#212121]">
      <div className="mx-auto max-w-[780px] px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-[#999] font-medium mb-3">
            Customer Care
          </p>
          <h1 className="text-[28px] md:text-[36px] font-light tracking-tight text-[#212121]">
            Refund Policy
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-8 text-[13px] md:text-[14px] leading-relaxed text-[#666] font-light">
          <p>
            Thank you for shopping at <strong>I AM TROUBLE BY KC</strong>. We strive to provide premium clothing and want you to be completely satisfied with your purchase.
          </p>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              1. Return Window
            </h2>
            <p>
              If you wish to return a purchase, return requests must be submitted to our customer care team within <strong>2 days of receiving your order</strong>. Returns requested outside of this 2-day period will not be eligible.
            </p>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              2. Quality Control (QC) Requirements
            </h2>
            <p className="mb-3">
              All returned items must undergo a strict quality control inspection before a return is finalized.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Items must be completely unused, unwashed, and in their original pristine condition.</li>
              <li>All original brand tags, labels, and packaging materials must be intact and attached.</li>
              <li>Any item showing signs of wear, dry-cleaning, alteration, or damage will be sent back to the customer and cannot be returned.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              3. Refund Format (Store Credit Only)
            </h2>
            <p className="mb-3">
              Please note that <strong>refunds are issued in the form of store credit only</strong>. We do not provide cash or card reversals.
            </p>
            <p>
              Once your return passes the quality control check, the credit will be applied directly to your account. This store credit will be valid for 1 year and can be used on your next purchase at our online store.
            </p>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              4. Taxes and Surcharges
            </h2>
            <p className="mb-3">
              In the event of a cancellation or complete order return, the entire price paid, including collected GST taxes, will be refunded to your store credit balance.
            </p>
            <p>
              Please note that shipping charges and Cash-On-Delivery convenience fees (if applicable) are non-refundable.
            </p>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              5. How to Initiate a Return
            </h2>
            <p>
              To request a return, please email your order ID and item details to our support team at <a href="mailto:cc@iamtroublebykc.com" className="underline underline-offset-4 hover:opacity-70 text-[#212121]">cc@iamtroublebykc.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;

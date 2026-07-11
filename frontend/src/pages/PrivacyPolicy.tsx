const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white font-['Poppins'] text-[#212121]">
      <div className="mx-auto max-w-[780px] px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-[#999] font-medium mb-3">
            Legal
          </p>
          <h1 className="text-[28px] md:text-[36px] font-light tracking-tight text-[#212121]">
            Privacy Policy
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-8 text-[13px] md:text-[14px] leading-relaxed text-[#666] font-light">
          <p>
            This Privacy Policy describes how <strong>I AM TROUBLE BY KC</strong> (the &quot;Site&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and discloses your Personal Information when you visit or make a purchase from the Site.
          </p>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              1. Information We Collect
            </h2>
            <p className="mb-3">
              When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Device Information:</strong> We automatically collect details about your web browser, IP address, time zone, cookies, and what pages or products you view to optimize site performance and analytics.
              </li>
              <li>
                <strong>Order Information:</strong> We collect your name, billing address, shipping address, payment confirmation details, email address, and phone number to process transaction payments, arrange shipment, and provide invoices or order confirmations.
              </li>
              <li>
                <strong>Customer Support Information:</strong> We collect any information you choose to provide (such as event interests, design preferences, or order queries) when communicating with our support team.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              2. Payments and Billing Security
            </h2>
            <p>
              Your payment security is important to us. All transaction payments are processed through secure, encrypted online payment partners. <strong>I AM TROUBLE BY KC does not collect, store, or have access to your credit card numbers, CVV codes, or expiry details.</strong>
            </p>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              3. How We Use Personal Information
            </h2>
            <p className="mb-3">
              We use your personal Information to provide our services to you, which includes: offering products for sale, processing payments, shipping and fulfillment of your order, and keeping you up to date on new products, services, and offers.
            </p>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              4. Disclosure of Personal Information
            </h2>
            <p>
              We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you, as described above. We may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
            </p>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              5. Cookies and Tracking
            </h2>
            <p>
              A cookie is a small amount of information that’s downloaded to your computer or device when you visit our Site. Cookies make your browsing experience better by allowing the website to remember your actions and preferences (such as login and cart details). You can control and manage cookies through your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              6. Your Rights
            </h2>
            <p>
              Under certain privacy regulations (including local guidelines), you have the right to access the Personal Information we hold about you, to port it to a new service, and to ask that your Personal Information be corrected, updated, or erased. If you would like to exercise these rights, please contact us through the contact information below.
            </p>
          </div>

          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
              7. Contact Us
            </h2>
            <p className="mb-3">
              For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail or post using the details provided below:
            </p>
            <address className="not-italic text-[13px] text-[#666] leading-relaxed pl-4 border-l-2 border-[#E8E8E8]">
              <strong>EVOLVE CLOTHING & TEXTILES</strong><br />
              Business Registration (GST): 07AGVPC8741P3ZH<br />
              B 115 B, Opposite South Park Apartments,<br />
              Kalkaji, New Delhi — 110019<br />
              Email: <a href="mailto:cc@iamtroublebykc.com" className="underline underline-offset-4 hover:opacity-70 text-[#212121]">cc@iamtroublebykc.com</a><br />
              Phone / WhatsApp: <a href="tel:+919599022295" className="underline underline-offset-4 hover:opacity-70 text-[#212121]">+91 9599022295</a>, <a href="tel:+918076888249" className="underline underline-offset-4 hover:opacity-70 text-[#212121]">+91 8076888249</a>
            </address>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

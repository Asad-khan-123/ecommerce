import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FaqSection {
  heading: string;
  items: FaqItem[];
}

const faqData: FaqSection[] = [
  {
    heading: 'Ordering',
    items: [
      {
        question: 'What if I have trouble placing an order online?',
        answer: (
          <>
            You can place an order over the phone or via WhatsApp at{' '}
            <a href="tel:+919599022295" className="underline underline-offset-4 hover:opacity-70 transition-opacity font-normal text-[#212121]">
              +91 9599022295
            </a>{' '}
            or{' '}
            <a href="tel:+918076888249" className="underline underline-offset-4 hover:opacity-70 transition-opacity font-normal text-[#212121]">
              +91 8076888249
            </a>
            . We are available Monday – Saturday, 11:00 am to 6:00 pm (excluding national holidays).
          </>
        ),
      },
      {
        question: 'How are my orders delivered?',
        answer:
          'All orders are delivered via reputed courier companies. You will receive a tracking link once your order has been dispatched.',
      },
      {
        question: 'Can I add an item to an order I have already placed?',
        answer:
          'If you wish to add an item to an order that has already been placed, we suggest simply placing a new, separate order.',
      },
    ],
  },
  {
    heading: 'Payments',
    items: [
      {
        question: 'What payment methods are accepted?',
        answer:
          'We accept all major credit and debit cards including VISA, Mastercard, and American Express, as well as other payment gateways as specified in our terms.',
      },
      {
        question: 'My card or net banking transaction failed. What should I do?',
        answer: (
          <>
            <p className="mb-3">Please check the following:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Ensure your internet connection is stable and all information (billing address, card details, etc.) is accurate.</li>
              <li>
                If your account was debited but the order was unsuccessful, the bank typically rolls back the funds within{' '}
                <strong>7 business days</strong>.
              </li>
              <li>
                If the payment was cleared by your bank but is not reflected in your order, please contact us at{' '}
                <a href="mailto:cc@iamtroublebykc.com" className="underline underline-offset-4 hover:opacity-70 transition-opacity font-normal text-[#212121]">
                  cc@iamtroublebykc.com
                </a>{' '}
                with your order details and we will resolve it promptly.
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    heading: 'Returns & Refunds',
    items: [
      {
        question: 'What is your return policy?',
        answer:
          'Returns must be requested within 2 days of receiving your order. Please contact our customer care team to initiate a return.',
      },
      {
        question: 'How are returns processed?',
        answer:
          'Once we receive your returned item, it must pass an internal quality control (QC) check before a refund can be processed. Please ensure the item is unused, unwashed, and in its original packaging with all tags intact.',
      },
      {
        question: 'In what form are refunds issued?',
        answer:
          'Refunds are issued in the form of store credit only. The credit will be added to your account and can be used on your next purchase.',
      },
      {
        question: 'Are taxes refunded in the event of a return or cancellation?',
        answer:
          'Yes — in the event of a return or cancellation, the entire amount paid including collected taxes is refunded. Please note that COD convenience charges are generally not refunded.',
      },
    ],
  },
];

const AccordionItem = ({ item }: { item: FaqItem }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#E8E8E8] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left group transition-colors duration-200"
        aria-expanded={open}
      >
        <span className="text-[13px] md:text-[14px] font-normal text-[#212121] group-hover:text-[#777] pr-8 leading-snug transition-colors duration-200">
          {item.question}
        </span>
        <div className="relative w-3 h-3 flex-shrink-0 flex items-center justify-center text-[#212121] group-hover:text-[#777] transition-colors duration-200">
          {/* Horizontal line */}
          <span className="absolute w-3 h-[1px] bg-current" />
          {/* Vertical line that rotates and shrinks when open */}
          <span
            className={`absolute w-3 h-[1px] bg-current transition-all duration-300 ease-in-out rotate-90 ${
              open ? 'rotate-180 scale-0 opacity-0' : ''
            }`}
          />
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-6 text-[13px] md:text-[14px] leading-relaxed text-[#666] font-light">
            {item.answer}
          </div>
        </div>
      </div>
    </div>
  );
};

const Faq = () => {
  return (
    <div className="min-h-screen bg-white font-['Poppins'] text-[#212121]">
      <div className="mx-auto max-w-[1100px] px-6 py-16 md:py-24">
        {/* Page Header */}
        <div className="text-center mb-16 md:mb-24">
          <p className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-[#999] font-medium mb-3">
            Help &amp; Support
          </p>
          <h1 className="text-[28px] md:text-[36px] font-light tracking-tight text-[#212121]">
            Frequently Asked Questions
          </h1>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-0">
          {faqData.map((section) => (
            <div
              key={section.heading}
              className="border-t border-[#E8E8E8] py-8 md:py-12 md:grid md:grid-cols-[220px_1fr] md:gap-10"
            >
              {/* Left Column: Heading */}
              <div className="mb-6 md:mb-0">
                <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121]">
                  {section.heading}
                </h2>
              </div>

              {/* Right Column: Accordions list */}
              <div className="space-y-0">
                {section.items.map((item) => (
                  <AccordionItem key={item.question} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA section */}
        <div className="mt-20 border-t border-[#E8E8E8] pt-12 text-center">
          <h3 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-4">
            Still have questions?
          </h3>
          <p className="text-[13px] text-[#666] leading-relaxed max-w-lg mx-auto font-light">
            You can place an order over the phone or via WhatsApp at{' '}
            <a href="tel:+919599022295" className="text-[#212121] underline underline-offset-4 hover:opacity-70 transition-opacity font-normal">
              +91 9599022295
            </a>{' '}
            or{' '}
            <a href="tel:+918076888249" className="text-[#212121] underline underline-offset-4 hover:opacity-70 transition-opacity font-normal">
              +91 8076888249
            </a>
            . Alternatively, email us at{' '}
            <a href="mailto:cc@iamtroublebykc.com" className="text-[#212121] underline underline-offset-4 hover:opacity-70 transition-opacity font-normal">
              cc@iamtroublebykc.com
            </a>
            . We are available Monday – Saturday, 11:00 am to 6:00 pm (excluding national holidays).
          </p>
        </div>
      </div>
    </div>
  );
};

export default Faq;

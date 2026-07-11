import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }
    setSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white font-['Poppins'] text-[#212121]">
      <div className="mx-auto max-w-[780px] px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-[#999] font-medium mb-3">
            Get In Touch
          </p>
          <h1 className="text-[28px] md:text-[36px] font-light tracking-tight text-[#212121]">
            Contact Us
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[13px] md:text-[14px] leading-relaxed text-[#666] font-light">
          {/* Left Column: Details */}
          <div className="space-y-8">
            <div>
              <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
                Main Office
              </h2>
              <address className="not-italic text-[13px] md:text-[14px] leading-relaxed">
                B 115 B, OPPOSITE SOUTH PARK APARTMENTS,<br />
                KALKAJI, NEW DELHI 110019<br />
                INDIA
              </address>
            </div>

            <div>
              <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
                Customer Support
              </h2>
              <p className="mb-2">
                <strong>Email:</strong>{' '}
                <a href="mailto:cc@iamtroublebykc.com" className="underline underline-offset-4 hover:opacity-70 text-[#212121]">
                  cc@iamtroublebykc.com
                </a>
              </p>
              <p>
                <strong>Call / WhatsApp:</strong>{' '}
                <a href="tel:+919599022295" className="underline underline-offset-4 hover:opacity-70 text-[#212121]">
                  +91 9599022295
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-3">
                Business Hours
              </h2>
              <p>Monday – Saturday: 10:00 AM – 7:00 PM IST</p>
            </div>
          </div>

          {/* Right Column: Form */}
          <div>
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-6">
              Send A Message
            </h2>

            {submitted ? (
              <div className="bg-[#F9F9F9] border border-[#E8E8E8] p-6 text-center">
                <p className="text-[13px] text-[#212121] font-medium mb-2">Message Sent Successfully</p>
                <p className="text-[12px] text-[#888]">Thank you for reaching out. We will get back to you shortly.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-[11px] uppercase tracking-wider underline underline-offset-4 hover:opacity-70 text-[#212121]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-[11px] uppercase tracking-wider text-[#212121] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#E8E8E8] focus:border-[#212121] outline-none text-[13px] bg-transparent transition-colors font-light"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[11px] uppercase tracking-wider text-[#212121] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#E8E8E8] focus:border-[#212121] outline-none text-[13px] bg-transparent transition-colors font-light"
                    placeholder="Your email"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[11px] uppercase tracking-wider text-[#212121] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-[#E8E8E8] focus:border-[#212121] outline-none text-[13px] bg-transparent transition-colors font-light resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#212121] hover:bg-neutral-800 text-white uppercase text-[11px] font-medium tracking-widest transition-colors duration-300 disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

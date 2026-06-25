import { Link } from 'react-router-dom';
// FC import hata diya

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const companyLinks: FooterLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Our Story', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Subscribe', href: '/subscribe' },
];

const customerCareLinks: FooterLink[] = [
  { label: 'FAQs', href: '/faq' },
  { label: 'Delivery & Shipping', href: '/shipping' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Payments', href: '/payments' },
  { label: 'Privacy Policy', href: '/policies/privacy-policy' },
  { label: 'Terms of Service', href: '/policies/terms-of-service' },
  { label: 'Inquiries', href: '/inquiries' },
];

const contactLinks: FooterLink[] = [
  { label: 'Call / WhatsApp: +91 9599022295', href: 'tel:+919599022295', external: true },
  { label: 'Email: cc@iamtroublebykc.com', href: 'mailto:cc@iamtroublebykc.com', external: true },
  { label: 'Chat on WhatsApp', href: 'https://wa.me/919599022295', external: true },
];

// FC type hata diya, direct arrow function
const Footer = () => {
  return (
    <footer
      className="w-full bg-[#F7F7F7] font-['Poppins'] text-[#212121] text-[14.4px] pt-[70px] pb-7"
      role="contentinfo"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 gap-x-8 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          
          {/* About Us Column */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="mb-5 text-[14.4px] font-medium text-[#212121]">About Us</h3>
            <p className="my-[7.2px] text-[14.4px] leading-relaxed text-[#212121]">
              I AM TROUBLE BY KC is a Delhi-based RTW and Made-To-Measure fashion label founded by
              Kunal Chatterjee in 2015. Our collections are notoriously colourful, bold, and exude an
              element of quirk — drawn from high street referencing with a directional vision, not trends.
            </p>

            <h4 className="mb-2.5 mt-5 text-[14.4px] font-medium text-[#212121]">Main Office</h4>
            <address className="not-italic text-[14.4px] leading-relaxed text-[#212121]">
              B 115 B, Opposite South Park Apartments,<br />
              Kalkaji, New Delhi — 110019
            </address>
          </div>

          {/* Our Company Column */}
          <div>
            <h3 className="mb-5 text-[14.4px] font-medium text-[#212121]">Our Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="inline-block text-[14.4px] text-[#212121] hover:underline hover:decoration-black hover:underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h3 className="mb-5 text-[14.4px] font-medium text-[#212121]">Customer Care</h3>
            <ul className="space-y-3">
              {customerCareLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="inline-block text-[14.4px] text-[#212121] hover:underline hover:decoration-black hover:underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch Column */}
          <div>
            <h3 className="mb-5 text-[14.4px] font-medium text-[#212121]">Get In Touch</h3>
            <ul className="space-y-3">
              {contactLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external? '_blank' : undefined}
                    rel={link.external? 'noreferrer' : undefined}
                    className="inline-block text-[14.4px] leading-relaxed text-[#212121] hover:underline hover:decoration-black hover:underline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
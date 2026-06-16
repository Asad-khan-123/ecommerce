import { Link } from 'react-router-dom';
// FC import hata diya

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const companyLinks: FooterLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Shweta Kapur', href: '/shweta-kapur' },
  { label: 'Tribe-88', href: '/tribe-88' },
  { label: 'Stockists', href: '/stockists' },
  { label: 'Subscribe', href: '/subscribe' },
  { label: 'Contact', href: '/contact' },
];

const customerCareLinks: FooterLink[] = [
  { label: 'FAQs', href: '/faqs' },
  { label: 'Delivery or Shipping', href: '/shipping' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Payments', href: '/payments' },
  { label: 'Inquiries', href: '/inquiries' },
];

const contactLinks: FooterLink[] = [
  { label: 'Call us at +918512843188', href: 'tel:+918512843188', external: true },
  { label: 'Email customercare@431-88.com', href: 'mailto:customercare@431-88.com', external: true },
  { label: 'Chat on Whatsapp', href: 'https://wa.me/918512843188', external: true },
];

// FC type hata diya, direct arrow function
const Footer = () => {
  return (
    <footer
      className="w-full bg-[#F7F7F7] font-['Poppins'] text-[#212121] text-[14.4px] pt- pb-7"
      role="contentinfo"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 gap-x-8 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          
          {/* About Us Column */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="mb-5 text-[14.4px] font-medium text-[#212121]">About Us</h3>
            <p className="my-[7.2px] text-[14.4px] leading-relaxed text-[#212121]">
              431-88 is a contemporary Indian design label founded by Shweta Kapur. Based in New Delhi,
              the brand creates modern womenswear shaped by clarity, structure, and ease —
              spanning saris, bridal and occasion wear, everyday essentials, accessories, and
              menswear for contemporary life.
            </p>

            <h4 className="mb-2.5 mt-5 text-[14.4px] font-medium text-[#212121]">Main Office</h4>
            <address className="not-italic text-[14.4px] leading-relaxed text-[#212121]">
              Shwetambara Enterprises<br />
              No. 38, 1st Floor, Sector 27/A,<br />
              Faridabad Haryana — 121003
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
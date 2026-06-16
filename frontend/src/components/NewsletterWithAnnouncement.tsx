import { useState, useEffect, useRef, type FormEvent } from 'react';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

const announcements = [
  'Tailored Fits & Custom Orders',
  'Free Shipping on Domestic Orders',
  'Connect with us on Whatsapp',
];

const NewsletterWithAnnouncement = () => {
  const [email, setEmail] = useState('');
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Moving strip ke liye
  useEffect(() => {
    if (!scrollerRef.current) return;
    scrollerRef.current.innerHTML += scrollerRef.current.innerHTML;
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Baad mein yaha API call lagegi
    console.log('Email submitted:', email);
    setEmail('');
    alert('Subscribed! Baad mein email bhejne ka system lagayenge');
  };

  return (
    <section className="w-full font-['Poppins'] text-[#212121]">
      {/* Moving Announcement Strip */}
      <div className="w-full overflow-hidden bg-[#1a1a1a] py-2.5">
        <div
          ref={scrollerRef}
          className="flex w-max animate-scroll gap-x-12 text- text-white"
        >
          {announcements.map((text, i) => (
            <span key={i} className="whitespace-nowrap">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Join the Tribe Newsletter */}
      <div className="w-full bg-[#F9F9F9]">
        <div className="mx-auto max-w-[860px] px-4 pt-12 pb-20 text-center">
          
          {/* Heading */}
          <h2 className="mb-4 text- font-normal text-[#212121]">
            Join the Tribe
          </h2>

          {/* Subtext */}
          <p className="mb-8 text- text-[#212121]">
            Subscribe to get announcements, collection updates and special offers.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="mx-auto max-w-[500px]">
            <div className="flex items-center border-b border-[#212121]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full bg-transparent py-2 text- text-[#212121] placeholder:text-[#212121]/70 focus:outline-none"
              />
              <button
                type="submit"
                className="py-2 pl-4 text- font-medium text-[#212121] hover:underline hover:decoration-black hover:underline-offset-4"
              >
                JOIN
              </button>
            </div>
          </form>

          {/* Social Icons */}
          <div className="mt-8 flex items-center justify-center gap-x-6">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram size={18} className="text-[#212121]" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <FaFacebookF size={18} className="text-[#212121]" />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
              <FaTwitter size={16} className="text-[#212121]" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsletterWithAnnouncement;
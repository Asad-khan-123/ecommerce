const About = () => {
  return (
    <div className="min-h-screen bg-white font-['Poppins'] text-[#212121]">
      <div className="mx-auto max-w-[1100px] px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-[#999] font-medium mb-3">
            The Label
          </p>
          <h1 className="text-[28px] md:text-[36px] font-light tracking-tight text-[#212121]">
            About Us
          </h1>
        </div>

        {/* Content Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          {/* Left Column: Image */}
          <div className="md:col-span-6 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200"
              alt="I AM TROUBLE BY KC Atelier"
              className="w-full h-auto object-cover aspect-[3/4] border border-[#E8E8E8] shadow-sm hover:scale-[1.02] transition-transform duration-500"
            />
          </div>

          {/* Right Column: Copy */}
          <div className="md:col-span-6 space-y-6">
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121]">
              The Brand
            </h2>
            <p className="text-[13px] md:text-[14px] leading-relaxed text-[#666] font-light">
              Label <strong>I AM TROUBLE BY KC</strong> is a New Delhi (India) based RTW  and Made To Measure fashion label founded by <strong>Kunal Chatterjee</strong> in the year 2015.
            </p>
            <p className="text-[13px] md:text-[14px] leading-relaxed text-[#666] font-light">
              The label curates collections from expression of self-experiences in the journey of life. workmanship of this label are notoriously colourful, bold, and exude an element of quirk.
            </p>
            <p className="text-[13px] md:text-[14px] leading-relaxed text-[#666] font-light">
              Our design philosophy is not trend-driven, but focused on a directional vision that draws from high street referencing.
            </p>
          </div>
        </div>

        {/* Highlight Callout Quote Block */}
        <div className="mt-20 border-t border-b border-[#E8E8E8] py-12 md:py-16 text-center">
          <blockquote className="max-w-2xl mx-auto">
            <p className="text-[16px] md:text-[20px] font-light italic leading-relaxed text-[#212121] mb-4">
              &ldquo;I Am Trouble has always been the spirit of the brand. Now, as the label evolves, every I Am Trouble piece carries the signature of its creator &ndash; Kunal Chatterjee.&rdquo;
            </p>
          </blockquote>
        </div>

        {/* Operating info / Contact links */}
        <div className="mt-16 text-center max-w-md mx-auto">
          <h3 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#212121] mb-4">
            Visit Our Main Office
          </h3>
          <p className="text-[13px] text-[#666] leading-relaxed font-light mb-6">
            B 115 B, Opposite South Park Apartments,<br />
            Kalkaji, New Delhi &mdash; 110019
          </p>
          <div className="h-px bg-[#E8E8E8] w-12 mx-auto mb-6" />
          <p className="text-[13px] text-[#666] leading-relaxed font-light">
            Have questions or want custom fittings? Contact us at{' '}
            <a href="mailto:cc@iamtroublebykc.com" className="text-[#212121] underline underline-offset-4 hover:opacity-75 transition-opacity font-normal">
              cc@iamtroublebykc.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

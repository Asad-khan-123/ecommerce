import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import RecentlyViewed from '../components/RecentlyViewed';
import { bannerApi, settingsApi } from '../utils/api';
import { useState } from 'react';

const Home = () => {
  const { products, loading, error, fetchProducts } = useProducts();
  const [activeBanner, setActiveBanner] = useState<any>(null);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [brandVideos, setBrandVideos] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts({ limit: 4 });
    const fetchBanner = async () => {
      try {
        const res = await bannerApi.getActiveBanner();
        if (res.success && res.data) {
          setActiveBanner(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch banner', err);
      }
    };
    const fetchHighlights = async () => {
      try {
        const res = await bannerApi.getHighlights();
        if (res.success && res.data) {
          setHighlights(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch highlights', err);
      }
    };
    const fetchSettings = async () => {
      try {
        const res = await settingsApi.getSettings();
        if (res.success && res.data) {
          if (res.data.brandVideos) {
            try {
              const parsed = JSON.parse(res.data.brandVideos);
              setBrandVideos(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
              setBrandVideos([]);
            }
          } else {
            const legacy = [];
            if (res.data.brandPhotoshootVideo) legacy.push({ id: '1', title: '', videoUrl: res.data.brandPhotoshootVideo });
            if (res.data.promotionalReelVideo) legacy.push({ id: '2', title: '', videoUrl: res.data.promotionalReelVideo });
            setBrandVideos(legacy);
          }
        }
      } catch (err) {
        console.error('Failed to fetch brand videos', err);
      }
    };
    fetchBanner();
    fetchHighlights();
    fetchSettings();
  }, [fetchProducts]);

  const renderVideoPlayer = (url: string, title?: string) => {
    if (!url) return null;

    const isEmbed = url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');

    if (isEmbed) {
      let embedUrl = url;
      if (url.includes('watch?v=')) {
        embedUrl = url.replace('watch?v=', 'embed/');
      } else if (url.includes('youtu.be/')) {
        embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
      }
      return (
        <div className="aspect-video w-full">
          <iframe
            src={embedUrl}
            title={title || 'Brand Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg shadow-sm"
          />
        </div>
      );
    }

    return (
      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-sm">
        <video
          src={url}
          controls
          playsInline
          loop
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-['Poppins']">

      {/* ── Hero Banner ── */}
      {activeBanner ? (
        <section className="relative w-full">
          {activeBanner.link ? (
            <div className="relative group w-full">
              <Link to={`/${activeBanner.link}`} className="block w-full">
                <picture className="block w-full aspect-[4/5] md:aspect-[21/9] overflow-hidden bg-[#F5F5F5]">
                  <source media="(max-width: 768px)" srcSet={activeBanner.mobileImage} />
                  <img 
                    src={activeBanner.desktopImage} 
                    alt="Hero Banner" 
                    fetchPriority="high"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </picture>
              </Link>
              {/* Overlay Button */}
              <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 z-10">
                <Link
                  to={`/${activeBanner.link}`}
                  className="inline-block bg-white hover:bg-[#212121] text-[#212121] hover:text-white border border-[#212121]/10 px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase font-semibold transition-all duration-300 shadow-md hover:shadow-lg rounded"
                >
                  Latest Collection
                </Link>
              </div>
            </div>
          ) : (
            <picture className="block w-full aspect-[4/5] md:aspect-[21/9] overflow-hidden bg-[#F5F5F5]">
              <source media="(max-width: 768px)" srcSet={activeBanner.mobileImage} />
              <img 
                src={activeBanner.desktopImage} 
                alt="Hero Banner" 
                fetchPriority="high"
                loading="eager"
                className="w-full h-full object-cover"
              />
            </picture>
          )}
        </section>
      ) : (
        <section className="relative flex h-[70vh] min-h-[480px] items-end overflow-hidden bg-[#1A1A1A]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 80px), repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 80px)',
            }}
          />
          <div className="relative z-10 w-full px-8 pb-16 text-white max-w-[1440px] mx-auto">
            <p className="mb-2 text-[10px] tracking-[0.35em] uppercase text-white/60">
              New Collection — SS26
            </p>
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.05] tracking-tight">
              Defined by Detail.
              <br />
              <em className="italic">Worn by Few.</em>
            </h1>
            <div className="mt-8 flex items-center gap-6">
              <a
                href="#products"
                className="inline-block border border-white px-8 py-3 text-[11px] tracking-[0.2em] uppercase text-white transition-colors hover:bg-white hover:text-[#212121]"
              >
                Shop Now
              </a>
              <Link
                to="/products"
                className="text-[11px] tracking-[0.15em] uppercase text-white/70 underline underline-offset-4 hover:text-white"
              >
                Explore All →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Marquee Ticker ── */}
      <div className="overflow-hidden border-y border-[#E8E8E8] bg-white py-3">
        <div
          className="flex gap-16 whitespace-nowrap text-[10px] tracking-[0.3em] uppercase text-[#999]"
          style={{ animation: 'marquee 25s linear infinite' }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>
              Free Shipping Available &nbsp;·&nbsp; RTW &amp; Made-To-Measure &nbsp;·&nbsp; I AM TROUBLE BY KC &nbsp;·&nbsp; New Delhi, India
            </span>
          ))}
        </div>
      </div>

      {/* ── Product Grid - Zero Gap 431-88 Style ── */}
      <section id="products" className="w-full">

        {loading && (
          <div className="grid grid-cols-2 gap-0 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse bg-[#F5F5F5]" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center py-24 text-center px-8">
            <p className="text-[12px] text-[#999]">{error}</p>
            <button
              onClick={() => fetchProducts({ limit: 4 })}
              className="mt-6 border border-[#212121] px-6 py-2 text-[11px] tracking-widest uppercase text-[#212121] hover:bg-[#212121] hover:text-white transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center py-24 text-center px-8">
            <div className="mb-6 text-[40px] opacity-20">◻</div>
            <p className="text-[12px] tracking-widest uppercase text-[#999]">No Products Yet</p>
            <p className="mt-2 text-[11px] text-[#BDBDBD]">Check back soon — new arrivals are on their way.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            {/* 4 Products Grid */}
            <div className="grid grid-cols-2 gap-0 lg:grid-cols-4 bg-white">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* VIEW ALL Button */}
            <div className="flex justify-center py-16 bg-white">
              <Link
                to="/products"
                className="bg-[#2D2D2D] px-12 py-3.5 text-[11px] text-white tracking-[0.2em] uppercase hover:bg-black transition-colors"
              >
                VIEW ALL
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ── Collection Cards Grid ── */}
      {highlights.length > 0 && (
        <section className="px-8 pb-24 max-w-[1440px] mx-auto bg-white">
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
            {highlights.map((hl) => (
              <Link
                key={hl._id}
                to={hl.link}
                className="group relative block w-full max-w-[502px] aspect-[502/547] md:w-[502px] md:h-[547px] overflow-hidden bg-neutral-100 shadow-sm"
              >
                <img
                  src={hl.imageUrl}
                  alt={hl.label}
                  className="w-full h-full object-cover object-top origin-top transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                <span className="absolute left-8 top-8 text-white uppercase text-[11px] font-semibold tracking-[0.2em]">
                  {hl.label}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Brand Media Section */}
{brandVideos.filter(v => v.videoUrl).length > 0 && (
  <section className="max-w-[1440px] mx-auto px-8 py-16 bg-white">
    <div className="text-center mb-10">
      <p className="text-[10px] tracking-[0.35em] uppercase text-[#999] mb-1">Visual Experience</p>
      <h2 className="text-2xl font-light tracking-tight text-[#212121]">Brand Media</h2>
    </div>
    <div className={`grid grid-cols-1 ${brandVideos.filter(v => v.videoUrl).length === 1 ? 'max-w-2xl mx-auto' : brandVideos.filter(v => v.videoUrl).length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
      {brandVideos.filter(v => v.videoUrl).map((vid, i) => (
        <div key={vid.id || i}>
          {vid.title && (
            <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-700 mb-3 text-center md:text-left">{vid.title}</h3>
          )}
          {renderVideoPlayer(vid.videoUrl, vid.title)}
        </div>
      ))}
    </div>
  </section>
)}

{/* ── Editorial Strip ── */}
      <section className="bg-[#1A1A1A] px-8 py-20 text-center text-white">
        <p className="mb-3 text-[10px] tracking-[0.4em] uppercase text-white/40">Founder's Philosophy</p>
        <p className="mx-auto max-w-xl text-[clamp(1.1rem,2.5vw,1.6rem)] font-light leading-relaxed text-white/80">
          "I Am Trouble has always been the spirit of the brand.
          <br />
          As the label evolves Every I AM TROUBLE piece carries the signature of its creator."
        </p>
      </section>

      {/* Recently Viewed Products */}
      <RecentlyViewed />

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Home;
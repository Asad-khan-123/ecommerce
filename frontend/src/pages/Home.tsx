import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const SKELETON_COUNT = 4;

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="aspect-[3/4] bg-[#EBEBEB]" />
    <div className="mt-3 space-y-2">
      <div className="h-3 w-3/4 rounded bg-[#E0E0E0]" />
      <div className="h-3 w-1/3 rounded bg-[#E0E0E0]" />
    </div>
  </div>
);

const Home = () => {
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts({ limit: 4 });
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-white font-['Poppins']">

      {/* ── Hero Banner ── */}
      <section className="relative flex h- min-h-[480px] items-end overflow-hidden bg-[#1A1A1A]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 80px), repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 80px)',
          }}
        />
        <div className="relative z-10 w-full px-8 pb-16 text-white max-w-[1440px] mx-auto">
          <p className="mb-2 text- tracking-[0.35em] uppercase text-white/60">
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
              className="inline-block border border-white px-8 py-3 text- tracking-[0.2em] uppercase text-white transition-colors hover:bg-white hover:text-[#212121]"
            >
              Shop Now
            </a>
            <a
              href="/products"
              className="text- tracking-[0.15em] uppercase text-white/70 underline underline-offset-4 hover:text-white"
            >
              Explore All →
            </a>
          </div>
        </div>
      </section>

      {/* ── Marquee Ticker ── */}
      <div className="overflow-hidden border-y border-[#E8E8E8] bg-white py-3">
        <div
          className="flex gap-16 whitespace-nowrap text- tracking-[0.3em] uppercase text-[#999]"
          style={{ animation: 'marquee 25s linear infinite' }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>
              Free Shipping on Orders Over $150 &nbsp;·&nbsp; New Arrivals Every Week &nbsp;·&nbsp; 431-88 Studio &nbsp;·&nbsp; Curated Essentials
            </span>
          ))}
        </div>
      </div>

      {/* ── Product Grid - 4 Cards + View All ── */}
      <section id="products" className="mx-auto max-w-[1440px] px-6 py-16 sm:px-8">

        {loading && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center py-24 text-center">
            <p className="text- text-[#999]">{error}</p>
            <button
              onClick={() => fetchProducts({ limit: 4 })}
              className="mt-6 border border-[#212121] px-6 py-2 text- tracking-widest uppercase text-[#212121] hover:bg-[#212121] hover:text-white transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading &&!error && products.length === 0 && (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="mb-6 text- opacity-20">◻</div>
            <p className="text- tracking-widest uppercase text-[#999]">No Products Yet</p>
            <p className="mt-2 text- text-[#BDBDBD]">Check back soon — new arrivals are on their way.</p>
          </div>
        )}

        {!loading &&!error && products.length > 0 && (
          <>
            {/* 4 Products in one row */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* VIEW ALL Button */}
            <div className="mt-12 flex justify-center">
              <Link
                to="/products"
                className="bg-[#2D2D2D] px-10 py-3 text- text-white tracking-[0.1em] uppercase hover:bg-black transition-colors"
              >
                VIEW ALL
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ── Editorial Strip ── */}
      <section className="bg-[#1A1A1A] px-8 py-20 text-center text-white">
        <p className="mb-3 text- tracking-[0.4em] uppercase text-white/40">The 431-88 Philosophy</p>
        <p className="mx-auto max-w-xl text-[clamp(1.1rem,2.5vw,1.6rem)] font-light leading-relaxed text-white/80">
          "Clothing is architecture for the body.
          <br />
          Every seam is a decision."
        </p>
      </section>

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
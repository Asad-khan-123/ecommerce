import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts({ limit: 4 });
  }, [fetchProducts]);


  return (
    <div className="min-h-screen bg-white font-['Poppins']">

      {/* ── Hero Banner ── */}
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
            <a
              href="/products"
              className="text-[11px] tracking-[0.15em] uppercase text-white/70 underline underline-offset-4 hover:text-white"
            >
              Explore All →
            </a>
          </div>
        </div>
      </section>

      {/* ── Marquee Ticker ── */}
      <div className="overflow-hidden border-y border-[#E8E8E8] bg-white py-3">
        <div
          className="flex gap-16 whitespace-nowrap text-[10px] tracking-[0.3em] uppercase text-[#999]"
          style={{ animation: 'marquee 25s linear infinite' }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>
              Free Shipping on Orders Over $150 &nbsp;·&nbsp; New Arrivals Every Week &nbsp;·&nbsp; 431-88 Studio &nbsp;·&nbsp; Curated Essentials
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

      {/* ── Editorial Strip ── */}
      <section className="bg-[#1A1A1A] px-8 py-20 text-center text-white">
        <p className="mb-3 text-[10px] tracking-[0.4em] uppercase text-white/40">The 431-88 Philosophy</p>
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
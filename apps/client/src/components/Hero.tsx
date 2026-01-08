import Link from "next/link";

// components/Hero.tsx
interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  showSearch?: boolean;
}

export default function Hero({ 
  title, 
  subtitle, 
  backgroundImage = '/zenhero1.avif',
  showSearch = false,
}: HeroProps) {
  return (
    <section 
      className="relative py-16 md:py-24 text-white text-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 79, 122, 0.5), rgba(10, 79, 122, 0.5)), url(${backgroundImage})`,
      }}
    >
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h1>
          <p className="text-xl mb-8">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link href="/products" className="btn btn-primary">
              Explore Products
            </Link>
            <Link href="/services" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary">
              Our Services
            </Link>
          </div>
          
          {showSearch && (
            <div className="max-w-md mx-auto mt-8">
              <div className="flex bg-white rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 px-4 py-3 text-dark outline-none"
                  aria-label="Search products"
                />
                <button className="px-6 bg-primary hover:bg-secondary transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
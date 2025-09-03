// src/app/page.tsx


export default async function Home() {

  return (
    <main className="min-h-screen bg-[var(--color-crema)]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[var(--color-morado)] to-[var(--color-rosa)] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif tracking-tight">
            Welcome to The Insspira
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Discover exclusive images with the best quality in the web
          </p>
          <button className="bg-white text-[var(--color-morado)] hover:bg-gray-100 px-8 py-3 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300">
            Explore Collection
          </button>
        </div>
      </section>


    </main>
  );
}
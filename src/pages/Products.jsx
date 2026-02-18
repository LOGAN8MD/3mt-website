function Products() {
  const categories = [
    "Drills",
    "Grinders",
    "Cutters",
    "Breakers",
    "Trimmers",
    "Routers",
    "Blades & Accessories"
  ];

  return (
    <section className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Products</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="p-6 bg-white shadow-lg rounded-lg hover:scale-105 transition">
            <h2 className="text-xl font-semibold">{cat}</h2>
            <p className="text-gray-600 mt-2">
              High-quality {cat.toLowerCase()} for all construction needs.
            </p>
            <button className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-lg shadow hover:bg-yellow-500">
              View {cat}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Products;
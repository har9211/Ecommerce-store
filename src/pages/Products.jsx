import ProductCard from "../components/ProductCard";

const products = [
  {
    id: 1,
    name: "Laptop",
    price: 50000,
    category: "Electronics"
  },
  {
    id: 2,
    name: "Phone",
    price: 25000,
    category: "Electronics"
  },
  {
    id: 3,
    name: "Headphones",
    price: 3000,
    category: "Accessories"
  }
];

function Products() {
  return (
    <main>
      <h1>Products</h1>

      <div>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </main>
  );
}

export default Products;
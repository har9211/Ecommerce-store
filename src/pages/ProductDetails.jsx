import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  return (
    <main>
      <h1>Product Details</h1>

      <p>Product ID: {id}</p>

      <p>
        Product information will come from the backend later.
      </p>
    </main>
  );
}

export default ProductDetails;
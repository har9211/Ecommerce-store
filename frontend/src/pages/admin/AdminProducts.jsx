import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../Auth.css";
import "../Checkout.css";
import "../../components/FeaturedProducts.css";
import "./Admin.css";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "Electronics",
  image: "",
  stock: "",
};

const categories = [
  "Electronics",
  "Home & Kitchen",
  "Fashion",
  "Health Care",
  "Accessories",
  "Beauty",
  "Other",
];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  };

  useEffect(loadProducts, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || "",
      stock: product.stock,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch {
      setError("Could not delete product.");
    }
  };

  return (
    <div>
      <div className="admin-content-header">
        <h3>Products ({products.length})</h3>
        <button className="admin-btn-primary" onClick={openAddForm}>
          + Add Product
        </button>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {showForm && (
        <form className="admin-form-card" onSubmit={handleSubmit}>
          <h4>{editingId ? "Edit Product" : "New Product"}</h4>

          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
            />
          </label>

          <div className="form-row">
            <label>
              Price (₹)
              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Stock
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Category
              <select name="category" value={form.category} onChange={handleChange}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Image URL (optional)
              <input name="image" value={form.image} onChange={handleChange} />
            </label>
          </div>

          <div className="admin-form-actions">
            <button type="button" className="admin-btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      )}

      {loading && <p className="status-text">Loading products...</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price.toLocaleString("en-IN")}</td>
                <td>{p.stock}</td>
                <td className="admin-table-actions">
                  <button onClick={() => openEditForm(p)}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(p._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

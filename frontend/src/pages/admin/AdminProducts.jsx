import { useEffect, useState } from "react";
import api from "../../api/axios";
import { resolveImageUrl } from "../../utils/image";
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
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

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

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/products/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, image: res.data.imageUrl }));
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
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

  // Downloads all products as a CSV file - same idea as Shopify's
  // Products -> Export. The file can be opened and edited in Excel or
  // Google Sheets, then re-imported below to bulk-update products.
  const handleExport = async () => {
    setExporting(true);
    setError("");
    try {
      const res = await api.get("/products/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products-export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Could not export products.");
    } finally {
      setExporting(false);
    }
  };

  // Uploads an edited/new CSV. Rows are matched to existing products by
  // their Handle column - matching handles get updated, new/blank handles
  // create new products. Mirrors Shopify's "Overwrite products with
  // matching handles" import behavior.
  const handleImportFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    setError("");
    setImportResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/products/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImportResult(res.data);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Import failed.");
    } finally {
      setImporting(false);
      e.target.value = ""; // allow re-selecting the same file again if needed
    }
  };

  return (
    <div>
      <div className="admin-content-header">
        <h3>Products ({products.length})</h3>
        <div className="admin-header-actions">
          <button className="admin-btn-secondary" onClick={handleExport} disabled={exporting}>
            {exporting ? "Exporting..." : "⬇ Export CSV"}
          </button>
          <label className="admin-btn-secondary admin-import-btn">
            {importing ? "Importing..." : "⬆ Import CSV"}
            <input
              type="file"
              accept=".csv"
              onChange={handleImportFile}
              disabled={importing}
              hidden
            />
          </label>
          <button className="admin-btn-primary" onClick={openAddForm}>
            + Add Product
          </button>
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {importResult && (
        <div className="import-result-banner">
          <div className="import-result-summary">
            ✅ Imported {importResult.totalRows} row(s): {importResult.created} created,{" "}
            {importResult.updated} updated
            {importResult.failed.length > 0 && `, ${importResult.failed.length} failed`}.
          </div>
          {importResult.failed.length > 0 && (
            <ul className="import-result-errors">
              {importResult.failed.map((f) => (
                <li key={f.row}>
                  Row {f.row}: {f.reason}
                </li>
              ))}
            </ul>
          )}
          <button className="import-result-dismiss" onClick={() => setImportResult(null)}>
            Dismiss
          </button>
        </div>
      )}

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
              Product Image
              <input type="file" accept="image/*" onChange={handleImageFileChange} />
              {uploading && <span className="upload-hint">Uploading...</span>}
            </label>
          </div>

          {form.image && (
            <div className="admin-image-preview">
              <img src={resolveImageUrl(form.image)} alt="Product preview" />
              <span>Preview</span>
            </div>
          )}

          <label>
            Or paste an image URL instead
            <input
              name="image"
              value={form.image.startsWith("/uploads") ? "" : form.image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>

          <div className="admin-form-actions">
            <button type="button" className="admin-btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary" disabled={saving || uploading}>
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
              <th></th>
              <th>Name</th>
              <th>Handle</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  {p.image ? (
                    <img
                      src={resolveImageUrl(p.image)}
                      alt={p.name}
                      className="admin-table-thumb"
                    />
                  ) : (
                    <div className="admin-table-thumb admin-table-thumb-placeholder">📦</div>
                  )}
                </td>
                <td>{p.name}</td>
                <td className="admin-table-subtext">{p.handle}</td>
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

import { useState } from "react";
import api from "../../api/axios";
import useCategories from "../../hooks/useCategories";
import "../Auth.css";
import "./Admin.css";

export default function AdminCategories() {
  const { categories, loading, refresh } = useCategories();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const createCategory = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/categories", { name });
      setName("");
      await refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add category.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (category) => {
    if (!window.confirm(`Delete the ${category.name} category?`)) return;
    setError("");
    try {
      await api.delete(`/categories/${category._id}`);
      await refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete category.");
    }
  };

  return (
    <div>
      <div className="admin-content-header"><h3>Categories</h3></div>
      <p className="admin-category-help">Categories are shown on the storefront and used to organize products. A category containing products cannot be deleted until those products are moved or removed.</p>
      {error && <div className="auth-error">{error}</div>}
      <form className="admin-category-create" onSubmit={createCategory}>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="New category name" maxLength="60" required />
        <button className="admin-btn-primary" type="submit" disabled={saving}>{saving ? "Adding..." : "Add category"}</button>
      </form>
      {loading ? <p className="status-text">Loading categories...</p> : (
        <div className="admin-category-list">
          {categories.length === 0 && <p className="status-text">No categories yet. Add your first category above.</p>}
          {categories.map((category) => <div className="admin-category-row" key={category._id}><span>{category.name}</span><button className="danger" onClick={() => deleteCategory(category)}>Delete</button></div>)}
        </div>
      )}
    </div>
  );
}

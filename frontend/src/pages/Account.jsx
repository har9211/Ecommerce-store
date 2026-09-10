import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import PhoneInput from "../components/PhoneInput";
import "./Account.css";

const emptyAddress = { line1: "", line2: "", city: "", state: "", postalCode: "", country: "India" };

export default function Account() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: emptyAddress, currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: { ...emptyAddress, ...(user.address || {}) },
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [user]);

  const updateField = (event) => setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  const updateAddress = async (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, address: { ...previous.address, [name]: value } }));
    if (name === "postalCode" && /^\d{6}$/.test(value)) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const [result] = await response.json();
        const office = result?.Status === "Success" ? result.PostOffice?.[0] : null;
        if (office) setForm((previous) => ({ ...previous, address: { ...previous.address, postalCode: value, city: office.District || office.Block || "", state: office.State || "" } }));
      } catch { /* Keep manual entry available if the postal service is unavailable. */ }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      await updateProfile(form);
      setForm((previous) => ({ ...previous, currentPassword: "", newPassword: "" }));
      setMessage("Your account details have been updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save your account details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container account-page page-enter">
      <div className="account-heading">
        <div>
          <h2 className="section-title">Account settings</h2>
          <p>Keep your contact, delivery, and sign-in details up to date.</p>
        </div>
      </div>

      <form className="account-card" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        {message && <div className="account-success">{message}</div>}

        <section>
          <h3>Personal details</h3>
          <div className="account-form-grid">
            <label>Full name<input name="name" autoComplete="name" value={form.name} onChange={updateField} required /></label>
            <label>Email address<input name="email" autoComplete="email" type="email" value={form.email} onChange={(e) => updateField({ target: { name: "email", value: e.target.value.toLowerCase() } })} autoCapitalize="none" autoCorrect="off" spellCheck="false" required /></label>
            <label>Mobile number<PhoneInput value={form.phone} onChange={(value) => updateField({ target: { name: "phone", value } })} /></label>
          </div>
        </section>

        <section>
          <h3>Delivery address</h3>
          <div className="account-form-grid">
            <label className="account-field-wide">Address line 1<input name="line1" autoComplete="street-address" value={form.address.line1} onChange={updateAddress} /></label>
            <label className="account-field-wide">Address line 2 (optional)<input name="line2" autoComplete="address-line2" value={form.address.line2} onChange={updateAddress} /></label>
            <label>City<input name="city" autoComplete="address-level2" value={form.address.city} onChange={updateAddress} /></label>
            <label>State<input name="state" autoComplete="address-level1" value={form.address.state} onChange={updateAddress} /></label>
            <label>Postal code<input name="postalCode" autoComplete="postal-code" value={form.address.postalCode} onChange={updateAddress} /></label>
            <label>Country<input name="country" value={form.address.country} onChange={updateAddress} /></label>
          </div>
        </section>

        <section>
          <h3>Change password <span>Optional</span></h3>
          <p className="account-help">To change your password, enter your current password and a new password of at least 6 characters.</p>
          <div className="account-form-grid">
            <label>Current password<input name="currentPassword" type="password" value={form.currentPassword} onChange={updateField} autoComplete="current-password" /></label>
            <label>New password<input name="newPassword" type="password" minLength="6" value={form.newPassword} onChange={updateField} autoComplete="new-password" /></label>
          </div>
        </section>

        <div className="account-actions"><button className="auth-submit" type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button></div>
      </form>
    </div>
  );
}

import "./PhoneInput.css";

export const COUNTRY_CODES = [
  { code: "+91", country: "India" },
  { code: "+1", country: "United States / Canada" },
  { code: "+44", country: "United Kingdom" },
  { code: "+61", country: "Australia" },
  { code: "+65", country: "Singapore" },
  { code: "+971", country: "United Arab Emirates" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+81", country: "Japan" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
];

export default function PhoneInput({ value = "", onChange, required = false }) {
  const matched = COUNTRY_CODES.slice().sort((a, b) => b.code.length - a.code.length).find((item) => value.startsWith(item.code));
  const countryCode = matched?.code || "+91";
  const digits = (matched ? value.slice(countryCode.length) : value).replace(/\D/g, "").slice(0, 10);

  return (
    <div className="phone-input">
      <select aria-label="Country code" value={countryCode} onChange={(event) => onChange(`${event.target.value}${digits}`)}>
        {COUNTRY_CODES.map((item) => <option key={item.code} value={item.code}>{item.code} {item.country}</option>)}
      </select>
      <input type="tel" inputMode="numeric" value={digits} onChange={(event) => onChange(`${countryCode}${event.target.value.replace(/\D/g, "").slice(0, 10)}`)} placeholder="Mobile number" maxLength="10" pattern="[0-9]{10}" required={required} />
    </div>
  );
}

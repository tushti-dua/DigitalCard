import React from "react";

const GlassInput = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = true,
}) => (
  <div className="mb-4 fade-up delay-2">
    <label
      htmlFor={id}
      className="d-block mb-2 small fw-bold text-uppercase"
      style={{
        color: "rgba(255,255,255,0.5)",
        letterSpacing: "0.09em",
        fontSize: "0.65rem",
      }}
    >
      {label} {required && <span style={{ color: "#64ffda" }}>*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="form-control glass-input py-3 px-3 fs-6 w-100"
      required={required}
    />
  </div>
);

export default GlassInput;

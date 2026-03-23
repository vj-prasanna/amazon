"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
  onCreated: () => void;
  onClose: () => void;
}

export default function CreateProductForm({ onCreated, onClose }: Props) {
  const [form, setForm] = useState({ name: "", type: "", price: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.type || !form.price) {
      toast.error("All fields required.");
      return;
    }
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("type", form.type);
    fd.append("price", form.price);
    if (imageFile) fd.append("image", imageFile);
    try {
      await axios.post("/api/products/create/", fd, {
        headers: { Authorization: `Token ${token}` },
      });
      toast.success("Product created!");
      onCreated();
      onClose();
    } catch {
      toast.error("Failed to create product.");
    }
  }

  const inputStyle = {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    padding: "0.5rem",
    color: "#111",
    boxSizing: "border-box" as const,
  };
  const labelStyle = {
    display: "block",
    fontSize: "0.875rem",
    color: "#111",
    marginBottom: "0.25rem",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#f9fafb",
        padding: "1.5rem",
        borderRadius: "8px",
        marginBottom: "2rem",
        border: "1px solid #e5e7eb",
      }}
    >
      <h2 style={{ fontWeight: "bold", marginBottom: "1rem", color: "#111" }}>
        New Product
      </h2>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        <div>
          <label style={labelStyle}>Name</label>
          <input
            aria-label="Name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Type</label>
          <input
            aria-label="Type"
            type="text"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Price</label>
          <input
            aria-label="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Image</label>
          <input
            aria-label="Image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <button
          type="submit"
          style={{
            backgroundColor: "#111",
            color: "#fff",
            padding: "0.5rem 1.5rem",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            backgroundColor: "#f3f4f6",
            color: "#111",
            padding: "0.5rem 1.5rem",
            borderRadius: "4px",
            border: "1px solid #e5e7eb",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

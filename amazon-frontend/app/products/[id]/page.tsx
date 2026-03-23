"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

interface Product {
  id: number;
  name: string;
  type: string;
  price: string;
  image: string | null;
}

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", type: "", price: "" });
  const [editing, setEditing] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = { Authorization: `Token ${token}` };

  useEffect(() => {
    axios.get(`/api/products/${id}/`, { headers }).then((res) => {
      setProduct(res.data);
      setForm({
        name: res.data.name,
        type: res.data.type,
        price: res.data.price,
      });
    });
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await axios.put(`/api/products/${id}/`, form, { headers });
      toast.success("Product updated!");
      setEditing(false);
    } catch {
      toast.error("Update failed.");
    }
  }

  async function handleDelete() {
    try {
      await axios.delete(`/api/products/${id}/`, { headers });
      toast.success("Deleted!");
      setTimeout(() => router.push("/"), 1000);
    } catch {
      toast.error("Delete failed.");
    }
  }

  if (!product)
    return <p style={{ padding: "2rem", color: "#111" }}>Loading...</p>;

  const inputStyle = {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    padding: "0.5rem",
    color: "#111",
    boxSizing: "border-box" as const,
    marginBottom: "1rem",
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
          padding: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <button
            onClick={() => router.push("/")}
            style={{
              marginBottom: "1.5rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
              fontSize: "0.875rem",
            }}
          >
            ← Back
          </button>

          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "1.5rem",
              }}
            />
          )}

          {editing ? (
            <form onSubmit={handleUpdate}>
              <label style={{ color: "#111", fontSize: "0.875rem" }}>
                Name
              </label>
              <input
                aria-label="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
              />
              <label style={{ color: "#111", fontSize: "0.875rem" }}>
                Type
              </label>
              <input
                aria-label="type"
                type="text"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={inputStyle}
              />
              <label style={{ color: "#111", fontSize: "0.875rem" }}>
                Price
              </label>
              <input
                aria-label="price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: "0.5rem" }}>
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
                  onClick={() => setEditing(false)}
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
          ) : (
            <>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#111",
                  marginBottom: "0.5rem",
                }}
              >
                {product.name}
              </h1>
              <p style={{ color: "#6b7280", marginBottom: "0.25rem" }}>
                {product.type}
              </p>
              <p
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#111",
                  marginBottom: "1.5rem",
                }}
              >
                ${product.price}
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    backgroundColor: "#111",
                    color: "#fff",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    backgroundColor: "#fee2e2",
                    color: "#ef4444",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

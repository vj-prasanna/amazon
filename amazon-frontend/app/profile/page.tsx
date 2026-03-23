"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import AppBar from "../components/AppBar";

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ mobile: "", address: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    axios
      .get("/api/profile/", { headers: { Authorization: `Token ${token}` } })
      .then((res) => {
        setName(res.data.name);
        setEmail(res.data.email);
        setForm({
          mobile: res.data.mobile || "",
          address: res.data.address || "",
        });
        if (res.data.image) setPreviewUrl(res.data.image);
      })
      .catch(() => toast.error("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("mobile", form.mobile);
    formData.append("address", form.address);
    if (imageFile) formData.append("image", imageFile);

    try {
      await axios.put("/api/profile/", formData, {
        headers: { Authorization: `Token ${token}` },
      });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    }
  }

  if (loading) return null;

  return (
    <>
      <ToastContainer position="top-right" />
      <AppBar />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "440px",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              color: "#111",
            }}
          >
            Profile
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: "#e5e7eb",
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "2.5rem", color: "#9ca3af" }}>👤</span>
              )}
            </div>
            <label
              style={{
                fontSize: "0.875rem",
                color: "#111",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Change photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Name</label>
            <input
              value={name}
              disabled
              style={{
                ...inputStyle,
                backgroundColor: "#f9fafb",
                color: "#6b7280",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Email</label>
            <input
              value={email}
              disabled
              style={{
                ...inputStyle,
                backgroundColor: "#f9fafb",
                color: "#6b7280",
              }}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Mobile</label>
              <input
                type="tel"
                placeholder="e.g. +91 9876543210"
                style={inputStyle}
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Address</label>
              <textarea
                placeholder="Enter your address"
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <button type="submit" style={submitStyle}>
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: "500",
  marginBottom: "0.25rem",
  color: "#111",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: "4px",
  padding: "0.5rem 0.75rem",
  color: "#111",
  boxSizing: "border-box",
  fontSize: "0.95rem",
};

const submitStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#111",
  color: "#fff",
  padding: "0.6rem",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
};

"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function validate() {
    if (!form.name.trim()) return "Name is required.";
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) return "Valid email is required.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    try {
      await axios.post("/api/auth/register/", form);
      toast.success("Registration successful! Please login.");
      setTimeout(() => router.push("/login"), 1000);
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Registration failed.");
    }
  }

  return (
    <>
      <ToastContainer position="top-right" />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f4f6",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "400px",
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
            Register
          </h1>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  marginBottom: "0.25rem",
                  color: "#111",
                }}
              >
                Name
              </label>
              <input
                aria-label="text"
                type="text"
                style={{
                  width: "100%",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  padding: "0.5rem 0.75rem",
                  color: "#111",
                  boxSizing: "border-box",
                }}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  marginBottom: "0.25rem",
                  color: "#111",
                }}
              >
                Email
              </label>
              <input
                aria-label="email"
                type="email"
                style={{
                  width: "100%",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  padding: "0.5rem 0.75rem",
                  color: "#111",
                  boxSizing: "border-box",
                }}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  marginBottom: "0.25rem",
                  color: "#111",
                }}
              >
                Password
              </label>
              <input
                aria-label="password"
                type="password"
                style={{
                  width: "100%",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  padding: "0.5rem 0.75rem",
                  color: "#111",
                  boxSizing: "border-box",
                }}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#111",
                color: "#fff",
                padding: "0.6rem",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Register
            </button>
          </form>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.875rem",
              textAlign: "center",
              color: "#111",
            }}
          >
            Already have an account?{" "}
            <a
              href="/login"
              style={{ textDecoration: "underline", color: "#111" }}
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

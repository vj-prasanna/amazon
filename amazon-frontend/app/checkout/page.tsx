"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function CheckoutPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function handleCheckout() {
    try {
      await axios.post(
        "/api/checkout/",
        {},
        { headers: { Authorization: `Token ${token}` } },
      );
      setSuccess(true);
      toast.success("Order placed successfully!");
    } catch {
      toast.error("Checkout failed.");
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
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            textAlign: "center",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          {success ? (
            <>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✓</div>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#111",
                  marginBottom: "0.5rem",
                }}
              >
                Order Placed!
              </h1>
              <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
                Your order was placed successfully.
              </p>
              <button
                onClick={() => router.push("/")}
                style={{
                  backgroundColor: "#111",
                  color: "#fff",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Back to Products
              </button>
            </>
          ) : (
            <>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#111",
                  marginBottom: "1rem",
                }}
              >
                Checkout
              </h1>
              <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
                Confirm your order?
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={handleCheckout}
                  style={{
                    backgroundColor: "#111",
                    color: "#fff",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Confirm Order
                </button>
                <button
                  onClick={() => router.push("/")}
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
            </>
          )}
        </div>
      </div>
    </>
  );
}

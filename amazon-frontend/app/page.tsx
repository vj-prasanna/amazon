"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function Home() {
  const router = useRouter();

  async function handleLogout() {
    const token = localStorage.getItem("token");
    if (token) {
      await axios.post(
        "/api/auth/logout/",
        {},
        { headers: { Authorization: `Token ${token}` } },
      );
      localStorage.removeItem("token");
    }
    toast.success("Logged out successfully!");
    setTimeout(() => router.push("/login"), 1000);
  }

  return (
    <div>
      <ToastContainer position="top-right" />
      <div style={{ padding: "2rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#111",
            marginBottom: "1rem",
          }}
        >
          Welcome
        </h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#111",
            color: "#fff",
            padding: "0.5rem 1.5rem",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

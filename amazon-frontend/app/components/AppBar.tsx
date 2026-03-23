"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

interface AppBarProps {
  cartCount?: number;
  onCheckout?: () => void;
}

export default function AppBar({ cartCount = 0, onCheckout }: AppBarProps) {
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

  const handleProfile = () => {
    router.push("/profile");
  }

  const handleHome = () => {
    router.push("/");
  }

  return (
    <div
      style={{
        backgroundColor: "#111",
        padding: "0.75rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div onClick={handleHome} style={{ color: "#fff", fontSize: "1.25rem", fontWeight: "bold" }}>
        ShopApp
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={onCheckout}
          style={{
            backgroundColor: "#f59e0b",
            color: "#111",
            padding: "0.4rem 1rem",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Checkout {cartCount > 0 && `(${cartCount})`}
        </button>
        <button
          onClick={handleProfile}
          style={{
            backgroundColor: "transparent",
            color: "#fff",
            padding: "0.4rem 1rem",
            borderRadius: "4px",
            border: "1px solid #fff",
            cursor: "pointer",
          }}
        >
          Profile
        </button>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "transparent",
            color: "#fff",
            padding: "0.4rem 1rem",
            borderRadius: "4px",
            border: "1px solid #fff",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

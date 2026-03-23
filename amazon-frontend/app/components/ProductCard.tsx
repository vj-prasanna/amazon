"use client";

interface Product {
  id: number;
  name: string;
  type: string;
  price: string;
  image: string | null;
}

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
  onView: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onView,
  onDelete,
}: Props) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", height: "150px", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "150px",
            backgroundColor: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9ca3af",
          }}
        >
          No Image
        </div>
      )}
      <div style={{ padding: "1rem" }}>
        <h3
          style={{ fontWeight: "bold", color: "#111", marginBottom: "0.25rem" }}
        >
          {product.name}
        </h3>
        <p
          style={{
            color: "#6b7280",
            fontSize: "0.875rem",
            marginBottom: "0.25rem",
          }}
        >
          {product.type}
        </p>
        <p style={{ color: "#111", fontWeight: "600", marginBottom: "1rem" }}>
          ${product.price}
        </p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => onAddToCart(product)}
            style={{
              flex: 1,
              backgroundColor: "#111",
              color: "#fff",
              padding: "0.4rem",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            Add to Cart
          </button>
          <button
            onClick={() => onView(product.id)}
            style={{
              padding: "0.4rem 0.75rem",
              backgroundColor: "#f3f4f6",
              color: "#111",
              borderRadius: "4px",
              border: "1px solid #e5e7eb",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            View
          </button>
          <button
            onClick={() => onDelete(product.id)}
            style={{
              padding: "0.4rem 0.75rem",
              backgroundColor: "#fee2e2",
              color: "#ef4444",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            Del
          </button>
        </div>
      </div>
    </div>
  );
}

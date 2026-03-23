'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import AppBar from './components/AppBar';
import ProductCard from './components/ProductCard';
import CreateProductForm from './components/CreateProductForm';

interface Product {
  id: number;
  name: string;
  type: string;
  price: string;
  image: string | null;
}

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    try {
      const res = await axios.get('/api/products/', { headers: { Authorization: `Token ${token}` } });
      setProducts(res.data);
    } catch {
      toast.error('Failed to load products.');
    }
  }

  async function handleDelete(id: number) {
    try {
      await axios.delete(`/api/products/${id}/`, { headers: { Authorization: `Token ${token}` } });
      toast.success('Product deleted.');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product.');
    }
  }

  function handleAddToCart(product: Product) {
    setCart([...cart, product]);
    toast.success(`${product.name} added to cart!`);
  }

  function handleCheckout() {
    if (cart.length === 0) { toast.error('Cart is empty.'); return; }
    router.push('/checkout');
  }

  return (
    <>
      <ToastContainer position="top-right" />
      <AppBar cartCount={cart.length} onCheckout={handleCheckout} />

      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111' }}>Products</h1>
          <button onClick={() => setShowCreate(!showCreate)}
            style={{ backgroundColor: '#111', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
            + Create Product
          </button>
        </div>

        {showCreate && <CreateProductForm onCreated={fetchProducts} onClose={() => setShowCreate(false)} />}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onView={(id) => router.push(`/products/${id}`)}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {products.length === 0 && (
          <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '3rem' }}>No products yet. Create one!</p>
        )}
      </div>
    </>
  );
}

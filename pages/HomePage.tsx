
import React from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import OrderForm from '../components/OrderForm';
import { ShoppingCart } from 'lucide-react';

const HomePage: React.FC = () => {
  const { products } = useApp();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-green font-serif text-center">Our Wellness Shots</h1>
        <p className="text-center text-brand-brown mt-2 max-w-2xl mx-auto">
          Support our fundraiser by purchasing a delicious, cold-pressed immunity shot. Each one is made with love and fresh ingredients.
        </p>
        <div className="mt-4 text-center bg-brand-light-green/20 border border-brand-light-green text-brand-brown p-3 rounded-lg max-w-2xl mx-auto">
          <p className="font-semibold">📅 Weekly Schedule Notice</p>
          <p className="text-sm">All weekly orders placed by Friday will be ready for pickup or delivery on Sunday.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-brand-light-green/50">
          <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="h-8 w-8 text-brand-orange"/>
              <h2 className="text-2xl font-bold text-brand-green font-serif">Place Your Order</h2>
          </div>
          <OrderForm />
      </div>
    </div>
  );
};

export default HomePage;

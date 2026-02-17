
import React, { useState, useEffect } from 'react';
import { Order, OrderSize, DeliveryOption, CartItem } from '../types';
import { useApp } from '../context/AppContext';
import { X, Save, Trash2, PlusCircle } from 'lucide-react';
import { PRODUCTS } from '../constants';

interface EditOrderModalProps {
  order: Order | null;
  onClose: () => void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ order, onClose }) => {
  const { updateOrder } = useApp();
  const [formData, setFormData] = useState<Partial<Order>>({});
  
  useEffect(() => {
    if (order) {
      setFormData({ ...order });
    }
  }, [order]);

  if (!order) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemQuantityChange = (index: number, quantity: number) => {
    if (!formData.items) return;
    const newItems = [...formData.items];
    if (quantity <= 0) {
      newItems.splice(index, 1);
    } else {
      newItems[index] = { ...newItems[index], quantity };
    }
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = (productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const newItem: CartItem = {
      productId,
      productName: product.name,
      size: OrderSize.SevenShots,
      quantity: 1
    };
    setFormData(prev => ({ ...prev, items: [...(prev.items || []), newItem] }));
  };

  const handleSave = () => {
    if (order.id) {
      updateOrder(order.id, formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-brand-light-green flex flex-col">
        <div className="bg-brand-green p-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold font-serif">Edit Order #{order.orderNumber}</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-brown uppercase mb-1">Customer Name</label>
              <input 
                type="text" 
                name="customerName" 
                value={formData.customerName || ''} 
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-brown uppercase mb-1">Contact Info</label>
              <input 
                type="text" 
                name="customerContact" 
                value={formData.customerContact || ''} 
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-brown uppercase mb-1">Zelle Confirmation</label>
              <input 
                type="text" 
                name="zelleConfirmationNumber" 
                value={formData.zelleConfirmationNumber || ''} 
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-brown uppercase mb-1">Donation Amount ($)</label>
              <input 
                type="number" 
                name="donationAmount" 
                value={formData.donationAmount || 0} 
                onChange={(e) => setFormData(prev => ({ ...prev, donationAmount: parseFloat(e.target.value) || 0 }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-brown uppercase mb-1">Delivery Option</label>
            <select 
              name="deliveryOption" 
              value={formData.deliveryOption || 'Pickup'} 
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none bg-white"
            >
              <option value="Pickup">Pickup</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>

          {formData.deliveryOption === 'Delivery' && (
            <div>
              <label className="block text-xs font-bold text-brand-brown uppercase mb-1">Delivery Address</label>
              <textarea 
                name="deliveryAddress" 
                value={formData.deliveryAddress || ''} 
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none h-20 bg-white"
              />
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="font-bold text-brand-green mb-3 flex items-center justify-between">
              Order Items
              <div className="relative group">
                 <button className="text-xs bg-brand-light-green text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-brand-green transition-colors">
                    <PlusCircle size={14} /> Add Product
                 </button>
                 <div className="absolute right-0 top-full mt-1 bg-white border shadow-xl rounded-lg py-1 w-48 hidden group-hover:block z-10">
                    {PRODUCTS.map(p => (
                        <button 
                            key={p.id} 
                            onClick={() => addItem(p.id)}
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-cream text-brand-brown"
                        >
                            {p.name}
                        </button>
                    ))}
                 </div>
              </div>
            </h3>
            <div className="space-y-2">
              {formData.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border">
                  <div className="flex-grow">
                    <p className="text-xs font-bold text-brand-brown">{item.productName}</p>
                    <select 
                        value={item.size} 
                        onChange={(e) => {
                            const newItems = [...(formData.items || [])];
                            newItems[idx] = { ...newItems[idx], size: e.target.value as OrderSize };
                            setFormData(prev => ({ ...prev, items: newItems }));
                        }}
                        className="text-[10px] p-1 border rounded bg-white"
                    >
                        <option value={OrderSize.SevenShots}>7-Pack</option>
                        <option value={OrderSize.TwelveOunce}>12oz</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      min="1" 
                      value={item.quantity} 
                      onChange={(e) => handleItemQuantityChange(idx, parseInt(e.target.value) || 0)}
                      className="w-12 p-1 border rounded text-center text-xs bg-white"
                    />
                    <button onClick={() => handleItemQuantityChange(idx, 0)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {(!formData.items || formData.items.length === 0) && (
                <p className="text-xs text-gray-500 italic">No items in this order.</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isRecurring" 
              checked={formData.isRecurring || false} 
              onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-brand-orange bg-white"
            />
            <label htmlFor="isRecurring" className="text-xs font-bold text-brand-brown cursor-pointer">Recurring Order (4x multiplier)</label>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-brand-brown transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="bg-brand-orange text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 shadow-md active:scale-95 transition-all"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;

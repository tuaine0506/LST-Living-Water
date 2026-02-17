
import React from 'react';
import { Order } from '../types';
import { X, Copy, Mail, MessageSquare } from 'lucide-react';

interface NotificationModalProps {
  order: Order | null;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const pickupMessage = `Hello ${order.customerName},\n\nYour 'Living Water' wellness shot order is ready for pickup! You can pick it up this Sunday at the La Sierra Tongan SDA Fellowship.\n\nThank you for your support!`;
  const deliveryMessage = `Hello ${order.customerName},\n\nYour 'Living Water' wellness shot order is fulfilled and will be delivered this Sunday to:\n${order.deliveryAddress}\n\nWe will notify you when our driver is on the way. Thank you for your support!`;

  const message = order.deliveryOption === 'Pickup' ? pickupMessage : deliveryMessage;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    alert('Message copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-brand-green">Notify Customer</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="font-semibold text-brand-brown">To: {order.customerName}</p>
            <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} /> or <MessageSquare size={16} />
                </div>
                <p className="text-sm font-mono bg-white border border-gray-200 px-2 py-1 rounded">{order.customerContact}</p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-brand-brown mb-2">Message Template:</p>
            <textarea
              readOnly
              value={message}
              className="w-full p-3 border border-gray-300 rounded-md bg-white h-48 focus:ring-2 focus:ring-brand-orange outline-none"
            />
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
            <button
                onClick={copyToClipboard}
                className="bg-brand-orange text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition-colors"
            >
                <Copy size={18} /> Copy Message
            </button>
            <button
                onClick={onClose}
                className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Order, CartItem, GroupName, OrderSize, ProductPrices, ScheduleEvent, DeliveryOption } from '../types';
import { PRODUCTS, GROUP_NAMES } from '../constants';

interface AppContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  cartId: string | null;
  donationAmount: number;
  schedule: ScheduleEvent[];
  isAdmin: boolean;
  addToCart: (productId: string, size: OrderSize, quantity: number) => void;
  removeFromCart: (productId: string, size: OrderSize) => void;
  updateCartQuantity: (productId: string, size: OrderSize, quantity: number) => void;
  setDonationAmount: (amount: number) => void;
  clearCart: () => void;
  placeOrder: (customerName: string, customerContact: string, deliveryOption: DeliveryOption, deliveryAddress: string | undefined, zelleConfirmationNumber: string, isRecurring: boolean) => void;
  updateOrder: (orderId: string, updatedData: Partial<Order>) => void;
  toggleOrderFulfilled: (orderId: string) => void;
  login: (password: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const products = PRODUCTS;
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [cartId, setCartId] = useLocalStorage<string | null>('cartId', null);
  const [donationAmount, setDonationAmount] = useLocalStorage<number>('donationAmount', 0);
  const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
  const [isAdmin, setIsAdmin] = useLocalStorage<boolean>('isAdmin', false);

  useEffect(() => {
    // Generate schedule for the next 8 Sundays
    const generateSchedule = () => {
        const upcomingSundays: ScheduleEvent[] = [];
        let currentDate = new Date();
        let sundaysFound = 0;
        while (sundaysFound < 8) {
            currentDate.setDate(currentDate.getDate() + 1);
            if (currentDate.getDay() === 0) { // Sunday
                upcomingSundays.push({
                    date: currentDate.toISOString(),
                    group: GROUP_NAMES[sundaysFound % GROUP_NAMES.length]
                });
                sundaysFound++;
            }
        }
        setSchedule(upcomingSundays);
    };
    generateSchedule();
  }, []);

  const login = (password: string): boolean => {
    if (password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const addToCart = (productId: string, size: OrderSize, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (!cartId) {
        setCartId(`LW-${Date.now().toString().slice(-6)}`);
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId && item.size === size);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { productId, productName: product.name, size, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string, size: OrderSize) => {
    setCart(prevCart => {
        const newCart = prevCart.filter(item => !(item.productId === productId && item.size === size));
        if (newCart.length === 0 && donationAmount <= 0) {
            setCartId(null);
        }
        return newCart;
    });
  };

  const updateCartQuantity = (productId: string, size: OrderSize, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.productId === productId && item.size === size
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setCartId(null);
    setDonationAmount(0);
  };

  const placeOrder = (customerName: string, customerContact: string, deliveryOption: DeliveryOption, deliveryAddress: string | undefined, zelleConfirmationNumber: string, isRecurring: boolean) => {
    let currentId = cartId;
    if (!currentId) {
        currentId = `LW-${Date.now().toString().slice(-6)}`;
    }
    
    const baseTotal = cart.reduce((total, item) => {
        return total + (ProductPrices[item.size] * item.quantity);
    }, 0);

    const finalProductPrice = isRecurring ? baseTotal * 4 : baseTotal;
    const finalPrice = finalProductPrice + donationAmount;

    const newOrder: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      customerName,
      customerContact,
      items: [...cart],
      donationAmount: donationAmount,
      assignedGroup: GROUP_NAMES[Math.floor(Math.random() * GROUP_NAMES.length)],
      orderDate: new Date().toISOString(),
      isFulfilled: false,
      totalPrice: finalPrice,
      deliveryOption,
      deliveryAddress,
      orderNumber: currentId,
      zelleConfirmationNumber,
      isRecurring,
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
    clearCart();
  };

  const updateOrder = (orderId: string, updatedData: Partial<Order>) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          const mergedOrder = { ...order, ...updatedData };
          // Re-calculate total price if items or donation changed
          const baseTotal = mergedOrder.items.reduce((total, item) => {
              return total + (ProductPrices[item.size] * item.quantity);
          }, 0);
          const finalProductPrice = mergedOrder.isRecurring ? baseTotal * 4 : baseTotal;
          mergedOrder.totalPrice = finalProductPrice + mergedOrder.donationAmount;
          return mergedOrder;
        }
        return order;
      })
    );
  };
  
  const toggleOrderFulfilled = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, isFulfilled: !order.isFulfilled } : order
      )
    );
  };

  return (
    <AppContext.Provider value={{ products, orders, cart, cartId, donationAmount, setDonationAmount, schedule, isAdmin, addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder, updateOrder, toggleOrderFulfilled, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

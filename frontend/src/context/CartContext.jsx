import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('tastybite_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tastybite_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const getItemId = (item) => item._id || item.id;

  const addToCart = (item, quantity = 1) => {
    const id = getItemId(item);
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => getItemId(i) === id);
      if (existing) {
        return prevItems.map((i) =>
          getItemId(i) === id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        return [
          ...prevItems,
          {
            id,
            _id: item._id,
            name: item.name,
            price: Number(item.price),
            image: item.image,
            tag: item.tag || '',
            category: item.category,
            quantity: Math.max(1, quantity),
          },
        ];
      }
    });

    showToast(`Added "${item.name}" to cart! 🛒`);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((i) => getItemId(i) !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (getItemId(i) === itemId ? { ...i, quantity: newQuantity } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('tastybite_cart');
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'TASTY10') {
      setAppliedCoupon({ code: 'TASTY10', type: 'percent', value: 10, label: '10% OFF' });
      showToast('Coupon "TASTY10" applied! 10% discount added 🎉');
      return { success: true, message: '10% discount applied!' };
    } else if (cleanCode === 'TASTY20') {
      setAppliedCoupon({ code: 'TASTY20', type: 'percent', value: 20, label: '20% OFF' });
      showToast('Coupon "TASTY20" applied! 20% discount added 🎉');
      return { success: true, message: '20% discount applied!' };
    } else if (cleanCode === 'FREE50') {
      setAppliedCoupon({ code: 'FREE50', type: 'flat', value: 50, label: '₹50 OFF' });
      showToast('Coupon "FREE50" applied! ₹50 discount added 🎉');
      return { success: true, message: '₹50 discount applied!' };
    } else {
      return { success: false, message: 'Invalid promo code. Try "TASTY10" or "TASTY20".' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'flat') {
      discount = Math.min(subtotal, appliedCoupon.value);
    }
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const taxAmount = Math.round(taxableAmount * 0.05); // 5% GST
  const deliveryFee = subtotal > 0 && subtotal < 499 ? 40 : 0;
  const grandTotal = Math.max(0, taxableAmount + taxAmount + deliveryFee);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        appliedCoupon,
        toastMessage,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        totalItemsCount,
        subtotal,
        discount,
        taxAmount,
        deliveryFee,
        grandTotal,
      }}
    >
      {children}
      {toastMessage && (
        <div className="cart-toast-banner" role="status">
          {toastMessage}
        </div>
      )}
    </CartContext.Provider>
  );
};

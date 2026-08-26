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

  // Modals state
  const [customizingItem, setCustomizingItem] = useState(null);
  const [nutritionItem, setNutritionItem] = useState(null);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // Table QR detection
  const [tableNumber, setTableNumber] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('table') || '';
    } catch {
      return '';
    }
  });

  // Loyalty points (100 points = ₹50 discount)
  const [loyaltyPoints, setLoyaltyPoints] = useState(() => {
    try {
      const saved = localStorage.getItem('tastybite_points');
      return saved !== null ? Number(saved) : 200; // 200 welcome points = ₹100
    } catch {
      return 200;
    }
  });
  const [pointsRedeemed, setPointsRedeemed] = useState(0);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tastybite_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Sync loyalty points to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tastybite_points', loyaltyPoints.toString());
    } catch (e) {
      console.error('Failed to save loyalty points', e);
    }
  }, [loyaltyPoints]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const generateCartKey = (item, spiceLevel = 'Default', addOns = [], notes = '') => {
    const baseId = item._id || item.id;
    const addOnKey = (addOns || []).map((a) => a.name).sort().join('-');
    return `${baseId}_${spiceLevel}_${addOnKey}_${notes.trim()}`;
  };

  const addToCart = (item, quantity = 1, customizations = {}) => {
    const spiceLevel = customizations.spiceLevel || 'Default';
    const addOns = customizations.addOns || [];
    const cookingNotes = customizations.cookingNotes || '';

    // Calculate item total price with add-ons
    const addOnsCost = addOns.reduce((acc, a) => acc + Number(a.price || 0), 0);
    const effectiveUnitPrice = Number(item.price) + addOnsCost;

    const cartKey = generateCartKey(item, spiceLevel, addOns, cookingNotes);

    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.cartKey === cartKey);
      if (existing) {
        return prevItems.map((i) =>
          i.cartKey === cartKey ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        return [
          ...prevItems,
          {
            cartKey,
            id: item._id || item.id,
            _id: item._id,
            name: item.name,
            basePrice: Number(item.price),
            price: effectiveUnitPrice,
            image: item.image,
            tag: item.tag || '',
            category: item.category,
            quantity: Math.max(1, quantity),
            spiceLevel,
            addOns,
            cookingNotes,
          },
        ];
      }
    });

    showToast(`Added "${item.name}" to cart! 🛒`);
  };

  const removeFromCart = (cartKey) => {
    setCartItems((prev) => prev.filter((i) => (i.cartKey || i._id || i.id) !== cartKey));
  };

  const updateQuantity = (cartKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartKey);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => ((i.cartKey || i._id || i.id) === cartKey ? { ...i, quantity: newQuantity } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setPointsRedeemed(0);
    localStorage.removeItem('tastybite_cart');
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'TASTY10') {
      setAppliedCoupon({ code: 'TASTY10', type: 'percent', value: 10, label: '10% OFF' });
      showToast('Coupon "TASTY10" applied! 10% discount added 🎉');
      return { success: true, message: '10% discount applied!' };
    } else if (cleanCode === 'TASTY20' || cleanCode === 'WELCOME20') {
      setAppliedCoupon({ code: cleanCode, type: 'percent', value: 20, label: '20% OFF' });
      showToast(`Coupon "${cleanCode}" applied! 20% discount added 🎉`);
      return { success: true, message: '20% discount applied!' };
    } else if (cleanCode === 'FREE50' || cleanCode === 'WEEKEND50') {
      setAppliedCoupon({ code: cleanCode, type: 'flat', value: 50, label: '₹50 OFF' });
      showToast(`Coupon "${cleanCode}" applied! ₹50 discount added 🎉`);
      return { success: true, message: '₹50 discount applied!' };
    } else {
      return { success: false, message: 'Invalid promo code. Try "WELCOME20", "TASTY10", or "WEEKEND50".' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Loyalty Points redemption
  const toggleRedeemPoints = () => {
    if (pointsRedeemed > 0) {
      setPointsRedeemed(0);
      showToast('TastyPoints removed from checkout');
    } else {
      if (loyaltyPoints >= 100) {
        setPointsRedeemed(100);
        showToast('Redeemed 100 TastyPoints for ₹50 OFF! 🎁');
      } else {
        showToast('You need at least 100 TastyPoints to redeem');
      }
    }
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

  const pointsDiscount = pointsRedeemed > 0 ? 50 : 0;
  const taxableAmount = Math.max(0, subtotal - discount - pointsDiscount);
  const taxAmount = Math.round(taxableAmount * 0.05); // 5% GST
  const deliveryFee = subtotal > 0 && subtotal < 499 ? 40 : 0;
  const grandTotal = Math.max(0, taxableAmount + taxAmount + deliveryFee);

  // Modal Triggers
  const openCustomizeModal = (item) => setCustomizingItem(item);
  const closeCustomizeModal = () => setCustomizingItem(null);

  const openNutritionModal = (item) => setNutritionItem(item);
  const closeNutritionModal = () => setNutritionItem(null);

  const openOrderTracker = (orderNum = null) => {
    if (orderNum) setTrackingOrderNumber(orderNum);
    setIsTrackerOpen(true);
  };
  const closeOrderTracker = () => {
    setIsTrackerOpen(false);
  };

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
        customizingItem,
        nutritionItem,
        trackingOrderNumber,
        isTrackerOpen,
        tableNumber,
        setTableNumber,
        loyaltyPoints,
        setLoyaltyPoints,
        pointsRedeemed,
        pointsDiscount,
        toggleRedeemPoints,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        openCustomizeModal,
        closeCustomizeModal,
        openNutritionModal,
        closeNutritionModal,
        openOrderTracker,
        closeOrderTracker,
        totalItemsCount,
        subtotal,
        discount,
        taxAmount,
        deliveryFee,
        grandTotal,
        showToast,
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

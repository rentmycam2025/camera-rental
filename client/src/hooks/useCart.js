import { useState, useMemo, useCallback, useEffect } from "react";

export const useCart = (setNotification, setActivePage) => {
  // Load cart and rental dates from localStorage on first render
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("rentalCart");
    return saved ? JSON.parse(saved) : [];
  });

  const [rentalDates, setRentalDates] = useState(() => {
    const saved = localStorage.getItem("rentalDates");
    return saved ? JSON.parse(saved) : { start: "", end: "" };
  });

  // Persist cart and rentalDates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("rentalCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("rentalDates", JSON.stringify(rentalDates));
  }, [rentalDates]);

  // HANDLER: For date inputs
  const handleDateChange = useCallback((e) => {
    setRentalDates((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  // UTILITY: Calculate rental days
  const calculateRentalDays = useCallback((start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate <= startDate) return 0;
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }, []);

  const numberOfDays = useMemo(
    () => calculateRentalDays(rentalDates.start, rentalDates.end),
    [rentalDates, calculateRentalDays]
  );

  // Calculate subtotal cost per day
  const subtotal = useMemo(
    () =>
      cart.reduce((total, item) => {
        const price = item.offerPrice || item.pricePerDay;
        return total + price * item.quantity;
      }, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // CART HANDLERS
  const addToCart = useCallback(
    (item) => {
      setCart((prevCart) => {
        const existingItem = prevCart.find((i) => i._id === item._id);
        if (existingItem) {
          return prevCart.map((i) =>
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          return [...prevCart, { ...item, quantity: 1 }];
        }
      });
      setNotification({
        message: `${item.name} added to cart!`,
        type: "success",
      });
      // setActivePage("cart");
    },
    [setNotification]
  );

  const updateCartQuantity = useCallback((id, newQuantity) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item._id !== id);
      }
      return prevCart.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      );
    });
  }, []);

  const removeFromCart = useCallback(
    (id) => {
      const itemToRemove = cart.find((i) => i._id === id)?.name || "Item";
      setCart((prevCart) => prevCart.filter((item) => item._id !== id));
      setNotification({
        message: `${itemToRemove} removed from cart.`,
        type: "error",
      });
    },
    [cart, setNotification]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setRentalDates({ start: "", end: "" });
    setActivePage("cameras");
  }, [setActivePage]);

  return {
    cart,
    rentalDates,
    numberOfDays,
    subtotal,
    cartCount,
    handleDateChange,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  };
};

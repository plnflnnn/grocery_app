import { createContext, useContext, useEffect, useState } from "react";
import UserContext from "../auth/context";
import {
  clearCartItems,
  deleteCartItem,
  ensureCartTable,
  getCartItem,
  getCartItems,
  insertCartItem,
  updateCartItemQuantity,
} from "../db/cart";
import useDB from "../hooks/useDB";

const CartContext = createContext(null);
const MAX_QUANTITY = 10;

export const CartProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState([]);
  const [state, setState] = useState({
    error: false,
    loading: false,
    response: "",
  });

  const { db, loading: dbLoading, withDB } = useDB();
  const userId = user?.id;

  const handleAsync = async (fn) => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: false,
    }));
    try {
      await fn();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: true,
        response: "Something went wrong.",
      }));
      console.error(err);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const setupCart = async () => {
    await withDB((database) => ensureCartTable(database));
  };

  const loadCart = async () => {
    if (!userId) {
      setCart([]);
      return;
    }

    await handleAsync(async () => {
      await setupCart();
      const result = await withDB((database) => getCartItems(database, userId));
      setCart(result || []);
    });
  };

  useEffect(() => {
    if (!db) return;
    loadCart();
  }, [db, userId]);

  const addItemToCart = async (newCartItem) => {
    if (!userId) return;

    await handleAsync(async () => {
      await setupCart();
      const existing = await withDB((database) =>
        getCartItem(database, userId, newCartItem.id)
      );

      if (existing) {
        const newQuantity = Math.min(
          existing.quantity + newCartItem.quantity,
          MAX_QUANTITY
        );
        await withDB((database) =>
          updateCartItemQuantity(database, userId, newCartItem.id, newQuantity)
        );
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === newCartItem.id ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        await withDB((database) =>
          insertCartItem(database, userId, newCartItem)
        );
        setCart((prevCart) => [...prevCart, newCartItem]);
      }

      setState((prev) => ({
        ...prev,
        response: "Item successfully added to cart!",
      }));
    });
  };

  const changeCartItemQuantity = async ({ id, quantity }) => {
    if (!userId) return;

    await handleAsync(async () => {
      const item = await withDB((database) =>
        getCartItem(database, userId, id)
      );
      if (!item) return;

      await withDB((database) =>
        updateCartItemQuantity(database, userId, id, quantity)
      );
      setCart((prevCart) =>
        prevCart.map((entry) =>
          entry.id === id ? { ...entry, quantity } : entry
        )
      );
    });
  };

  const deleteItemFromCart = async (id) => {
    if (!userId) return;

    await handleAsync(async () => {
      await withDB((database) => deleteCartItem(database, userId, id));
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    });
  };

  const clearCart = async () => {
    if (!userId) {
      setCart([]);
      return;
    }

    try {
      await withDB((database) => clearCartItems(database, userId));
      setCart([]);
    } catch (error) {
      console.error("clearCart error", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        getCart: loadCart,
        changeCartItemQuantity,
        addItemToCart,
        deleteItemFromCart,
        clearCart,
        cart,
        dbLoading,
        ...state,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

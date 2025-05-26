import React, { createContext, useContext, useState, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";
import * as Notifications from 'expo-notifications';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const db = useSQLiteContext();
  const [cart, setCart] = useState([]);
  const [state, setState] = useState({
    error: false,
    loading: false,
    response: ''
  });

  const handleAsync = async (fn) => {
    setState(prev => ({ ...prev, loading: true, error: false, response: 'Loading...' }));
    try {
      await fn();
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: true, response: 'Something went wrong..' }));
      console.error(err);
    } finally {
      setState(prev => ({ ...prev, loading: false, response: '' }));
    }
  };

 const createCart = async () => {
    await handleAsync(async () => {
        try {
            await db.execAsync(`
                create table if not exists cartitems (id integer primary key not null, quantity integer, name text, src text, category text, price decimal(10,2) );`);
            } catch(e){
              console.log(`createCartDb: An error occured ${e}`)
        }
    });
  };

  useEffect(() => {
    createCart();
  }, []);

  const getCartItems = async () => {
    await handleAsync(async () => {
      try {
        const result = await db.getAllAsync('SELECT * FROM cartitems');
        setCart(result || []);
      } catch (e) {
        console.log('getCartItems error', e);
        setCart([]);
      }
    });
  };

  const addItemToCart = async (newCartItem) => {
    await handleAsync(async () => {
      try {
        await createCart();

        const existing = await db.getAllAsync(
          `SELECT * FROM cartitems WHERE id = "${newCartItem.id}"`
        );

        if (existing.length > 0) {
          await db.execAsync(
            `UPDATE cartitems SET quantity = "${newCartItem.quantity}" WHERE id = "${newCartItem.id}"`
          );
          await notify(newCartItem.name);
          setCart((prevCart) =>
            prevCart.map((item) =>
              item.id === newCartItem.id
                ? { ...item, quantity: newCartItem.quantity }
                : item
            )
          );
        } else {
          await db.execAsync(
            `INSERT INTO cartitems (id, quantity, name, src, category, price)
             VALUES ("${newCartItem.id}", "${newCartItem.quantity}", "${newCartItem.name}", "${newCartItem.src}", "${newCartItem.category}", "${newCartItem.price}")`
          );
          await notify(newCartItem.name);
          setCart((prevCart) => [...prevCart, newCartItem]);
        }

        setState((prev) => ({
          ...prev,
          response: "Item successfully added to cart!",
        }));
      } catch (e) {
        console.log(`addItemToCart: An error occurred`, e);
      }
    });
  };

  const changeCartItemQuantity = async ({ id, quantity }) => {
    await handleAsync(async () => {
      try {
        await createCart();
        const item = await db.getFirstAsync(`SELECT * FROM cartitems WHERE id = "${id}"`);
        if (!item) {
          console.log(`changeCartItemQuantity: Item with id ${id} not found`);
          return;
        }

        await db.execAsync(
          `UPDATE cartitems SET quantity = "${quantity}" WHERE id = "${id}"`
        );

        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      } catch (e) {
        console.log(`changeCartItemQuantity: An error occurred`, e);
      }
    });
  };

  const deleteItemFromCart = async (id) => {
    await handleAsync(async () => {
      try {
        await createCart();
        await db.execAsync(`DELETE FROM cartitems WHERE id = ${id}`);
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
        console.log(`deleteItem: Removed item with id ${id}`);
      } catch (e) {
        console.log(`deleteItem: An error occurred`, e);
      }
    });
  };

  const getCart = async () => {
    try {
      await createCart();
      await getCartItems();
    } catch (e) {
      console.log(e.message);
    }
  };

  const notify = async (itemName = 'Item') => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🛒 Item Added',
        body: `${itemName} added to your cart!`,
        data: { screen: 'Cart' },
      },
      trigger: { seconds: 2 },
    });
  };

  const clearCart = async () => {
    try {
      await createCart();
      await db.execAsync('DELETE FROM cartitems');
      console.log('All cart items deleted from database');
      setCart([]);
    } catch (e) {
      console.log('clearCart error', e);
    }
  };

  return (
    <CartContext.Provider value={{
      getCart,
      createCart,
      changeCartItemQuantity,
      addItemToCart,
      deleteItemFromCart,
      clearCart,
      cart,
      ...state
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

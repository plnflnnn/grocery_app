import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, ScrollView, TouchableOpacity, View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import ActivityIndicator from "../components/ActivityIndicator";
import Button from "../components/Button";
import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/Text";
import CartItem from "../components/lists/CartItem";
import { useCart } from "../context/CartContext";


import { useStripe } from "@stripe/stripe-react-native";
import { apiUrl } from "../settings/index";

function CartScreen({ navigation }) {
  const { getCart, cart = [], error, clearCart } = useCart();
  const [cartItems, setCartItems] = useState(cart);
  const [total, setTotal] = useState(0);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [checkoutReady, setCheckoutReady] = useState(false);

  const amountInCents = Math.round(total * 100);

  const calcTotal = (cart) => {
    if(!cart || cart.length === 0) return 0
    const calc = cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2);
    setTotal(calc);
  }

  const fetchPaymentSheetParams = async () => {
    if (amountInCents < 50) {
      throw new Error("Amount must be at least 50 cents.");
    }
  
    const response = await fetch(`${apiUrl}/payment-sheet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountInCents }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch payment sheet params:", response.status, errorText);
      throw new Error("Failed to fetch payment sheet params");
    }
  
    return await response.json();
  };
  

  const initializePaymentSheet = async () => {
    try {
      const { paymentIntent, ephemeralKey, customer, publishableKey } = await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Your Company Name",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
      });

      if (!error) {
        setCheckoutReady(true);
      } else {
        Alert.alert("Error", error.message);
      }
    } catch (err) {
      console.error("init error", err);
      Alert.alert("Error", "Unable to initialize checkout.");
    }
  };

  const handleCheckout = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert("Payment Failed", error.message);
    } else {
      await clearCart();
      Alert.alert("Success", "Your payment was successful!");
      navigation.navigate(routes.CART);
    }
  };

  useEffect(() => {
    getCart();
    calcTotal(cart);
  }, []);

  useEffect(() => {
    setCartItems(cart);
    calcTotal(cart);
  }, [cart]);

  useEffect(() => {
    if (cart.length > 0 && total >= 0.5) {
      initializePaymentSheet();
    } else {
      setCheckoutReady(false);
    }
  }, [cart, total]);


  return (
    <>
      <ActivityIndicator visible={loading} />
      <Screen style={styles.screen}>
        {error && (
          <>
            <AppText>Couldn't retrieve the cart.</AppText>
            <Button title="Retry" onPress={getCart} />
          </>
        )}

      {Array.isArray(cartItems) && cartItems.length === 0 ? (
        <Text style={styles.cartText}>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CartItem
                title={item.name}
                subTitle={"$" + item.price}
                imageUrl={item.src}
                onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
                thumbnailUrl={item.src}
                itemQuantity={item.quantity}
                data={item}
              />
            )}
          />

          <View style={styles.checkoutBtnContainer}>
            <Text>Order total: {total}$</Text>
            <TouchableOpacity onPress={handleCheckout} style={styles.checkoutBtn}>
                <Text style={styles.checkoutBtnText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
    paddingTop: 20,
    paddingHorizontal: 10,
    justifyContent:'center'
  },
  cartText: {
    color: colors.dark,
    textAlign:'center',
    fontSize:16,
    alignSelf: 'center',

  },
  checkoutBtn: {
    padding: 10,
    backgroundColor: colors.green,
    borderRadius: 10,
    justifyContent: 'center',
    width: '95%',
  },
  checkoutBtnText: {
    color: colors.white,
    textAlign: 'center',
  },
  checkoutBtnContainer: {
    justifyContent:'center',
    width: '100%',
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    gap:10,
  },
});

export default CartScreen;

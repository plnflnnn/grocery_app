import React, { useState, useEffect } from "react";
import { View, Button, Alert, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useCart } from "../context/CartContext";
import PayPalWebView from "../components/PayPalWebView";
import { apiUrl } from "../settings/index";
import routes from "../navigation/routes";
import colors from "../config/colors";

export default function CheckoutScreen({ navigation }) {
  const { cart, clearCart } = useCart();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [mode, setMode] = useState(null); // null | 'stripe' | 'paypal'
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const amountInCents = Math.round(total * 100);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${apiUrl}/payment-sheet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amountInCents }),
    });

    const data = await response.json();
    return data;
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
        returnURL: "myapp://cart",
      });

      if (!error) {
        setLoading(true);
      } else {
        console.error('Error initializing payment sheet:', error);
      }
    } catch (error) {
      console.error('Error fetching payment params:', error);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert('Payment Failed', error.message);
    } else {
      await clearCart();
      navigation.navigate(routes.CART);
      Alert.alert('Success', 'Your payment was successful!');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const handlePayPalSuccess = (details) => {
    Alert.alert("Success", "PayPal payment completed!");
    clearCart();
    navigation.navigate(routes.CART);
  };

  if (mode === "paypal") {
    return (
      <PayPalWebView
        amount={total}
        onSuccess={handlePayPalSuccess}
        onCancel={() => navigation.navigate(routes.CART)}
      />
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <TouchableOpacity onPress={() => openPaymentSheet()} style={styles.checkoutBtn}>
              <Text style={styles.checkoutBtnText}>Checkout with Stripe</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode("paypal")} style={styles.checkoutBtn}>
              <Text style={styles.checkoutBtnText}>Checkout with PayPal</Text>
          </TouchableOpacity>
        </>
      ) : (
        <ActivityIndicator size="large" color="#000" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap:10,
  },
  spacer: {
    height: 20,
  },
  checkoutBtn: {
    padding: 10,
    backgroundColor: colors.green,
    borderRadius: 10,
    justifyContent: 'center',
    width: '95%',
    color: colors.white,
    textAlign: 'center',
  },
  checkoutBtnText: {
    color: colors.white,
    textAlign: 'center',
  },
});

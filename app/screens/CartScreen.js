import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useCart } from "../context/CartContext";
import { useStripe } from "@stripe/stripe-react-native";
import { useHttp } from "../hooks/useHttp";
import ActivityIndicator from "../components/ActivityIndicator";
import Button from "../components/Button";
import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/Text";
import CartItem from "../components/lists/CartItem";

function CartScreen({ navigation }) {
  const { getCart, cart = [], error, clearCart, loading: cartLoading } =
    useCart();
  const { request } = useHttp();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutReady, setCheckoutReady] = useState(false);

  const total = useMemo(() => {
    if (!cart.length) return 0;
    return cart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
  }, [cart]);

  const amountInCents = Math.round(total * 100);
  const loading = cartLoading || checkoutLoading;

  const fetchPaymentSheetParams = async () => {
    if (amountInCents < 50) {
      throw new Error("Amount must be at least 50 cents.");
    }

    return request(
      "/payment-sheet",
      "POST",
      JSON.stringify({ amount: amountInCents })
    );
  };

  const initializePaymentSheet = async () => {
    setCheckoutLoading(true);
    try {
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Grocery App",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        returnURL: "groceryapp://stripe-redirect",
      });

      if (!initError) {
        setCheckoutReady(true);
      } else {
        setCheckoutReady(false);
        Alert.alert("Error", initError.message);
      }
    } catch (err) {
      console.error("init error", err);
      setCheckoutReady(false);
      Alert.alert("Error", "Unable to initialize checkout.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!checkoutReady) {
      Alert.alert("Please wait", "Checkout is still getting ready.");
      return;
    }

    const { error: paymentError } = await presentPaymentSheet();
    if (paymentError) {
      Alert.alert("Payment Failed", paymentError.message);
      return;
    }

    await clearCart();
    Alert.alert("Success", "Your payment was successful!");
  };

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

        {!cart.length ? (
          <Text style={styles.cartText}>Your cart is empty</Text>
        ) : (
          <>
            <FlatList
              data={cart}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <CartItem
                  title={item.name}
                  subTitle={"$" + Number(item.price).toFixed(2)}
                  imageUrl={item.src}
                  onPress={() =>
                    navigation.navigate(routes.LISTING_DETAILS, item)
                  }
                  data={item}
                />
              )}
            />

            <View style={styles.checkoutBtnContainer}>
              <Text>Order total: ${total.toFixed(2)}</Text>
              <TouchableOpacity
                onPress={handleCheckout}
                disabled={!checkoutReady}
                style={[
                  styles.checkoutBtn,
                  !checkoutReady && styles.checkoutBtnDisabled,
                ]}
              >
                <Text style={styles.checkoutBtnText}>
                  {checkoutReady ? "Checkout" : "Preparing checkout..."}
                </Text>
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
    justifyContent: "center",
  },
  cartText: {
    color: colors.dark,
    textAlign: "center",
    fontSize: 16,
    alignSelf: "center",
  },
  checkoutBtn: {
    padding: 10,
    backgroundColor: colors.green,
    borderRadius: 10,
    justifyContent: "center",
    width: "95%",
  },
  checkoutBtnDisabled: {
    backgroundColor: colors.medium,
  },
  checkoutBtnText: {
    color: colors.white,
    textAlign: "center",
  },
  checkoutBtnContainer: {
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    gap: 10,
  },
});

export default CartScreen;

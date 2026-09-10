import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useCart } from "../context/CartContext";
import colors from "../config/colors";
import Text from "../components/Text";
import QuantityStepper from "../components/QuantityStepper";

function ListingDetailsScreen({ route }) {
  const item = route.params;
  const [quantity, setQuantity] = useState(item.quantity || 0);
  const { addItemToCart } = useCart();
  const [response, setResponse] = useState("");
  const minNum = 0;
  const maxNum = 10;

  useEffect(() => {
    if (item.quantity) setQuantity(item.quantity);
  }, [item.quantity]);

  function showResponse(text) {
    setResponse(text);
    setTimeout(() => setResponse(""), 2000);
  }

  function decreaseQuantity() {
    setQuantity((prev) => (prev > minNum ? prev - 1 : prev));
  }

  function increaseQuantity() {
    setQuantity((prev) => (prev < maxNum ? prev + 1 : prev));
  }

  async function addToCart() {
    if (quantity > 0) {
      await addItemToCart({ ...item, quantity });
      showResponse("Item added to your cart!");
    } else {
      showResponse("Please add a quantity before adding to cart");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
    >
      <Image
        source={{ uri: item.src }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
      </View>

      <View style={styles.quantityContainer}>
        <QuantityStepper
          quantity={quantity}
          min={minNum}
          max={maxNum}
          onDecrease={decreaseQuantity}
          onIncrease={increaseQuantity}
        />
      </View>

      <View style={styles.cartButtonContainer}>
        <TouchableOpacity
          onPress={addToCart}
          style={[
            styles.cartButton,
            {
              backgroundColor:
                quantity > minNum ? colors.green : colors.medium,
            },
          ]}
        >
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
        <Text style={styles.responseText}>{response}</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
  cartButton: {
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    width: "95%",
  },
  cartButtonText: {
    color: colors.white,
    textAlign: "center",
  },
  cartButtonContainer: {
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    marginTop: 40,
  },
  responseText: {
    color: colors.medium,
    fontSize: 16,
    marginTop: 20,
    textAlign: "left",
  },
});

export default ListingDetailsScreen;

import { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Text from "../Text";
import colors from "../../config/colors";
import { useCart } from "../../context/CartContext";
import QuantityStepper from "../QuantityStepper";

function CartItem({ title, subTitle, imageUrl, onPress, data }) {
  const [quantity, setQuantity] = useState(data.quantity);
  const { deleteItemFromCart, changeCartItemQuantity } = useCart();
  const minNum = 1;
  const maxNum = 10;

  useEffect(() => {
    setQuantity(data.quantity);
  }, [data.quantity]);

  const decreaseQuantity = () => {
    if (quantity <= minNum) return;
    const next = quantity - 1;
    setQuantity(next);
    changeCartItemQuantity({ id: data.id, quantity: next });
  };

  const increaseQuantity = () => {
    if (quantity >= maxNum) return;
    const next = quantity + 1;
    setQuantity(next);
    changeCartItemQuantity({ id: data.id, quantity: next });
  };

  return (
    <View style={styles.cartItem}>
      <TouchableOpacity
        style={styles.main}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subTitle} numberOfLines={2}>
            {subTitle}
          </Text>
        </View>
      </TouchableOpacity>

      <QuantityStepper
        quantity={quantity}
        min={minNum}
        max={maxNum}
        onDecrease={decreaseQuantity}
        onIncrease={increaseQuantity}
      />

      <TouchableOpacity
        onPress={() => deleteItemFromCart(data.id)}
        style={styles.deleteIconContainer}
      >
        <Text style={styles.deleteIcon}>x</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    backgroundColor: colors.white,
    overflow: "hidden",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  main: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  detailsContainer: {
    padding: 10,
    flex: 1,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  subTitle: {
    color: colors.secondary,
    fontWeight: "bold",
  },
  title: {
    lineHeight: 30,
  },
  deleteIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: {
    color: colors.black,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default CartItem;

import {useState, useEffect} from "react";
import { View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

import Text from "../Text";
import colors from "../../config/colors";
import { useCart } from "../../context/CartContext";

function CartItem({ title, subTitle, imageUrl, onPress, thumbnailUrl, data }) {
    const [quantity, setQuantity] = useState(data.quantity);
    const { deleteItemFromCart, changeCartItemQuantity} = useCart();

    let minNum = 1;
    let maxNum = 10;

    useEffect(() => {
        changeCartItemQuantity({ id: data.id, quantity });
    }, [quantity]);

    useEffect(() => {
        setQuantity(data.quantity);
    }, [data]);

    function decreaseQuantity() {
        let quantityNum = quantity;
        if (quantityNum > minNum) {
            quantityNum = quantityNum - 1;
            setQuantity(quantityNum);
        }
    }

    function increaseQuantity() {
        let quantityNum = quantity;
        if (quantityNum < maxNum) {
            quantityNum = quantityNum + 1;
            setQuantity(quantityNum);
        }
    }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.cartItem}>
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

          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={decreaseQuantity} style={styles.counterButton}>
              <Text style={[styles.buttonText, {color: quantity == minNum ? colors.medium : colors.black}]}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantityText}>{data.quantity}</Text>

            <TouchableOpacity onPress={increaseQuantity} style={styles.counterButton}>
              <Text style={[styles.buttonText, {color: quantity < maxNum ? colors.black : colors.medium}]}>+</Text>
            </TouchableOpacity>
          </View>

        </View>



        <TouchableOpacity onPress={() => deleteItemFromCart(data.id)} style={styles.deleteIconContainer}>
            <Text style={styles.deleteIcon}>x</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    backgroundColor: colors.white,
    marginBottom: 20,
    overflow: "hidden",
    gap: '2%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  detailsContainer: {
    padding: 10,
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  image: {
    width: "30%",
    height: 110,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  subTitle: {
    color: colors.secondary,
    fontWeight: "bold",

  },
  title: {
    lineHeight: 30
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
    counterButton: {
        padding: 5,
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: colors.lightGrey,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 16,
        minWidth: 30,
        textAlign: 'center',
    },
    deleteIconContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        //backgroundColor: colors.danger,
        borderRadius: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
      },
      deleteIcon: {
        color: colors.black,
        fontSize: 20,
        fontWeight: 'bold',
      },
});

export default CartItem;

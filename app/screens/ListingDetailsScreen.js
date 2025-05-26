import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
  Alert
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { useCart } from "../context/CartContext";

import colors from "../config/colors";
import Text from "../components/Text";

function ListingDetailsScreen({ route }) {
  const item = route.params;
  const [quantity, setQuantity] = useState(0);
  const [cartItem, setCartItem] = useState();
  const {  addItemToCart} = useCart();
  const [response, setResponse] = useState('');

  let minNum = 0;
  let maxNum = 10;


  useEffect(() => {
    if(item.quantity) setQuantity(item.quantity);
  }, []);

  function showResponse(text) {
    setResponse(text);
    setTimeout(() => {
      setResponse('');
    }, 2000);
  }

  useEffect(() => {
    const itemWithQuantity = {
      ...item,
      quantity: quantity,
    };
    setCartItem(itemWithQuantity);
  }, [quantity]);

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

  async function addToCart() {
    if(quantity > 0) {
      addItemToCart(cartItem);
      showResponse('Item added to your cart!');
    } else {
      //Alert.alert('Please select the quantity of the product.')
      showResponse('Please add a quantity before adding to cart');
    }
  }


  return (
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
    >
      <Image
        style={styles.image}
        preview={{ uri: item.src }}
        tint="light"
        uri={item.src}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={decreaseQuantity} style={styles.counterButton}>
          <Text style={[styles.buttonText, {color: quantity == minNum ? colors.medium : colors.black}]}>-</Text>
        </TouchableOpacity>

        <Text style={styles.quantityText}>{quantity}</Text>

        <TouchableOpacity onPress={increaseQuantity} style={styles.counterButton}>
          <Text style={[styles.buttonText, {color: quantity < maxNum ? colors.black : colors.medium}]}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cartButtonContainer}>
        <TouchableOpacity onPress={addToCart} style={[styles.cartButton, {backgroundColor: quantity > minNum ? colors.green : colors.medium}]}>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft:10,
  },
  counterButton: {
    padding: 10,
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
  cartButton: {
    padding: 10,
    //backgroundColor: colors.green,
    borderRadius: 10,
    justifyContent: 'center',
    width: '95%',
  },
  cartButtonText: {
    color: colors.white,
    textAlign: 'center',
  },
  cartButtonContainer: {
    justifyContent:'center',
    width: '100%',
    alignItems: "center",
    marginTop: 40,
  },
  responseText: {
    color: colors.medium,
    fontSize: 16,
    marginTop: 20,
    textAlign: 'left',
  }
});

export default ListingDetailsScreen;

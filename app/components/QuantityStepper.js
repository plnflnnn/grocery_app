import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../config/colors";

function QuantityStepper({ quantity, min = 0, max = 10, onDecrease, onIncrease }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDecrease} style={styles.button}>
        <Text
          style={[
            styles.buttonText,
            { color: quantity <= min ? colors.medium : colors.black },
          ]}
        >
          -
        </Text>
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity onPress={onIncrease} style={styles.button}>
        <Text
          style={[
            styles.buttonText,
            { color: quantity < max ? colors.black : colors.medium },
          ]}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: colors.lightGrey,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 16,
    minWidth: 30,
    textAlign: "center",
  },
});

export default QuantityStepper;

import { Platform } from "react-native";
import {StyleSheet} from "react-native";

import colors from "./colors";

const defaultStyles = StyleSheet.create({
  colors,
  container: {
    padding: 10,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  text: {
    color: colors.dark,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
  },
  input: {
    width: "100%",
  },
  errorText: {
      color: "red",
      marginBottom: 10,
  },
  fieldContainer: {
      backgroundColor: colors.light,
      borderRadius: 25,
      flexDirection: "row",
      padding: 15,
      marginVertical: 10,
      alignContent: 'center',
      alignItems: 'center'
  },
  icon: {
      marginRight: 10,
  },
});

export default defaultStyles;
import { ImageBackground, StyleSheet, View, Image, Text } from "react-native";

import Button from "../components/Button";
import routes from "../navigation/routes";
import colors from "../config/colors";

function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      blurRadius={0}
      style={styles.background}
      source={require("../assets/background.jpg")}
    >
      <View style={styles.taglineContainer}>
        <Text style={styles.tagline}>
          Eat fresh.
        </Text>
        <Text style={styles.tagline}>
          Eat clean.
        </Text>
        <Text style={styles.tagline}>
          Eat healthy.
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title="Login"
          onPress={() => navigation.navigate(routes.LOGIN)}
        />
        <Button
          title="Register"
          color="black"
          onPress={() => navigation.navigate(routes.REGISTER)}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
  },
  taglineContainer: {
    position: "absolute",
    top: '50%',
    alignItems: "center",
  },
  tagline: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.white
  },
});

export default WelcomeScreen;

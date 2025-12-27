import Constants from "expo-constants";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Screen({ children, style = {} }) {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={[styles.view, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 10,
  },
  view: {
    flex: 1,
    padding: 0,
    margin: 0
  },
});

export default Screen;

import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Screen({ children, style = {} }) {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={styles.view}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 10,
  },
  view: {
    flex: 1,
  },
});

export default Screen;

import { StyleSheet, View } from "react-native";
import { useContext } from "react";
import ListItem from "../components/lists/ListItem";
import colors from "../config/colors";
import Icon from "../components/Icon";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import useUser from "../hooks/useUser";
import UserContext from "../auth/context";

function AccountScreen({ navigation }) {
  const { logOut } = useUser();
  const { user } = useContext(UserContext);

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={user.userName}
          subTitle={user.email}
          image={require("../assets/logo.png")}
          arrow={false}
        />
      </View>

      <ListItem
        title="Change Password"
        IconComponent={<Icon name="key-change" iconColor="#000" backgroundColor="#eee" />}
        onPress={() => navigation.navigate(routes.CHANGE_PASSWORD)}
      />

      <ListItem
        title="Log Out"
        IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
        onPress={() => logOut()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  container: {
    marginVertical: 20,
  },
});

export default AccountScreen;

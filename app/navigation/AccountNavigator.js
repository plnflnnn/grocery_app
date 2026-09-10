import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../screens/AccountScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import routes from "./routes";

const Stack = createNativeStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={routes.ACCOUNT_HOME}
      component={AccountScreen}
      options={{ title: "Account" }}
    />
    <Stack.Screen name={routes.CHANGE_PASSWORD} component={ChangePasswordScreen} />
  </Stack.Navigator>
);

export default AccountNavigator;

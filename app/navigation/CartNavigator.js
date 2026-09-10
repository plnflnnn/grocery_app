import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import CartScreen from "../screens/CartScreen";
import routes from "./routes";

const Stack = createNativeStackNavigator();

const CartNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={routes.CART_HOME}
      component={CartScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.LISTING_DETAILS}
      component={ListingDetailsScreen}
      options={({ route }) => ({ title: route.params?.name || "Details" })}
    />
  </Stack.Navigator>
);

export default CartNavigator;

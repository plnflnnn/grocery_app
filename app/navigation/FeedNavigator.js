import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListingsScreen from "../screens/ListingsScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import routes from "./routes";

const Stack = createNativeStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name={routes.HOME} component={ListingsScreen} />
    <Stack.Screen
      name={routes.LISTING_DETAILS}
      component={ListingDetailsScreen}
      options={({ route }) => ({ title: route.params?.name || "Details" })}
    />
  </Stack.Navigator>
);

export default FeedNavigator;

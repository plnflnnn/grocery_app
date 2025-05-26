import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SQLiteProvider } from 'expo-sqlite';
import { StripeProvider } from "@stripe/stripe-react-native";

import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import OfflineNotice from "./app/components/OfflineNotice";
import AuthNavigator from "./app/navigation/AuthNavigator";
import UserContext from "./app/auth/context";
import storage from "./app/auth/storage";
import { navigationRef } from "./app/navigation/rootNavigation";
import LoadingOverlay from "./app/components/LoadingOverlay";
import { CartProvider } from "./app/context/CartContext";
import { stripeKey } from "./app/settings/index";

export default function App() {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [publishableKey, setPublishableKey] = useState(stripeKey);
  const { getUser } = storage;

  const restoreUser = async () => {
    try {
      const storedUser = await getUser();
      if (storedUser) setUser(storedUser);
    } catch (error) {
      console.error("Failed to restore user:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await restoreUser();
      setIsReady(true);
    };
    init();
  }, []);


  useEffect(() => {
   console.log(user);
  }, [user]);

  return (
    <SQLiteProvider databaseName="grocery_store.db">
      <StripeProvider
        publishableKey={publishableKey}
        merchantIdentifier="merchant.identifier"
        urlScheme="myapp"
      >
        <UserContext.Provider value={{ user, setUser }}>
          <CartProvider>
            <OfflineNotice />
            <LoadingOverlay visible={!isReady} />
            {isReady && (
              <NavigationContainer ref={navigationRef} theme={navigationTheme}>
                {user ? <AppNavigator /> : <AuthNavigator />}
              </NavigationContainer>
            )}
          </CartProvider>
        </UserContext.Provider>
      </StripeProvider>
    </SQLiteProvider>
  );
}

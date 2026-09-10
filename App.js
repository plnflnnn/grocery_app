import "react-native-gesture-handler";
import { useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
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
import { stripeKey } from "./app/config/env";

export default function App() {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const restoreUser = async () => {
      try {
        const storedUser = await storage.getUser();
        setUser(storedUser || null);
      } catch (error) {
        console.error("Failed to restore user:", error);
        setUser(null);
      } finally {
        setIsReady(true);
      }
    };

    restoreUser();
  }, []);

  if (!isReady) {
    return <LoadingOverlay visible />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider
        publishableKey={stripeKey}
        merchantIdentifier="merchant.com.plnfln.groceryapp"
        urlScheme="groceryapp://stripe-redirect"
      >
        <UserContext.Provider value={{ user, setUser }}>
          <CartProvider>
            <OfflineNotice />
            <NavigationContainer
              ref={navigationRef}
              theme={navigationTheme}
              key={user ? "app" : "auth"}
            >
              {user ? <AppNavigator /> : <AuthNavigator />}
            </NavigationContainer>
          </CartProvider>
        </UserContext.Provider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}

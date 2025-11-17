

// app/navigation/AuthNavigator.js
import React, { useContext, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import routes from "./routes";
import UserContext from "../auth/context";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log("🟥 AuthNavigator render, user =", user);
  }, [user]);

  return (
    <Stack.Navigator>
      <Stack.Screen name={routes.WELCOME} component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name={routes.LOGIN} component={LoginScreen} />
      <Stack.Screen name={routes.REGISTER} component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;


// import { createStackNavigator } from "@react-navigation/stack";

// import LoginScreen from "../screens/LoginScreen";
// import RegisterScreen from "../screens/RegisterScreen";
// import WelcomeScreen from "../screens/WelcomeScreen";

// const Stack = createStackNavigator();

// const AuthNavigator = () => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="Welcome"
//       component={WelcomeScreen}
//       options={{ headerShown: false }}
//     />
//     <Stack.Screen name="Login" component={LoginScreen} />
//     <Stack.Screen name="Register" component={RegisterScreen} />
//   </Stack.Navigator>
// );

// export default AuthNavigator;

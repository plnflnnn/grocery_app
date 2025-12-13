import { Platform } from "react-native";
import { stripe_key, api_url } from "@env";

export let apiUrl = "";

if (__DEV__) {
    const localIP = "192.168.219.105";
    apiUrl = Platform.OS === "android"
      ? "http://10.0.2.2:8080"
      : `http://${localIP}:8080`;
  } else {
    apiUrl = api_url;
  }

  //apiUrl = api_url;

  export const stripeKey = stripe_key;

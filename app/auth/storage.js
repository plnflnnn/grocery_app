import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "token";
const USER_KEY = "user";

async function saveUser(user, token) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, String(token));
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user/token", error);
  }
}

async function getToken() {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token", error);
    return null;
  }
}

async function getUser() {
  try {
    const token = await getToken();
    const rawUser = await SecureStore.getItemAsync(USER_KEY);

    if (!token || !rawUser) return null;

    return { ...JSON.parse(rawUser), token };
  } catch (error) {
    console.error("Error getting user", error);
    return null;
  }
}

async function deleteUser() {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
  } catch (error) {
    console.error("Error deleting user keys", error);
  }
}

export default { saveUser, getUser, getToken, deleteUser };

import * as SecureStore from "expo-secure-store";

async function saveUser(user, token) {
  try {
    await SecureStore.setItemAsync("token", token.toString());

    for (const property in user) {
      const value = user[property];

      if (value !== undefined && value !== null) {
        await SecureStore.setItemAsync(property, JSON.stringify(value));
      } else {
        console.warn(`Skipped saving ${property} because it was undefined or null`);
      }
    }

    console.log('Token and user saved to SecureStore');
  } catch (error) {
    console.log("Error saving user/token", error);
  }
}

async function getUser() {
  try {
    const id = await SecureStore.getItemAsync('id');
    const email = await SecureStore.getItemAsync('email');
    const name = await SecureStore.getItemAsync('userName');
    const token = await SecureStore.getItemAsync('token');

    if (id && email && name && token) {
      return {
        id: JSON.parse(id),
        email: JSON.parse(email),
        userName: JSON.parse(name),
        token: token
      };
    } else {
      console.log('No user found.');
      return null;
    }
  } catch (error) {
    console.log("Error getting user", error);
  }
}

async function deleteUser() {
  const keys = ['id', 'email', 'userName', 'token'];
  try {
    for (const key of keys) {
      await SecureStore.deleteItemAsync(key);
    }
    console.log('All user keys deleted from SecureStore');
  } catch (error) {
    console.log("Error deleting user keys", error);
  }
};

async function changeUser(property, value) {
  try {
    await SecureStore.setItemAsync(property, JSON.stringify(value));
    console.log(`User's ${property} changed in Secure Storage`);
  } catch (error) {
    console.log(`Error changing ${property} in Secure Storage`, error);
  }
};

export default { saveUser, getUser, deleteUser, changeUser };

import { useContext, useState } from "react";
import AuthContext from "../auth/context";
import storage from "../auth/storage";
import { apiUrl } from "../settings/index";

export default useUser = () => {
  const { user, setUser } = useContext(AuthContext);
  const [state, setState] = useState({
    error: false,
    loading: false,
    response: '',
  });

  const { saveUser, getUser, deleteUser, changeUser } = storage;

  const handleAsync = async (fn) => {
    setState(prev => ({ ...prev, loading: true, error: false, response: '' }));
    try {
      await fn();
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: true }));
      console.error(err);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signUp = async (userData) => {
    await handleAsync(async () => {
      const res = await fetch(`${apiUrl}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      let result;
      try {
        result = await res.json();
      } catch (err) {
        const text = await res.text();
        setState(prev => ({ ...prev, loading: false, error: true, response: 'Something went wrong' }));
        throw new Error(`Failed to parse JSON. Response: ${text}`);
      }

      if (!res.ok) {
        setState(prev => ({ ...prev, loading: false, error: true, response: 'Something went wrong' }));
        throw new Error(`Signup failed: ${res.status}`);
      }
      const { user, token } = result;
      const { userName, id} = user;
      const userObj = { id, email: userData.email, userName };
      setTimeout(async () => {
        setUser(userObj);
        await saveUser(userObj, token);
      }, 100); 
    });
  };


  const logIn = async ({ email, password }) => {
    await handleAsync(async () => {
      const res = await fetch(`${apiUrl}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const text = await res.text(); 
  
      let result;
      try {
        result = JSON.parse(text); 
      } catch (err) {
        throw new Error(`Failed to parse JSON. Response: ${text}`);
      }
  
      if (!res.ok) throw new Error(result.error || 'Login failed');
  
      const { token, user } = result;
      if (!user) throw new Error("No user returned from server");
  
      const userObj = {
        id: user.id,
        email: user.email,
        userName: user.userName,
      };
  
      setUser(userObj);
      await saveUser(userObj, token);
    });
  };
  

  const logOut = () => {
    setUser(null);
    deleteUser();
  };

  const changePassword = async ({ oldPassword, newPassword }, resetForm) => {
    await handleAsync(async () => {
      const res = await fetch(`${apiUrl}/users/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, oldPassword, newPassword }),
      });
  
      let result;
      try {
        result = await res.json();
      } catch (err) {
        const text = await res.text();
        throw new Error(`Failed to parse JSON. Response: ${text}`);
      }
  
      if (!res.ok) {
        setState(prev => ({ ...prev, error: true, response: 'Incorrect old password' }));
        throw new Error(result.error);
      }
  
      const { token, message } = result;
      if (!token) {
        setState(prev => ({ ...prev, error: true, response: 'Something went wrong' }));
        throw new Error("No token returned from server");
      }
  
      // ✅ Save the token and user again to ensure they stay logged in
      await saveUser(user, token);
      setUser(user);
  
      setState(prev => ({ ...prev, response: message || 'Password updated successfully!' }));
      resetForm();
      setTimeout(() => setState(prev => ({ ...prev, response: '' })), 1000);
    });
  };
  

  return {
    logIn,
    logOut,
    signUp,
    changePassword,
    ...state
  };
};

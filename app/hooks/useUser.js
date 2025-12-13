import { useContext, useState } from "react";
import UserContext from "../auth/context";
import storage from "../auth/storage";
import { apiUrl } from "../settings/index";

function useUser() {
  const { user, setUser } = useContext(UserContext);
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
        if (res.status === 409) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: true,
            response: 'This email is already registered',
          }));
          throw new Error(`This email is already registered: ${res.status}`);
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            error: true,
            response: 'Something went wrong',
          }));
          throw new Error(`Signup failed: ${res.status}`);
        }
      }

      const { user, token } = result;
      await saveUser(user, token);
      setUser(user);
    });
  };


const logIn = async ({ email, password }) => {
  await handleAsync(async () => {
    const res = await fetch(`${apiUrl}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    let result;
    try {
      result = await res.json();
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: true,
        response: 'Server error. Please try again.',
      }));
      throw err;
    }

    if (!res.ok) {
      if (res.status === 401) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: true,
          response: 'Invalid email or password',
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: true,
          response: result.error || 'Login failed',
        }));
      }
      throw new Error(result.error || 'Login failed');
    }

    const { token, user } = result;
    if (!user) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: true,
        response: 'User data missing',
      }));
      throw new Error('User not returned from server');
    }

    await saveUser(user, token);
    setUser(user);
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

export default useUser;
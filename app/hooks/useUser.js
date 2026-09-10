import { useContext, useState } from "react";
import UserContext from "../auth/context";
import storage from "../auth/storage";
import { useHttp } from "./useHttp";

function useUser() {
  const { user, setUser } = useContext(UserContext);
  const { request } = useHttp();
  const [state, setState] = useState({
    error: false,
    loading: false,
    response: "",
  });

  const handleAsync = async (fn) => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: false,
      response: "",
    }));
    try {
      await fn();
    } catch (err) {
      setState((prev) => ({ ...prev, error: true }));
      console.error(err);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const signUp = async (userData) => {
    await handleAsync(async () => {
      try {
        const result = await request(
          "/users/signup",
          "POST",
          JSON.stringify(userData)
        );
        const { user: nextUser, token } = result;
        await storage.saveUser(nextUser, token);
        setUser(nextUser);
      } catch (err) {
        const message =
          err.status === 409
            ? "This email is already registered"
            : "Something went wrong";
        setState((prev) => ({ ...prev, error: true, response: message }));
        throw err;
      }
    });
  };

  const logIn = async ({ email, password }) => {
    await handleAsync(async () => {
      try {
        const result = await request(
          "/users/login",
          "POST",
          JSON.stringify({ email, password })
        );

        const { token, user: nextUser } = result;
        if (!nextUser) {
          setState((prev) => ({
            ...prev,
            error: true,
            response: "User data missing",
          }));
          throw new Error("User not returned from server");
        }

        await storage.saveUser(nextUser, token);
        setUser(nextUser);
      } catch (err) {
        const message =
          err.status === 401
            ? "Invalid email or password"
            : "Login failed";
        setState((prev) => ({ ...prev, error: true, response: message }));
        throw err;
      }
    });
  };

  const logOut = async () => {
    setUser(null);
    await storage.deleteUser();
  };

  const changePassword = async ({ oldPassword, newPassword }, resetForm) => {
    await handleAsync(async () => {
      try {
        const result = await request(
          "/users/change-password",
          "POST",
          JSON.stringify({
            userId: user.id,
            oldPassword,
            newPassword,
          })
        );

        const { token, message } = result;
        if (!token) {
          setState((prev) => ({
            ...prev,
            error: true,
            response: "Something went wrong",
          }));
          throw new Error("No token returned from server");
        }

        await storage.saveUser(user, token);
        setUser(user);
        setState((prev) => ({
          ...prev,
          response: message || "Password updated successfully!",
        }));
        resetForm();
        setTimeout(
          () => setState((prev) => ({ ...prev, response: "" })),
          1000
        );
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: true,
          response: "Incorrect old password",
        }));
        throw err;
      }
    });
  };

  return {
    logIn,
    logOut,
    signUp,
    changePassword,
    ...state,
  };
}

export default useUser;

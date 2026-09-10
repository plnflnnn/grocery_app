import { useCallback } from "react";
import { apiUrl } from "../config/env";

export const useHttp = () => {
  const request = useCallback(
    async (
      url,
      method = "GET",
      body = null,
      headers = { "Content-Type": "application/json" }
    ) => {
      try {
        const response = await fetch(`${apiUrl}${url}`, {
          method,
          body,
          headers,
        });

        if (!response.ok) {
          const error = new Error(
            `Could not fetch ${url}, status: ${response.status}`
          );
          error.status = response.status;
          throw error;
        }

        const data = await response.json();
        return data;
      } catch (e) {
        throw e;
      }
    },
    []
  );

  return { request };
};

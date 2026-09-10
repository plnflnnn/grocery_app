import { useCallback, useEffect, useState } from "react";
import { getOrCreateDB } from "../db";

export default function useDB() {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const database = await getOrCreateDB();
        if (mounted) setDb(database);
      } catch (error) {
        console.error("Error opening DB:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const withDB = useCallback(async (fn) => {
    const database = db ?? (await getOrCreateDB());
    if (!db) setDb(database);
    return fn(database);
  }, [db]);

  return { db, loading, withDB };
}

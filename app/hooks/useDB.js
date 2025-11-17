import * as SQLite from "expo-sqlite";
import { useState, useEffect, useCallback } from "react";

let dbInstance = null;

async function getOrCreateDB() {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabaseAsync("grocery_store.db");
  console.log("DB opened");
  return dbInstance;
}

export default function useDB() {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);

  const initDb = useCallback(async () => {
    try {
      const database = await getOrCreateDB();
      setDb(database);
    } catch (e) {
      console.log("Error opening DB:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initDb();
  }, [initDb]);

  const withDB = useCallback(
    async (fn) => {
      if (!db) {
        console.log("DB is not ready yet");
        return;
      }
      return fn(db);
    },
    [db]
  );

  return {
    db,
    loading,
    withDB,
    initDb,
  };
}

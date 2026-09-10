import * as SQLite from "expo-sqlite";

let dbInstance = null;

export async function getOrCreateDB() {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabaseAsync("grocery_store.db");
  return dbInstance;
}

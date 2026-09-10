import { useEffect, useState } from "react";
import {
  ensureListingsTable,
  filterListings,
  getAllListings,
  upsertListings,
} from "../db/listings";
import { mapListing } from "../utils/mapListing";
import useDB from "./useDB";
import { useHttp } from "./useHttp";

const DEFAULT_CATEGORIES = [
  "vegetables",
  "fruits",
  "dairy products",
  "seafood",
  "meat",
  "poultry",
];

let listingsLoadInFlight = false;

export default function useListings() {
  const { db, withDB } = useDB();
  const { request } = useHttp();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [query, setQuery] = useState("");
  const [filterSelections, setFilterSelections] = useState([]);

  const loadFromServer = async () => {
    if (listingsLoadInFlight) return;
    listingsLoadInFlight = true;
    setError(false);
    setLoading(true);

    try {
      await withDB(async (database) => {
        await ensureListingsTable(database);

        try {
          const response = await request("/listings/items");
          const items = (Array.isArray(response) ? response : []).map(
            mapListing
          );
          await upsertListings(database, items);

          const loadedCategories = [...new Set(items.map((item) => item.category))];

          if (loadedCategories.length > 0) {
            setCategories(loadedCategories);
          }
        } catch (fetchError) {
          console.error(
            "Listings fetch failed, using local cache:",
            fetchError
          );
        }

        const allItems = await getAllListings(database);
        setError(!allItems.length);
      });
    } catch (err) {
      setError(true);
      console.error("getListings error:", err);
    } finally {
      listingsLoadInFlight = false;
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const groceries = await withDB((database) =>
        filterListings(database, query, filterSelections)
      );
      setData(groceries || []);
    } catch (err) {
      console.error("Filter listings error:", err);
    }
  };

  useEffect(() => {
    if (db) loadFromServer();
  }, [db]);

  useEffect(() => {
    if (!db || loading) return;
    applyFilters();
  }, [db, query, filterSelections, loading]);

  const toggleFilter = (category) => {
    setFilterSelections((selected) => {
      if (selected.includes(category)) {
        return selected.filter((item) => item !== category);
      }
      return [...selected, category];
    });
  };

  return {
    data,
    categories,
    loading,
    error,
    query,
    setQuery,
    filterSelections,
    toggleFilter,
    refresh: loadFromServer,
  };
}

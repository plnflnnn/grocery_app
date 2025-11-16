import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";

import Button from "../components/Button";
import Card from "../components/Card";
import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/Text";
import { apiUrl } from "../settings/index";

function ListingsScreen({ navigation }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([
    "vegetables",
    "fruits",
    "dairy products",
    "seafood",
    "meat",
    "poultry",
  ]);
  const [searchBarText, setSearchBarText] = useState("");
  const [query, setQuery] = useState("");
  const [filterSelections, setFilterSelections] = useState([]);

  const db = useSQLiteContext();


  const fetchData = async () => {
    setError(false);
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/listings/items`);
      setLoading(false);
      if (!response.ok) {
        setError(true);
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);

      const categoriesSet = new Set();
      result.forEach((item) => {
        categoriesSet.add(item.item_category);
      });
      const categoriesArray = Array.from(categoriesSet);
      setCategories(categoriesArray);

      return result;
    } catch (error) {
      setError(true);
      console.error("listings fetchData error:", error);
    }
  };

  async function getGroceryItems() {
    try {
      return await db.getAllAsync("SELECT * FROM groceryitems");
    } catch (e) {
      console.log(`getGroceryItems: An error occurred ${e}`);
      return [];
    }
  }

  async function saveGroceryItems(menuItems) {
    try {
      const values = menuItems
        .map(
          (item) =>
            `(${item.id}, "${item.item_name}", "${item.item_src}", "${item.item_category}", "${item.item_price}")`
        )
        .join(", ");
        console.log('values ' + values);
      await db.execAsync(
        `INSERT INTO groceryitems (id, name, src, category, price) VALUES ${values}`
      );
      console.log("Items inserted into groceryitems");
    } catch (e) {
      console.log(`saveGroceryItems: An error occurred ${e}`);
    }
  }

  async function createDb() {
    const items = await fetchData();
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS groceryitems (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT,
          src TEXT,
          category TEXT,
          price DECIMAL(10, 2)
        );
      `);
      console.log("Table 'groceryitems' created or already exists");

      if (items && items.length > 0) {
        await saveGroceryItems(items);
      }
    } catch (e) {
      console.log(`createDb: An error occurred ${e}`);
    }
  }

  async function filterByQueryAndCategories(query, filterSelections) {
    const hasQuery = query.trim() !== "";
    try {
      let sql = "SELECT * FROM groceryitems";

      if (filterSelections.length > 0 || hasQuery) {
        const whereClauses = [];

        if (filterSelections.length > 0) {
          const categoryCondition = `(${filterSelections
            .map((cat) => `category='${cat.toLowerCase()}'`)
            .join(" OR ")})`;
          whereClauses.push(categoryCondition);
        }

        if (hasQuery) {
          whereClauses.push(`name LIKE '%${query}%'`);
        }

        sql += ` WHERE ${whereClauses.join(" AND ")}`;
      }

      return await db.getAllAsync(sql);
    } catch (e) {
      console.log(`filter: An error occurred ${e}`);
    }
  }

  async function handleFilter() {
    try {
      const groceries = await filterByQueryAndCategories(
        query,
        filterSelections
      );
      if (groceries) setData(groceries);
    } catch (e) {
      Alert.alert(e.message);
      console.log(e.message);
    }
  }

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    setQuery(text);
  };

  const handleFiltersChange = async (section) => {
    if (filterSelections.includes(section)) {
      setFilterSelections(
        filterSelections.filter((cat) => cat !== section)
      );
    } else {
      setFilterSelections([...filterSelections, section]);
    }
  };

  useEffect(() => {
    getListings();
    console.log("ListingsScreen mounted");
  }, []);

  useEffect(() => {
    handleFilter();
  }, [filterSelections, query]);


  async function getListings() {
    try {
      await createDb();
      const groceryItems = await getGroceryItems();
      setData(groceryItems);
    } catch (e) {
      console.log("getListings error:", e);
    }
  }

  return (
    <>
      <Screen style={styles.screen}>
        {error && (
          <>
            <AppText style={styles.error}>Couldn't retrieve the listings.</AppText>
            <Button title="Retry" style={styles.error} onPress={getListings} />
          </>
        )}

        <Searchbar
          placeholder="Search"
          placeholderTextColor="grey"
          onChangeText={handleSearchChange}
          value={searchBarText}
          style={styles.searchBar}
          //iconColor="#F4CE14"
          iconColor="#495E57"
          inputStyle={{ color: 'white' }}
          elevation={0}
          color='#495E57'

        />

        <View style={styles.filtersContainer}>
          {categories.map((section, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleFiltersChange(section)}
              style={[
                styles.filterBtn,
                {
                  backgroundColor: filterSelections.includes(section)
                    ? colors.green
                    : colors.lightGrey,
                },
              ]}
            >
              <Text
                style={{
                  fontWeight: "600",
                  color: filterSelections.includes(section)
                    ? colors.white
                    : colors.green,
                }}
              >
                {section}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={data}
          keyExtractor={(listing) => listing.id.toString()}
          renderItem={({ item }) => (
            <Card
              title={item.name || ""}
              subTitle={`$${item.price && parseFloat(item.price).toFixed(2) || "0.00"}`}
              imageUrl={item.src}
              onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
              thumbnailUrl={item.src}
            />
          )}
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  filtersContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  filterBtn: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 2,
    marginRight: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#495E57",
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 20,
    height: 30,
  },
  error: {
    zIndex: 100
  }
});

export default ListingsScreen;

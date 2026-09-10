import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Searchbar } from "react-native-paper";
import ActivityIndicator from "../components/ActivityIndicator";
import Button from "../components/Button";
import Card from "../components/Card";
import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/Text";
import useListings from "../hooks/useListings";

function ListingsScreen({ navigation }) {
  const {
    data,
    categories,
    loading,
    error,
    query,
    setQuery,
    filterSelections,
    toggleFilter,
    refresh,
  } = useListings();

  return (
    <>
      <ActivityIndicator visible={loading} />
      <Screen style={styles.screen}>
        {error && (
          <>
            <AppText style={styles.error}>
              Couldn't retrieve the listings.
            </AppText>
            <Button title="Retry" style={styles.error} onPress={refresh} />
          </>
        )}

        <Searchbar
          placeholder="Search"
          placeholderTextColor="grey"
          onChangeText={setQuery}
          value={query}
          style={styles.searchBar}
          iconColor="#495E57"
          inputStyle={{ color: "white" }}
          elevation={0}
        />

        <View style={styles.filtersContainer}>
          {categories.map((section) => (
            <TouchableOpacity
              key={section}
              onPress={() => toggleFilter(section)}
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
              subTitle={`$${
                item.price != null ? parseFloat(item.price).toFixed(2) : "0.00"
              }`}
              imageUrl={item.src}
              onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
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
    height: 30,
  },
  error: {
    zIndex: 100,
  },
  searchBar: {
    marginBottom: 10,
  },
});

export default ListingsScreen;

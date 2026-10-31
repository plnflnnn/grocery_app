import {
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "../Text";
import colors from "../../config/colors";

function ListItem({
  title,
  subTitle,
  image,
  IconComponent,
  onPress,
  imageUri,
  arrow = true,
}) {
  const showImage = Boolean(image || imageUri);

  return (
    <TouchableHighlight
      underlayColor={colors.light}
      onPress={onPress}
      style={styles.touchable}
    >
      <View style={styles.container}>
        {IconComponent}
        {showImage && (
          <Image
            source={imageUri ? { uri: imageUri } : image}
            style={styles.image}
          />
        )}
        <View style={styles.detailsContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subTitle && (
            <Text style={styles.subTitle} numberOfLines={2}>{subTitle}</Text>
          )}
        </View>
        {arrow && (
          <MaterialCommunityIcons
            name="chevron-right"
            size={25}
            color={colors.medium}
          />
        )}
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: colors.white,
  },
  container: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  title: {
    fontWeight: "500",
  },
  subTitle: {
    color: colors.medium,
  },
});

export default ListItem;

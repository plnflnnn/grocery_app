import { View, TextInput, Text, Image } from "react-native";
import { Formik } from "formik";
import useUser from "../hooks/useUser";
import Screen from "../components/Screen";
import defaultStyles from "../config/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppButton from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";

import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

export default function LoginScreen({ navigation }) {

  const {logIn , error} = useUser();

  const handleSubmit = async (values) => {
    logIn(values);
  };

  return (
    <Screen style={defaultStyles.container}>
      <Image style={defaultStyles.logo} source={require("../assets/logo.png")} />

      <ErrorMessage
        error="Invalid email or password."
        visible={error}
      />

      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
        <>
          <View style={defaultStyles.fieldContainer}>
            <MaterialCommunityIcons
              name={"email"}
              size={20}
              color={defaultStyles.colors.medium}
              style={defaultStyles.icon}
            />
            <TextInput
              placeholder="Email"
              autoCapitalize="none"
              style={[defaultStyles.input, defaultStyles.text]}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
          </View>
          {touched.email && errors.email && (
            <Text style={[defaultStyles.text, defaultStyles.errorText]}>{errors.email}</Text>
          )}
          <View style={defaultStyles.fieldContainer}>
            <MaterialCommunityIcons
              name={"lock"}
              size={20}
              color={defaultStyles.colors.medium}
              style={defaultStyles.icon}
            />
            <TextInput
              placeholder="Password"
              autoCapitalize="none"
              secureTextEntry
              style={[defaultStyles.input, defaultStyles.text]}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
          </View>
          {touched.password && errors.password && (
              <Text style={[defaultStyles.text, defaultStyles.errorText]}>{errors.password}</Text>
          )}
          <AppButton title="Login" onPress={handleSubmit} />
        </>

      )}
    </Formik>
    </Screen>
  );
}

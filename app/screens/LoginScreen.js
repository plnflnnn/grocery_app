import React from "react";
import { View, TextInput, Button, StyleSheet, Text, Image } from "react-native";
import { Formik } from "formik";
import useUser from "../hooks/useUser";
import Screen from "../components/Screen";
import defaultStyles from "../config/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppButton from "../components/Button";
import { ErrorMessage } from "../components/forms";

import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

export default function LoginScreen({ navigation }) {

  const {logIn , error} = useUser();

  const handleSubmit = async (values) => {
    logIn(values);
    console.log(values);
  };

  return (
    <Screen style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logo.png")} />

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
          <View style={styles.fieldContainer}>
            <MaterialCommunityIcons
              name={"email"}
              size={20}
              color={defaultStyles.colors.medium}
              style={styles.icon}
            />
            <TextInput
              placeholder="Email"
              autoCapitalize="none"
              style={[styles.input, defaultStyles.text]}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
          </View>
          {touched.email && errors.email && (
            <Text style={[defaultStyles.text, styles.errorText]}>{errors.email}</Text>
          )}
          <View style={styles.fieldContainer}>
            <MaterialCommunityIcons
              name={"lock"}
              size={20}
              color={defaultStyles.colors.medium}
              style={styles.icon}
            />
            <TextInput
              placeholder="Password"
              autoCapitalize="none"
              secureTextEntry
              style={[styles.input, defaultStyles.text]}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
          </View>
          {touched.password && errors.password && (
              <Text style={[defaultStyles.text, styles.errorText]}>{errors.password}</Text>
          )}
          <AppButton title="Login" onPress={handleSubmit} />
        </>

      )}
    </Formik>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  fieldContainer: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
    alignContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  input: {
    width: "100%",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  fieldContainer: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
    alignContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginRight: 10,
  },
});


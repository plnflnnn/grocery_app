import * as Yup from "yup";
import { View, TextInput,Text } from "react-native";
import { Formik } from "formik";
import defaultStyles from "../config/styles";
import Screen from "../components/Screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppButton from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import LoadingOverlay from "../components/LoadingOverlay";
import useUser from "../hooks/useUser";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function RegisterScreen() {
  const { signUp, error, loading, response } = useUser();

  const handleSubmit = async (userData) => {
    const user = {
      userName: userData.name,
      email: userData.email,
      password: userData.password,
    };

    await signUp(user);
  };

  return (
    <>
      <LoadingOverlay visible={loading && !error} />
      <Screen style={defaultStyles.container}>
        <Formik
            initialValues={{ name: "", email: "", password: "" }}
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
              <ErrorMessage error={response} visible={error} />


              <View style={defaultStyles.fieldContainer}>
                <MaterialCommunityIcons
                  name={"account"}
                  size={20}
                  color={defaultStyles.colors.medium}
                  style={defaultStyles.icon}
                />
                <TextInput
                  placeholder="Name"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[defaultStyles.input, defaultStyles.text]}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                />
              </View>
              {touched.name && errors.name && (
                <Text style={[defaultStyles.text, defaultStyles.errorText]}>{errors.name}</Text>
              )}

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
                  autoCorrect={false}
                  keyboardType="email-address"
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
                  autoCorrect={false}
                  style={[defaultStyles.input, defaultStyles.text]}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                />
              </View>
              {touched.password && errors.password && (
                  <Text style={[defaultStyles.text, defaultStyles.errorText]}>{errors.password}</Text>
              )}
              <AppButton title="Register" onPress={handleSubmit} />
            </>

          )}
        </Formik>
      </Screen>
    </>
  );
}

export default RegisterScreen;

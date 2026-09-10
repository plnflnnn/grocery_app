import { Image } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import useUser from "../hooks/useUser";
import Screen from "../components/Screen";
import defaultStyles from "../config/styles";
import AppButton from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import FormField from "../components/forms/FormField";
import LoadingOverlay from "../components/LoadingOverlay";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().label("Password"),
});

export default function LoginScreen() {
  const { logIn, error, loading, response } = useUser();

  const handleSubmit = async (values) => {
    await logIn(values);
  };

  return (
    <>
      <LoadingOverlay visible={loading} />
      <Screen style={defaultStyles.container}>
        <Image
          style={defaultStyles.logo}
          source={require("../assets/logo.png")}
        />

        <ErrorMessage
          error={response || "Invalid email or password."}
          visible={error}
        />

        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ handleSubmit: submitForm }) => (
            <>
              <FormField
                name="email"
                icon="email"
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
              />
              <FormField
                name="password"
                icon="lock"
                placeholder="Password"
                autoCapitalize="none"
                secureTextEntry
                textContentType="password"
              />
              <AppButton title="Login" onPress={submitForm} />
            </>
          )}
        </Formik>
      </Screen>
    </>
  );
}

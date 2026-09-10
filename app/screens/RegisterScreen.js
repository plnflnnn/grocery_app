import * as Yup from "yup";
import { Formik } from "formik";
import defaultStyles from "../config/styles";
import Screen from "../components/Screen";
import AppButton from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import FormField from "../components/forms/FormField";
import LoadingOverlay from "../components/LoadingOverlay";
import useUser from "../hooks/useUser";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(8).label("Password"),
});

function RegisterScreen() {
  const { signUp, error, loading, response } = useUser();

  const handleSubmit = async (userData) => {
    await signUp({
      userName: userData.name,
      email: userData.email,
      password: userData.password,
    });
  };

  return (
    <>
      <LoadingOverlay visible={loading} />
      <Screen style={defaultStyles.container}>
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ handleSubmit: submitForm }) => (
            <>
              <ErrorMessage error={response} visible={error} />
              <FormField
                name="name"
                icon="account"
                placeholder="Name"
                autoCorrect={false}
                textContentType="name"
              />
              <FormField
                name="email"
                icon="email"
                placeholder="Email"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
              />
              <FormField
                name="password"
                icon="lock"
                placeholder="Password"
                autoCapitalize="none"
                secureTextEntry
                autoCorrect={false}
                textContentType="newPassword"
              />
              <AppButton title="Register" onPress={submitForm} />
            </>
          )}
        </Formik>
      </Screen>
    </>
  );
}

export default RegisterScreen;

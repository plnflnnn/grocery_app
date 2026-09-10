import * as Yup from "yup";
import { Text } from "react-native";
import { Formik } from "formik";
import ErrorMessage from "../components/ErrorMessage";
import FormField from "../components/forms/FormField";
import defaultStyles from "../config/styles";
import Screen from "../components/Screen";
import LoadingOverlay from "../components/LoadingOverlay";
import useUser from "../hooks/useUser";
import AppButton from "../components/Button";

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required().min(4).label("Old Password"),
  newPassword: Yup.string().required().min(8).label("New Password"),
});

function ChangePasswordScreen() {
  const { changePassword, error, response, loading } = useUser();

  const handleFormSubmit = async (values, { resetForm }) => {
    await changePassword(values, resetForm);
  };

  return (
    <>
      <LoadingOverlay visible={loading} />
      <Screen style={defaultStyles.container}>
        <Formik
          initialValues={{ oldPassword: "", newPassword: "" }}
          onSubmit={handleFormSubmit}
          validationSchema={validationSchema}
        >
          {({ handleSubmit }) => (
            <>
              {!error && response ? <Text>{response}</Text> : null}
              {error && <ErrorMessage error={response} visible={error} />}

              <FormField
                name="oldPassword"
                icon="lock"
                placeholder="Old Password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                textContentType="password"
              />
              <FormField
                name="newPassword"
                icon="lock"
                placeholder="New Password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                textContentType="newPassword"
              />
              <AppButton title="Change Password" onPress={handleSubmit} />
            </>
          )}
        </Formik>
      </Screen>
    </>
  );
}

export default ChangePasswordScreen;

import React from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import Text from "../components/Text";
import LoadingOverlay from "../components/LoadingOverlay";
import useUser from "../hooks/useUser";

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required().min(4).label("Password"),
  newPassword: Yup.string().required().min(4).label("Password"),
});

function ChangePasswordScreen(props) {
  const { changePassword, error, response, loading } = useUser();

  const handleSubmit = async (values, { resetForm }) => {
    await changePassword(values, resetForm);
  };

  return (
    <>
      <LoadingOverlay visible={loading} />
      <Screen style={styles.container}>
        {!error && response && <Text>{response}</Text>}

        <Form
          initialValues={{ password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <ErrorMessage error={response} visible={error} />

          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="oldPassword"
            placeholder="Old Password"
            secureTextEntry
            textContentType="password"
            style={styles.input}
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="newPassword"
            placeholder="New Password"
            secureTextEntry
            textContentType="password"
            style={styles.input}
          />

          <SubmitButton title="Change Password" />
        </Form>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    width: "100%",
  },
});

export default ChangePasswordScreen;

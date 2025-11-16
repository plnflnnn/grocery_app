import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, TextInput, Text } from "react-native";
import { Formik } from "formik";
import ErrorMessage from "../components/ErrorMessage";
import defaultStyles from "../config/styles";
import Screen from "../components/Screen";
import LoadingOverlay from "../components/LoadingOverlay";
import useUser from "../hooks/useUser";
import AppButton from "../components/Button";

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required().min(4).label("Old Password"),
  newPassword: Yup.string().required().min(4).label("New Password"),
});

function ChangePasswordScreen(props) {
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
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              {!error && response && <Text>{response}</Text>}
              {error && <ErrorMessage error={response} visible={error} />}

              <View style={defaultStyles.fieldContainer}>
                <MaterialCommunityIcons
                  name="lock"
                  size={20}
                  color={defaultStyles.colors.medium}
                  style={defaultStyles.icon}
                />
                <TextInput
                  placeholder="Old Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  textContentType="password"
                  style={[defaultStyles.input, defaultStyles.text]}
                  onChangeText={handleChange("oldPassword")}
                  onBlur={handleBlur("oldPassword")}
                  value={values.oldPassword}
                />
              </View>
              {touched.oldPassword && errors.oldPassword && (
                <Text style={[defaultStyles.text, defaultStyles.errorText]}>
                  {errors.oldPassword}
                </Text>
              )}

              <View style={defaultStyles.fieldContainer}>
                <MaterialCommunityIcons
                  name="lock"
                  size={20}
                  color={defaultStyles.colors.medium}
                  style={defaultStyles.icon}
                />
                <TextInput
                  placeholder="New Password"
                  autoCapitalize="none"
                  secureTextEntry
                  autoCorrect={false}
                  textContentType="newPassword"
                  style={[defaultStyles.input, defaultStyles.text]}
                  onChangeText={handleChange("newPassword")}
                  onBlur={handleBlur("newPassword")}
                  value={values.newPassword}
                />
              </View>
              {touched.newPassword && errors.newPassword && (
                <Text style={[defaultStyles.text, defaultStyles.errorText]}>
                  {errors.newPassword}
                </Text>
              )}

              <AppButton title="Change Password" onPress={handleSubmit} />
            </>
          )}
        </Formik>
      </Screen>
    </>
  );
}

export default ChangePasswordScreen;

import { useFormikContext } from "formik";
import { Text } from "react-native";
import AppTextInput from "../TextInput";
import defaultStyles from "../../config/styles";

function FormField({ name, ...otherProps }) {
  const { handleChange, setFieldTouched, errors, touched, values } =
    useFormikContext();

  return (
    <>
      <AppTextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        value={values[name]}
        {...otherProps}
      />
      {touched[name] && errors[name] && (
        <Text style={[defaultStyles.text, defaultStyles.errorText]}>
          {errors[name]}
        </Text>
      )}
    </>
  );
}

export default FormField;

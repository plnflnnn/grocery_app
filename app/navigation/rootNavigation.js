import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}


// import React from "react";

// export const navigationRef = React.createRef();

// const navigate = (name, params) =>
//   navigationRef.current?.navigate(name, params);

// export default {
//   navigate,
// };
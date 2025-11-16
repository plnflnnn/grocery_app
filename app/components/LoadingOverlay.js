import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

const LoadingOverlay = ({ visible }) => {
  if (!visible) return null;

  return (
    // <Modal transparent={true} animationType="fade" visible={visible}>
    //   <View style={styles.overlay}>
    //     <ActivityIndicator size="large" color="#fff" />
    //   </View>
    // </Modal>
    <></>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingOverlay;

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import InstaStory from "./src/components/SlideCircleView";
import { Provider } from "react-redux";
import { store } from "./src/store";
export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <InstaStory />
        <StatusBar style="auto" />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 20,
    position: "absolute",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Index() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://192.168.1.126:8080/api/test")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => setMessage("Error: " + error.message));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
});
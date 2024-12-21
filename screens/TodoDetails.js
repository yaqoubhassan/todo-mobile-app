import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import api from "../api";

export default function TodoDetails({ route, navigation }) {
  const { todo } = route.params;

  const deleteTodo = async () => {
    try {
      await api.delete(`/todos/${todo.id}`);
      Alert.alert("Success", "Todo deleted successfully.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to delete the todo. Please try again.");
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this todo?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: deleteTodo,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.todoContainer}>
        <Text style={styles.title}>Title: {todo.title}</Text>
        <Text style={styles.status}>Status: {todo.status}</Text>
        <Text style={styles.details}>Details: {todo.details}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Delete Todo" color="#D9534F" onPress={confirmDelete} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            color="#0275d8"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  todoContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#333" },
  status: { fontSize: 16, color: "#5bc0de", marginTop: 8 },
  details: { fontSize: 14, color: "#777", marginTop: 8 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
});

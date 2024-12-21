import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Picker } from "@react-native-picker/picker";
import api from "../api";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title is too short"),
  details: Yup.string().required("Details are required"),
  status: Yup.string().required("Status is required"),
});

export default function TodoForm({ route, navigation }) {
  const todo = route.params?.todo || {
    title: "",
    details: "",
    status: "not started",
  };

  const [showModal, setShowModal] = React.useState(false);
  const [modalOptions] = React.useState([
    { label: "Not Started", value: "not started" },
    { label: "In Progress", value: "in progress" },
    { label: "Completed", value: "completed" },
  ]);

  const handleSubmit = async (values) => {
    try {
      if (todo.id) {
        await api.put(`/todos/${todo.id}`, values);
      } else {
        await api.post("/todos", values);
      }
      Alert.alert("Success", "Todo saved successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting todo:", error.message);
      Alert.alert(
        "Error",
        "There was an error saving the todo. Please try again."
      );
    }
  };

  const renderDropdown = (value, onValueChange) => (
    <TouchableOpacity
      style={styles.modalTrigger}
      onPress={() => setShowModal(true)}
    >
      <Text>{value || "Select Status"}</Text>
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOption}
                onPress={() => {
                  onValueChange(option.value);
                  setShowModal(false);
                }}
              >
                <Text>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Formik
          initialValues={todo}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ handleChange, handleSubmit, values, touched, errors }) => (
            <View style={styles.container}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.title && errors.title ? styles.errorInput : null,
                ]}
                placeholder="Todo Title"
                value={values.title}
                onChangeText={handleChange("title")}
              />
              {touched.title && errors.title && (
                <Text style={styles.errorText}>{errors.title}</Text>
              )}

              <Text style={styles.label}>Details</Text>
              <TextInput
                style={[
                  styles.textarea,
                  touched.details && errors.details ? styles.errorInput : null,
                ]}
                placeholder="Todo Details"
                value={values.details}
                onChangeText={handleChange("details")}
                multiline={true}
                numberOfLines={6}
              />
              {touched.details && errors.details && (
                <Text style={styles.errorText}>{errors.details}</Text>
              )}

              <Text style={styles.label}>Status</Text>
              {Platform.OS === "ios" ? (
                renderDropdown(values.status, handleChange("status"))
              ) : (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.status}
                    onValueChange={handleChange("status")}
                    style={[
                      touched.status && errors.status
                        ? styles.errorInput
                        : null,
                    ]}
                  >
                    <Picker.Item label="Not Started" value="not started" />
                    <Picker.Item label="In Progress" value="in progress" />
                    <Picker.Item label="Completed" value="completed" />
                  </Picker>
                </View>
              )}
              {touched.status && errors.status && (
                <Text style={styles.errorText}>{errors.status}</Text>
              )}

              <View style={{ marginBottom: 20 }}>
                <Button
                  title={todo.id ? "Update" : "Create"}
                  onPress={handleSubmit}
                  color="#4CAF50"
                />
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  textarea: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    padding: 8,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  errorInput: {
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginBottom: 8,
  },
  modalTrigger: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
    alignItems: "center",
  },
});
